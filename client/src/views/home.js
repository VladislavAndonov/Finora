import "../../styles/home.css"

import { html } from "lit-html";
import { Chart } from "chart.js/auto";

import { getAccountById, getAllUserAccounts, getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { formatDate, toMidnight, toLocalDateString } from "../utils/dateUtils.js";
import { getActiveAccountId, setActiveAccountId } from "../state/sessionState.js";
import { navigate } from "../utils/navigation.js";
import { currencies } from "../utils/currencies.js";

const homeTemplate = ({ typeFilters, dateRangeFilters, transactionsByDate, accounts, selectAccount, onAddAccountClick, noTransactionsMessage, addAccountModal, activeAccountId, getCurrency, isAccountModalOpen, handleWheel }) =>
    html`
    <div class="home">
        <header class="home__header">
            <h1 class="home__title">Home</h1>
        </header>
 
        <div class="home__content">
 
            <section class="home__section home__accounts" aria-label="Accounts">
                <div class="home__accounts-scroller" id="accountScroller" @wheel=${handleWheel}>
                    ${accounts.length > 0 ? accounts.map((a) => html`
                        <button type="button"
                            class="home__btn home__account ${a._id === activeAccountId ? "home__account--active" : ""}"
                            aria-pressed="${a._id === activeAccountId}"
                            data-id=${a._id}
                            @click=${selectAccount}>
                            <span class="home__account-name">${a.name}</span>
                            <span class="home__account-balance">${getCurrency(a.currency)}${a.balance % 1 === 0 ? a.balance : Number(a.balance).toFixed(2)} ${a.currency}</span>
                        </button>
                    `) : null}
                    <button type="button" class="home__btn home__add-account" @click=${onAddAccountClick}>
                        <i class="ph ph-list-plus home__icon"></i>
                        Account
                    </button>
                </div>
            </section>
 
            ${isAccountModalOpen ? addAccountModal() : ""}
 
            <section class="home__section home__graph">
                <div class="home__graph-filters">
                    ${dateRangeFilters.map((f) => html`
                        <div class="home__graph-filter">
                            <input class="home__graph-radio" type="radio" .checked=${f.active} id="${f.label}" @change=${f.onClick}/>
                            <label class="home__graph-label" for="${f.label}">
                                ${f.label}
                            </label>
                        </div>
                    `)}
                </div>
                <div class="home__canvas-wrapper">
                    <canvas id="balance-graph" class="home__canvas" aria-label="Balance graph"></canvas>
                </div>
            </section>
 
            <section class="home__section home__transactions">
                ${transactionList(typeFilters, transactionsByDate, noTransactionsMessage)}
            </section>
 
        </div>
    </div>`;

export async function homeView(ctx) {
    const state = {
        today: toMidnight(new Date()),
        dateRange: toMidnight(new Date()),
        transactions: {
            all: [],
            expenses: [],
            income: []
        },
        activeAccounts: null,
        selectedAccount: null,
        ui: {
            graphInstance: null,
            activeTypeFilter: "all",
            activeDateFilter: "1m",
            isAccountModalOpen: false
        }
    };

    // ACCOUNT SETUP

    state.activeAccounts = await getAllUserAccounts({ isArchived: false });

    // Restore the previously selected account, or fall back to the first one
    const savedAccountId = getActiveAccountId();

    if (savedAccountId) {
        try {
            state.selectedAccount = await getAccountById(savedAccountId);
        } catch {
            setActiveAccountId(null);
            state.selectedAccount = state.activeAccounts[0] || null;
        }
    } else {
        state.selectedAccount = state.activeAccounts[0] || null;
    }

    async function selectAccount(e) {
        const accountId = e.currentTarget.dataset.id;
        if (accountId === state.selectedAccount?._id) return;

        try {
            const account = await getAccountById(accountId);
            setActiveAccountId(accountId);
            state.selectedAccount = account;
            await loadTransactions();
            update();
        } catch {
            showToast("Could not load account", "error");
        }
    }

    function onAddAccountClick() {
        state.ui.isAccountModalOpen = true;
        document.addEventListener('keydown', handleEscKey);
        update();
    }

    function onCloseModal() {
        state.ui.isAccountModalOpen = false;
        document.removeEventListener('keydown', handleEscKey);
        update();
    }

    function handleEscKey(e) {
        if (e.key === 'Escape') onCloseModal();
    }

    // ACCOUNT MODAL

    // Fetches all accounts (including archived) to show the full list in the modal
    const allAccounts = await getAllUserAccounts();

    const addAccountModal = () =>
        html`
        <div class="modal__backdrop" @click=${(e) => e.target === e.currentTarget && onCloseModal()}>
            <div class="modal__content">
 
                <div class="modal__header">
                    <div>
                        <p class="modal__title">Accounts</p>
                        <p class="modal__subtitle">${allAccounts.length} linked account${allAccounts.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button class="modal__close" type="button" @click=${onCloseModal}>
                        <i class="ph-bold ph-x"></i>
                    </button>
                </div>
 
                ${allAccounts.length > 0
                ? html`
                        <ul class="modal__account-list">
                            ${allAccounts.map((a) => html`
                                <li class="modal__account-item">
                                    <a href="/accounts/edit/${a._id}" class="modal__account-link" @click=${navigate}>
                                        <div class="modal__account-info">
                                            <span class="modal__account-name">${a.name}</span>
                                            <span class="modal__account-currency">${a.currency}</span>
                                        </div>
                                        ${a.isArchived
                        ? html`<span class="modal__account-status--archived">Archived</span>`
                        : html`<span class="modal__account-status--active">Active</span>`
                    }
                                    </a>
                                </li>`)}
                        </ul>` : html`
                        <div class="modal__empty">
                            <p>No accounts yet</p>
                        </div>`}
 
                <div class="modal__actions">
                    <a href="/accounts/add" class="modal__btn modal__btn--primary" @click=${navigate}>Create Account</a>
                </div>
 
            </div>
        </div>
    `

    // CURRENCY HELPERS

    function getCurrency(accountCurrency) {
        const currency = currencies.find((c) => c.code === accountCurrency);
        return currency?.sign;
    }

    function getActiveCurrencySign() {
        return getCurrency(state.selectedAccount?.currency) ?? state.selectedAccount?.currency ?? '$';
    }

    // FILTERS

    const dateRangeFilters = [
        { label: "1w", range: 7, active: false },
        { label: "1m", range: 30, active: true },
        { label: "6m", range: 180, active: false },
        { label: "1y", range: 365, active: false }
    ];

    const typeFilters = [
        { label: "All", onClick: () => setActiveTypeFilter("all"), active: true },
        { label: "Expenses", onClick: () => setActiveTypeFilter("expenses"), active: false },
        { label: "Income", onClick: () => setActiveTypeFilter("income"), active: false }
    ];

    function setActiveFilter(label, filters) {
        filters.forEach(f => f.active = f.label === label);
    }

    function setActiveTypeFilter(type) {
        state.ui.activeTypeFilter = type;
        const labelMap = { all: "All", expenses: "Expenses", income: "Income" };
        setActiveFilter(labelMap[type], typeFilters);
        update();
    }

    // Each date filter sets itself as active, then re-fetches and re-renders
    dateRangeFilters.forEach(f => {
        f.onClick = async () => {
            setActiveFilter(f.label, dateRangeFilters);
            await loadTransactions();
            update();
        };
    });

    // TRANSACTIONS

    async function loadTransactions() {
        if (!state.selectedAccount) return;

        state.transactions = { all: [], expenses: [], income: [] };

        const activeFilter = dateRangeFilters.find((f) => f.active);
        state.dateRange = toMidnight(new Date());
        state.dateRange.setDate(state.today.getDate() - (activeFilter.range - 1));
        state.ui.activeDateFilter = activeFilter.label;

        const result = await getTransactions({
            startDate: toLocalDateString(state.dateRange),
            endDate: toLocalDateString(state.today)
        });

        if (!result) return;

        state.transactions.all = result;
        state.transactions.expenses = result.filter((t) => t.type === "expenses");
        state.transactions.income = result.filter((t) => t.type === "income");
    }

    await loadTransactions();

    // Returns the correct transactions array based on the active type filter
    function getTransactionsByType() {
        return state.transactions[state.ui.activeTypeFilter] ?? state.transactions.all;
    }

    // Groups a list of transactions into { "Jan 1": [...], "Jan 2": [...] }
    function groupByDate(transactions) {
        const grouped = {};

        for (const transaction of transactions) {
            const dateKey = formatDate(transaction.date);

            if (grouped.hasOwnProperty(dateKey)) {
                grouped[dateKey].push(transaction);
            } else {
                grouped[dateKey] = [transaction];
            }
        }

        return grouped;
    }

    function getDisplayedTransactions() {
        return groupByDate(getTransactionsByType());
    }

    // GRAPH

    function buildDateLabels() {
        const labels = [];
        let currentDate = new Date(state.dateRange);

        while (currentDate <= state.today) {
            labels.push(currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return labels;
    }

    // Builds balance by walking backwards from today, undoing each day's net change to estimate what the balance was on each date
    function buildBalanceData() {
        const dailyTotals = {};

        for (const transaction of getTransactionsByType()) {
            const dateKey = toLocalDateString(new Date(transaction.date));
            const amount = transaction.type === "income" ? transaction.amount : -transaction.amount;

            dailyTotals[dateKey] = (dailyTotals[dateKey] ?? 0) + amount;
        }

        const balances = [];
        let currentBalance = state.selectedAccount?.balance || 0;
        let currentDate = toMidnight(new Date(state.today));

        while (currentDate >= state.dateRange) {
            const dateKey = toLocalDateString(currentDate);
            balances.push(currentBalance);
            currentBalance -= (dailyTotals[dateKey] || 0);
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return balances.reverse();
    }

    function renderGraph() {
        const canvas = document.getElementById("balance-graph");

        if (!state.ui.graphInstance) {
            state.ui.graphInstance = createGraph(canvas);
        }

        updateGraph();
    }

    function updateGraph() {
        state.ui.graphInstance.data.labels = buildDateLabels();
        state.ui.graphInstance.data.datasets[0].data = buildBalanceData();
        state.ui.graphInstance.update();
    }

    const crosshairPlugin = {
        id: 'crosshair',
        afterDatasetsDraw(chart) {
            const activeElements = chart.getActiveElements();
            if (activeElements.length === 0) return;

            const { ctx, chartArea: { top, bottom, left, right } } = chart;
            const { x, y } = activeElements[0].element;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
            ctx.stroke();
            ctx.restore();
        }
    };

    let width, height, gradient;
    function getGradient(ctx, chartArea) {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;

        if (!gradient || width !== chartWidth || height !== chartHeight) {
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.25, 'rgba(93, 180, 253, 0.06)');
            gradient.addColorStop(0.5, 'rgba(93, 180, 253, 0.14)');
            gradient.addColorStop(0.75, 'rgba(93, 180, 253, 0.28)');
            gradient.addColorStop(1, 'rgba(93, 180, 253, 0.5)');
        }

        return gradient;
    }

    function createGraph(canvas) {
        return new Chart(canvas, {
            type: 'line',
            plugins: [crosshairPlugin],
            data: {
                labels: [],
                datasets: [{
                    label: 'Balance',
                    data: [],
                    fill: true,
                    backgroundColor: (context) => {
                        const { ctx, chartArea } = context.chart;
                        // chartArea is undefined on the very first render
                        if (!chartArea) return null;
                        return getGradient(ctx, chartArea);
                    },
                    borderColor: 'rgb(93, 180, 253)',
                    tension: 0.1,
                    pointRadius: 0,
                    pointHitRadius: 12,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgb(56, 148, 249)',
                    pointHoverBorderColor: 'rgba(93, 180, 253, 0.4)',
                    pointHoverBorderWidth: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgb(18, 18, 18)',
                        padding: 14,
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderWidth: 1,
                        titleColor: 'rgb(163, 163, 163)',
                        titleFont: { size: 14 },
                        bodyColor: 'rgb(250, 250, 250)',
                        bodyFont: { size: 16, weight: 'bold' },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: (item) => `${getActiveCurrencySign()} ${item.parsed.y.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 4,
                            autoSkip: "true"
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.07)' },
                    },
                    y: {
                        position: "right",
                        border: { display: false },
                        ticks: {
                            callback: (val) => `${getActiveCurrencySign()} ${val.toLocaleString()}`
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.07)' },
                    }
                }
            }
        });
    }

    // RENDER

    const handleWheel = (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };

    const update = () => {
        ctx.render(homeTemplate({
            typeFilters,
            dateRangeFilters,
            transactionsByDate: getDisplayedTransactions(),
            noTransactionsMessage: "No transactions for the selected period.",
            accounts: state.activeAccounts,
            activeAccountId: state.selectedAccount?._id,
            selectAccount,
            isAccountModalOpen: state.ui.isAccountModalOpen,
            onAddAccountClick,
            addAccountModal,
            getCurrency,
            handleWheel
        }));

        renderGraph();

        // Scroll the active account into view after every render
        setTimeout(() => {
            const scroller = document.getElementById('accountScroller');
            scroller?.querySelector('.home__account--active')
                ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 0);
    };

    update();
}