import { html } from "lit-html";

import { getTransactions, getUserBalance } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { Chart } from "chart.js/auto";

let graphInstance = null;

const homeTemplate = ({ filters, transactions, balance }) =>
    html`
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <section class="home-layout">
        <section class="finance-overview">
            <div class="balance">
                Balance: €${balance}
            </div>
            <div class="monthly-goal">
            </div>
        </section>
        <section class="line-graph"> 
            <canvas id="canvas"></canvas>
        </section>
        <section class="transaction-list">
            ${transactionList(filters, transactions)}
        </section >
    </section >`;


export async function homeView(ctx) {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const queryFilterOptions = {
        startDate: thirtyDaysAgo.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0]
    }

    const state = {
        transactions: await getTransactions(queryFilterOptions),
        balance: await getUserBalance(),
    }

    const showAllTransactions = async () => {
        state.transactions = await getTransactions(queryFilterOptions);
        setActive("All");
        update();
    };
    const showExpenses = async () => {
        state.transactions = await getTransactions({ ...queryFilterOptions, type: "expenses" });
        setActive("Expenses");
        update();
    };
    const showIncome = async () => {
        state.transactions = await getTransactions({ ...queryFilterOptions, type: "income" });
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

    function getDatesArray() {
        const datesArray = [];
        let currentDate = new Date(thirtyDaysAgo)
        const endDate = today;


        while (currentDate <= endDate) {
            datesArray.push(currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

            currentDate.setDate(currentDate.getDate() + 1)
        }
        return datesArray
    }

    function buildBalanceMovement() {
        const balanceMovementByDate = {};

        // Group transactions by date
        for (const transaction of state.transactions) {
            const dateKey = transaction.date.split("T")[0];
            const amount =
                transaction.type === "income"
                    ? transaction.amount
                    : -transaction.amount;

            balanceMovementByDate[dateKey] =
                (balanceMovementByDate[dateKey] || 0) + amount;
        }

        // Iterate backward through dates and build balance movement
        const balances = [];
        let currentBalance = state.balance;

        let currentDate = new Date(today);
        const endDate = thirtyDaysAgo;

        while (currentDate >= endDate) {
            const dateKey = currentDate.toISOString().split("T")[0];
            const dailyChange = balanceMovementByDate[dateKey] || 0;

            balances.push(currentBalance);

            currentBalance -= dailyChange;

            currentDate.setDate(currentDate.getDate() - 1);
        }

        return balances.reverse();
    }


    function renderGraph() {
        const canvas = document.getElementById("canvas");
        if (!canvas) return

        if (!graphInstance) {
            graphInstance = createGraph(canvas);
        }

        const labels = getDatesArray()
        const balances = buildBalanceMovement()

        updateGraph(labels, balances)
    }

    function updateGraph(labels, balances) {
        if (!graphInstance) return;

        graphInstance.data.labels = labels;
        graphInstance.data.datasets[0].data = balances;
        graphInstance.update();
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
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                    }, scales: {
                        x: {
                            ticks: {
                                autoSkip: false,
                                callback: function (val, index) {
                                    // Hide every 5th tick label
                                    return index % 5 === 0 ? this.getLabelForValue(val) : null;
                                }
                            }
                        }
                    }
                }
            });
    }

    const update = () => {
        ctx.render(homeTemplate({ filters, transactions: state.transactions, balance: state.balance }));
        renderGraph()
    }

    update()
}


/*
 function computeData() {
            const datesArray = [];
            const balanceMovement = [];
            const startDate = sameDayPreviousMonth();
            const endDate = today;
            const currentBalance = state.balance

            let currentDate = new Date(startDate)

            while (currentDate <= endDate) {
                

                currentDate.setDate(currentDate.getDate() + 1)
            }

            return { datesArray, balanceMovement }
        }
*/