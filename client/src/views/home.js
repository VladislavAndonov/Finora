import "../../styles/home.css"

import { html } from "lit-html";
import { Chart } from "chart.js/auto";

import { getAllUserAccounts, getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { formatDate } from "../utils/dateUtils.js";
import { getActiveAccountId, setActiveAccountId } from "../state/sessionState.js";
import { navigate } from "../utils/navigation.js";
import { currencies } from "../utils/currencies.js";

const homeTemplate = ({ filters, transactionsByDate, accounts, selectAccount, onAddAccountClick, noTransactionsMessage, addAccountModal, activeAccountId, getCurrency, isAccountModalOpen }) =>
    html`
    <div class="home">
        <header class="home__header">
            <h1 class="home__title">Home</h1>
        </header>

        <div class="home__content">

            <section class="home__section home__accounts">
                <div class="home__accounts-scroller" id="accountScroller">
                    ${accounts.length > 0 ? accounts.map((a) => html`
                        <button type="button"
                            class="home__btn home__account ${a._id === activeAccountId ? "home__account--active" : ""}"
                            data-id=${a._id}
                            @click=${selectAccount}>
                            <span class="home__account-name">${a.name}</span>
                            <span class="home__account-balance">${getCurrency(a.currency)}${a.balance % 1 === 0 ? a.balance : Number(a.balance).toFixed(2)} ${a.currency}</span>
                        </button>
                    `) : null}
                    <button type="button" class="home__btn home__add-account" @click=${onAddAccountClick}>
                        <i class="fa-solid fa-file-circle-plus"></i>
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
        activeAccountId: getActiveAccountId() || null,
        ui: {
            activeTab: "all",
            graphInstance: null,
            isAccountModalOpen: false
        }
    }

    state.activeAccounts = await getAllUserAccounts({ isArchived: false });

    function getCurrency(accountCurrency) {

        const currency = currencies.find((c) => c.code === accountCurrency)

        return currency?.sign
    }

    async function selectAccount(e) {
        const accountId = e.currentTarget.dataset.id;

        if (accountId === state.activeAccountId) return

        setActiveAccountId(accountId)
        state.activeAccountId = accountId

        await loadTransactions();
        update();
    }

    function onAddAccountClick() {
        state.ui.isAccountModalOpen = true

        update()
    }

    function onClose() {
        state.ui.isAccountModalOpen = false

        update();
    }

    const allAccounts = await getAllUserAccounts()

    const addAccountModal = () =>
        html`
        <div class="modal__backdrop" @click=${(e) => e.target === e.currentTarget && onClose()}>
            <div class="modal__content">
                <div class="modal__header">
                    <div>
                        <p class="modal__title">Accounts</p>
                        <p class="modal__subtitle">${allAccounts.length} linked account${allAccounts.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button class="modal__close" @click=${onClose}>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                ${allAccounts.length > 0
                ? html`
                        <ul class="modal__account-list">
                            ${allAccounts.map((a) => html`
                                <li class="modal__account-item">
                                    <a href="/accounts/edit/${a._id}" class="modal__account-link" @click=${navigate}>
                                        <div class="modal__account-info">
                                            <div class="modal__account-status">
                                                <span class="modal__account-name">${a.name}</span>
                                                ${a.isArchived ? html`<span class="modal__account-status--archived">Archived</span>` : html`<span class="modal__account-status--active">Active</span>`}
                                            </div>
                                           <span class="modal__account-currency">${a.currency}</span>
                                        </div>
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
                    <a href="/accounts/add" class="modal__btn modal__btn--primary" @click=${navigate}>
                        Create Account
                    </a>
                </div>
            </div>
        </div>
    `

    state.thirtyDaysAgo.setDate(state.today.getDate() - 30);

    async function loadTransactions() {
        if (!state.activeAccountId) return;

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
        const activeAccount = state.activeAccounts.find(a => a._id === state.activeAccountId);
        let currentBalance = activeAccount?.balance || 0;

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

    let width, height, gradient;
    function getGradient(ctx, chartArea) {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        if (!gradient || width !== chartWidth || height !== chartHeight) {
            // Create the gradient because this is either the first render or the size of the chart has changed
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "#00000000");
            gradient.addColorStop(0.5, "#96afff40");
            gradient.addColorStop(1, "#96afff70");
        }

        return gradient;
    }

    function createGraph(canvas) {
        return new Chart(
            canvas,
            {
                type: 'line',
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
                        borderColor: '#96afff',
                        tension: 0.1,
                    }]
                },
                options: {
                    pointRadius: 0,
                    pointHitRadius: 10,
                    pointHoverRadius: 8,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }, scales: {
                        x: {
                            ticks: {
                                callback: function (val, index) {
                                    // Hide every 5th tick label
                                    return index % 5 === 0 ? this.getLabelForValue(val) : null;
                                }
                            },
                            grid: {
                                color: "#ffffff10",
                            }
                        },
                        y: {
                            grid: {
                                color: "#ffffff10",
                            },
                        }
                    }
                }
            });

    }

    const update = () => {
        ctx.render(homeTemplate({
            filters,
            transactionsByDate: getDisplayedTransactions(),
            noTransactionsMessage: "No transactions for the last 30 days.",

            accounts: state.activeAccounts,
            activeAccountId: state.activeAccountId,
            selectAccount,

            isAccountModalOpen: state.ui.isAccountModalOpen,
            onAddAccountClick,
            addAccountModal,

            getCurrency
        }));

        renderGraph()

        const accountScroller = document.getElementById('accountScroller');

        // Auto-scroll on every render
        setTimeout(() => {
            const active = accountScroller?.querySelector('.home__account--active');
            active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 0);

        // Mouse scroll behavior
        accountScroller.addEventListener('wheel', (e) => {
            e.preventDefault();
            accountScroller.scrollLeft += e.deltaY * 0.3;
        }, { passive: false });

    }

    update()
}
