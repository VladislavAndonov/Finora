import "../../styles/home.css"

import { html } from "lit-html";
import { Chart } from "chart.js/auto";

import { getAccountById, getAllUserAccounts, getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { formatDate } from "../utils/dateUtils.js";
import { getActiveAccountId, setActiveAccountId } from "../state/sessionState.js";
import { navigate } from "../utils/navigation.js";
import { currencies } from "../utils/currencies.js";

const homeTemplate = ({ filters, transactionsByDate, accounts, selectAccount, onAddAccountClick, noTransactionsMessage, addAccountModal, activeAccountId, getCurrency, isAccountModalOpen, handleWheel }) =>
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

            <section class="home__section home__chart">
                <canvas id="balance-chart" class="home__canvas" aria-label="Balance chart"></canvas>
            </section>

            <section class="home__section home__transactions">
                ${transactionList(filters, transactionsByDate, noTransactionsMessage)}
            </section>

        </div>
    </div>`;


export async function homeView(ctx) {
    const state = {
        today: new Date(),
        thirtyDaysAgo: new Date(),
        transactions: {
            all: [],
            expenses: [],
            income: []
        },
        activeAccounts: null,
        selectedAccount: null,
        ui: {
            activeTab: "all",
            graphInstance: null,
            isAccountModalOpen: false
        }
    }

    state.activeAccounts = await getAllUserAccounts({ isArchived: false });
    const activeId = getActiveAccountId();

    if (activeId) {
        try {
            state.selectedAccount = await getAccountById(activeId);
        } catch {
            setActiveAccountId(null);
            state.selectedAccount = state.activeAccounts[0] || null;
        }
    } else {
        state.selectedAccount = state.activeAccounts[0] || null;
    }

    function getCurrency(accountCurrency) {

        const currency = currencies.find((c) => c.code === accountCurrency)

        return currency?.sign
    }

    function getActiveCurrencySign() {
        return getCurrency(state.selectedAccount?.currency) ?? state.selectedAccount?.currency ?? '$';
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
        state.ui.isAccountModalOpen = true
        document.addEventListener('keydown', handleEscKey);

        update()
    }

    function onCloseModal() {
        state.ui.isAccountModalOpen = false
        document.removeEventListener('keydown', handleEscKey);

        update();
    }

    function handleEscKey(e) {
        if (e.key === 'Escape') {
            onCloseModal();
        }
    }

    const allAccounts = await getAllUserAccounts()

    // Account modal

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
                                </li>
                            `)}
                        </ul>
                    `
                : html`
                        <div class="modal__empty">
                            <p>No accounts yet</p>
                        </div>
                    `
            }
 
                <div class="modal__actions">
                    <a href="/accounts/add" class="modal__btn modal__btn--primary" @click=${navigate}>Create Account</a>
                </div>
 
            </div>
        </div>
    `

    state.thirtyDaysAgo.setDate(state.today.getDate() - 30);

    async function loadTransactions() {
        if (!state.selectedAccount) return;

        const result = await getTransactions({
            startDate: state.thirtyDaysAgo.toISOString().split("T")[0],
            endDate: state.today.toISOString().split("T")[0]
        });

        if (!result) return

        state.transactions.all = result;
        state.transactions.expenses = result.filter((t) => t.type === "expenses");
        state.transactions.income = result.filter((t) => t.type === "income");
    }

    await loadTransactions()

    function showAllTransactions() {
        state.ui.activeTab = "all";
        setActive("All");
        update();
    };
    function showExpenses() {
        state.ui.activeTab = "expenses";
        setActive("Expenses");
        update();
    };
    function showIncome() {
        state.ui.activeTab = "income";
        setActive("Income");
        update();
    };

    const filters = [
        { label: "All", onClick: showAllTransactions, active: true },
        { label: "Expenses", onClick: showExpenses, active: false },
        { label: "Income", onClick: showIncome, active: false }
    ];

    const setActive = (label) => {
        filters.forEach(f => {
            if (f.label === label) {
                f.active = true;
            } else {
                f.active = false;
            }
        });
    };

    function getDisplayedTransactions() {
        const transactionsByDate = {}
        let transactions = []

        switch (state.ui.activeTab) {
            case "expenses":
                transactions = state.transactions.expenses;
                break
            case "income":
                transactions = state.transactions.income;
                break
            default:
                transactions = state.transactions.all;
        }


        for (const transaction of transactions) {
            const dateKey = formatDate(transaction.date)

            if (transactionsByDate.hasOwnProperty(dateKey)) {
                transactionsByDate[dateKey].push(transaction)
            } else {
                transactionsByDate[dateKey] = [transaction]
            }
        }

        return transactionsByDate
    }

    function buildDateLabels() {
        const labels = [];
        let currentDate = new Date(state.thirtyDaysAgo)
        const endDate = state.today;


        while (currentDate <= endDate) {
            labels.push(currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

            currentDate.setDate(currentDate.getDate() + 1)
        }
        return labels
    }

    function buildBalanceChangesData() {
        const chartData = {};
        let transactions = []

        switch (state.ui.activeTab) {
            case "expenses":
                transactions = state.transactions.expenses;
                break
            case "income":
                transactions = state.transactions.income;
                break
            default:
                transactions = state.transactions.all;
        }

        for (const transaction of transactions) {
            const dateKey = transaction.date.split("T")[0];
            const amount = transaction.type === "income" ? transaction.amount : -transaction.amount;

            if (chartData.hasOwnProperty(dateKey)) {
                chartData[dateKey] += amount
            } else {
                chartData[dateKey] = amount
            }
        }

        // Iterate backward through dates and build balance movement
        const balances = [];
        let currentBalance = state.selectedAccount?.balance || 0;

        let currentDate = new Date(state.today);
        const endDate = state.thirtyDaysAgo;

        while (currentDate >= endDate) {
            const dateKey = currentDate.toISOString().split("T")[0];
            const dailyChange = chartData[dateKey] || 0;

            balances.push(currentBalance);

            currentBalance -= dailyChange;

            currentDate.setDate(currentDate.getDate() - 1);
        }

        return balances.reverse();
    }


    function renderGraph() {
        const canvas = document.getElementById("balance-chart");

        if (!state.graphInstance) {
            state.graphInstance = createGraph(canvas);
        }

        updateGraph()
    }

    function updateGraph() {
        const chartLabels = buildDateLabels()
        const chartData = buildBalanceChangesData()

        state.graphInstance.data.labels = chartLabels;
        state.graphInstance.data.datasets[0].data = chartData;
        state.graphInstance.update();
    }

    const crosshairPlugin = {
        id: 'crosshair',
        afterDatasetsDraw(chart) {
            const activeElements = chart.getActiveElements();

            if (activeElements.length > 0) {
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
        return new Chart(
            canvas,
            {
                type: 'line',
                plugins: [crosshairPlugin],
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Balance',
                        data: [],
                        fill: true,
                        backgroundColor: (context) => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;

                            // chartArea is undefined on initial render
                            if (!chartArea) {
                                return null;
                            }

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
                            titleFont: {
                                size: 14
                            },
                            bodyColor: 'rgb(250, 250, 250)',
                            bodyFont: {
                                size: 16,
                                weight: 'bold'
                            },
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: (item) => {
                                    return `${getActiveCurrencySign()} ${item.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                callback: function (val, index) {
                                    // Hide every 5th tick label
                                    return index % 5 === 0 ? this.getLabelForValue(val) : null;
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.07)'
                            },
                        },
                        y: {
                            position: "right",
                            border: { display: false },
                            ticks: {
                                callback: (val) => {
                                    return `${getActiveCurrencySign()} ${val.toLocaleString()}`;
                                },
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.07)'
                            },
                        }
                    }
                }
            });

    }

    const handleWheel = (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };

    const update = () => {
        ctx.render(homeTemplate({
            filters,
            transactionsByDate: getDisplayedTransactions(),
            noTransactionsMessage: "No transactions for the last 30 days.",

            accounts: state.activeAccounts,
            activeAccountId: state.selectedAccount?._id,
            selectAccount,

            isAccountModalOpen: state.ui.isAccountModalOpen,
            onAddAccountClick,
            addAccountModal,

            getCurrency,
            handleWheel
        }));

        renderGraph()

        const accountScroller = document.getElementById('accountScroller');

        // Auto-scroll on every render
        setTimeout(() => {
            const active = accountScroller?.querySelector('.home__account--active');
            active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 0);
    }

    update()
}
