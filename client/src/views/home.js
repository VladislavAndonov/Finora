import "../../styles/home.css"

import { html } from "lit-html";
import { Chart } from "chart.js/auto";

import { getAccount, getAllUserAccounts, getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { formatDate } from "../utils/dateUtils.js";
import { getActiveAccountId, setActiveAccountId } from "../state/sessionState.js";

const homeTemplate = ({ filters, transactionsByDate, accounts, selectAccount, noTransactionsMessage }) =>
    html`
    <div class="home">
        <header class="home__header">
            <h1 class="home__title">Home</h1>
        </header>

        <div class="home__content">

            <section class="home__section home__accounts">
                ${accounts.map((a) => html`
                    <button type="button"
                        class="home__account ${a._id === state.activeAccountId ? "home__account--active" : ""}"
                        data-id=${a._id}
                        @click=${selectAccount}>
                        <span class="home__account-name">${a.name}</span>
                        <span class="home__account-balance">${a.currency}</span>
                    </button>
                `)}
            </section>

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
        userAccounts: await getAllUserAccounts(),
        activeAccountId: null,
        ui: {
            activeTab: "all",
            graphInstance: null
        }
    }

    state.activeAccountId = getActiveAccountId() || state.userAccounts[0]?._id || null;

    if (state.activeAccountId) {
        await loadTransactions();
    }

    async function selectAccount(e) {
        const accountId = e.target.dataset.id;

        if (accountId === state.activeAccountId) return

        setActiveAccountId(accountId)
        state.activeAccountId = accountId

        await loadTransactions();
        update();
    }

    state.thirtyDaysAgo.setDate(state.today.getDate() - 30);

    async function loadTransactions() {
        if (!state.activeAccountId) return;

        const result = await getTransactions({
            acccountId: state.activeAccountId,
            startDate: state.thirtyDaysAgo.toISOString().split("T")[0],
            endDate: state.today.toISOString().split("T")[0]
        });

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
        let currentBalance = state.activeAccountId?.balance;

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
            // Create the gradient because this is either the first render
            // or the size of the chart has changed
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "#96afff10");
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
            transactionsByDate: getDisplayedTransactions(),
            accounts: state.userAccounts,
            selectAccount,
            filters,
            noTransactionsMessage: "No transactions for the last 30 days."
        }));

        renderGraph()
    }

    update()
}



/*



*/