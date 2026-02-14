import "../../styles/home.css"

import { html } from "lit-html";
import { Chart } from "chart.js/auto";

import { getTransactions, getUserBalance } from '../api/data.js';
import { transactionList } from './common/transactionList.js';

const homeTemplate = ({ filters, transactions, balance }) =>
    html`
    <div class="home-view">
        <header class="home-view-header">
            <h2 class="home-view-title">Home</h2>
        </header>

        <div class="home-view-layout">
            <section class="home-finance-overview">
                <div class="home-balance">
                    <span class="home-balance-account">Bank</span>
                    <span class="home-balance-amount">€${balance} EUR</span>
                </div>
                <div class="home-monthly-goal">
                </div>
            </section>

            <section class="home-chart"> 
                <canvas id="home-chart-canvas"></canvas>
            </section>

            <section class="home-transaction-list">
                ${transactionList(filters, transactions)}
            </section>
        </div >
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
        balance: await getUserBalance(),
        ui: {
            activeTab: "all",
            graphInstance: null
        }
    }

    state.thirtyDaysAgo.setDate(state.today.getDate() - 30);

    async function loadTransactions() {
        const result = await getTransactions({
            startDate: state.thirtyDaysAgo.toISOString().split("T")[0],
            endDate: state.today.toISOString().split("T")[0]
        });

        state.transactions.all = result;
        state.transactions.expenses = result.filter((t) => t.type === "expenses");
        state.transactions.income = result.filter((t) => t.type === "income");
    }

    await loadTransactions()

    const showAllTransactions = async () => {
        state.ui.activeTab = "all";
        setActive("All");
        update();
    };
    const showExpenses = async () => {
        state.ui.activeTab = "expenses";
        setActive("Expenses");
        update();
    };
    const showIncome = async () => {
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
        if (state.ui.activeTab === "expenses") {
            return state.transactions.expenses;
        }

        if (state.ui.activeTab === "income") {
            return state.transactions.income;
        }

        return state.transactions.all
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

        // Group transactions by date
        for (const transaction of getDisplayedTransactions()) {
            const dateKey = transaction.date.split("T")[0];
            const amount =
                transaction.type === "income"
                    ? transaction.amount
                    : -transaction.amount;

            chartData[dateKey] =
                (chartData[dateKey] || 0) + amount;
        }

        // Iterate backward through dates and build balance movement
        const balances = [];
        let currentBalance = state.balance;

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
        const canvas = document.getElementById("home-chart-canvas");

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
            transactions: getDisplayedTransactions(),
            balance: state.balance,
            filters
        }));

        renderGraph()
    }

    update()
}