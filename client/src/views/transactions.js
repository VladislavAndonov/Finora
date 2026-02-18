import "../../styles/transactions.css"

import { html } from "lit-html";
import { Chart } from "chart.js";

import { getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { getMonthAndYearLabel } from '../utils/dateUtils.js';

const categoriesMasterList = [
    // Expenses
    { id: 1, name: "housing", type: "expenses", color: "#2E7D32" },
    { id: 2, name: "utilities", type: "expenses", color: "#0288D1" },
    { id: 3, name: "groceries", type: "expenses", color: "#43A047" },
    { id: 4, name: "dining", type: "expenses", color: "#F4511E" },
    { id: 5, name: "transport", type: "expenses", color: "#546E7A" },
    { id: 6, name: "health", type: "expenses", color: "#E53935" },
    { id: 7, name: "shopping", type: "expenses", color: "#8E24AA" },
    { id: 8, name: "entertainment", type: "expenses", color: "#FFB300" },
    { id: 9, name: "education", type: "expenses", color: "#3949AB" },
    { id: 10, name: "debt", type: "expenses", color: "#6D4C41" },
    { id: 11, name: "travel", type: "expenses", color: "#00ACC1" },
    { id: 12, name: "insurance", type: "expenses", color: "#5E35B1" },
    { id: 13, name: "kids", type: "expenses", color: "#FF7043" },
    { id: 14, name: "pets", type: "expenses", color: "#26A69A" },
    { id: 15, name: "gifts", type: "expenses", color: "#EC407A" },
    { id: 16, name: "subscriptions", type: "expenses", color: "#7CB342" },
    { id: 17, name: "other", type: "expenses", color: "#9E9E9E" },

    // Income
    { id: 18, name: "salary", type: "income", color: "#00C853" },
    { id: 19, name: "freelance", type: "income", color: "#00B0FF" },
    { id: 20, name: "business", type: "income", color: "#FFD600" },
    { id: 21, name: "bonus", type: "income", color: "#FF6D00" },
    { id: 22, name: "investment", type: "income", color: "#00E676" },
    { id: 23, name: "rental", type: "income", color: "#1DE9B6" },
    { id: 24, name: "refund", type: "income", color: "#651FFF" },
    { id: 25, name: "gift", type: "income", color: "#FF4081" },
    { id: 26, name: "other", type: "income", color: "#64DD17" }
]

const transactionsTemplate = ({ transactions, showPrevMonth, showNextMonth, filters, state }) =>
    html`
    <div class="transactions">
        <header class="transactions__header">
            <h2 class="transactions__title">Transactions</h2>
        </header>

        <div class="transactions__content">

            <div class="transactions__nav-bar">
                <button class="transactions__nav-btn transactions__nav-btn--prev" @click=${showPrevMonth}>
                    <i class="fa-solid fa-angle-left"></i>
                </button>
                <h4 class="transactions__month">${getMonthAndYearLabel(state.currentDate)}</h4>
                <button class="transactions__nav transactions__nav-btn--next" @click=${showNextMonth}>
                    <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>
            
            ${transactionList(filters, transactions)}

            <section class="transactions__charts">
                <div class="transactions__chart ${state.ui.activeTab === "expenses" ? "transactions__chart--active" : "transactions__chart--inactive"}">
                    <canvas id="expenses-chart" class="transactions__canvas"></canvas>
                </div>

                <div class="transactions__chart ${state.ui.activeTab === "income" ? "transactions__chart--active" : "transactions__chart--inactive"}">
                    <canvas id="income-chart" class="transactions__canvas"></canvas>
                </div>
            </section>

        </div>
    </div>`;

export const transactionsView = async (ctx) => {
    const state = {
        currentDate: new Date(),

        monthTransactions: {
            all: [],
            expenses: [],
            income: []
        },

        ui: {
            activeTab: "all",
            expensesGraphInstance: null,
            incomeGraphInstance: null
        }
    };

    async function loadMonthTransactions() {
        const transactions = await getTransactions({
            year: state.currentDate.getFullYear(),
            month: state.currentDate.getMonth()
        })

        state.monthTransactions.all = transactions;
        state.monthTransactions.expenses = transactions.filter((t) => t.type === "expenses");
        state.monthTransactions.income = transactions.filter((t) => t.type === "income");
    }

    await loadMonthTransactions()

    function showAllTransactions() {
        state.ui.activeTab = "all"
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
                transactions = state.monthTransactions.expenses;
                break
            case "income":
                transactions = state.monthTransactions.income;
                break
            default:
                transactions = state.monthTransactions.all;
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

    function buildTransactionCategoriesData(type) {
        const chartData = [];
        let sourceTransactions = [];

        if (type === "expenses") {
            sourceTransactions = state.monthTransactions.expenses;
        } else if (type === "income") {
            sourceTransactions = state.monthTransactions.income;
        }

        if (sourceTransactions.length === 0) {
            return {
                isEmpty: true,
                labels: ["No data"],
                data: [1],
                colors: ["#252525"]
            };
        }

        for (const transaction of sourceTransactions) {
            const category = categoriesMasterList.find(c =>
                c.name === transaction.category &&
                c.type === transaction.type
            );

            if (!category) continue;

            const existingEntry = chartData.find(e => e.id === category.id);

            if (existingEntry) {
                existingEntry.amount += transaction.amount;
            } else {
                chartData.push({
                    id: category.id,
                    name: category.name,
                    color: category.color,
                    amount: transaction.amount
                });
            }
        }

        return {
            isEmpty: false,
            labels: chartData.map(e => e.name),
            data: chartData.map(e => e.amount),
            colors: chartData.map(e => e.color)
        };
    }

    function renderExpensesGraph() {
        const canvas = document.getElementById("income-chart");

        if (!state.expensesGraphInstance) {
            state.expensesGraphInstance = createGraph(canvas, "Expenses distribution");
        }

        updateGraph(state.expensesGraphInstance, "expenses");
        state.expensesGraphInstance.resize();
    }

    function renderIncomeGraph() {
        const canvas = document.getElementById("expenses-chart");

        if (!state.incomeGraphInstance) {
            state.incomeGraphInstance = createGraph(canvas, "Income distribution");
        }

        updateGraph(state.incomeGraphInstance, "income");
        state.incomeGraphInstance.resize();
    }

    function updateGraph(graph, type) {
        const result = buildTransactionCategoriesData(type);

        graph.data.labels = result.labels;
        graph.data.datasets[0].data = result.data;
        graph.data.datasets[0].backgroundColor = result.colors;

        // Disable interactions if empty
        graph.options.plugins.tooltip.enabled = !result.isEmpty;
        graph.options.hover.mode = result.isEmpty ? null : 'nearest';
        graph.options.hover.animationDuration = result.isEmpty ? 0 : 400;

        // Update title
        graph.options.plugins.title.text = result.isEmpty
            ? "No transactions this month"
            : type === "expenses"
                ? "Expenses distribution by category"
                : "Income distribution by category";

        graph.update();
    }

    function createGraph(canvas, titleText) {
        return new Chart(
            canvas,
            {
                type: 'doughnut',
                data: {
                    datasets: [{
                        labels: [],
                        data: [],
                        borderColor: "#ffffff00",
                        hoverOffset: 20,
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: titleText,
                        },
                        legend: {
                            position: "bottom",
                            align: "start",
                            onHover: (e, legendItem, legend) => {
                                const chart = legend.chart;
                                const index = legendItem.index;

                                chart.setActiveElements([
                                    { datasetIndex: 0, index: index }
                                ]);
                                chart.tooltip.setActiveElements([
                                    { datasetIndex: 0, index: index }
                                ]);
                                chart.update();
                            },
                            onLeave: (e, legendItem, legend) => {
                                const chart = legend.chart;

                                chart.setActiveElements([]);
                                chart.tooltip.setActiveElements([]);
                                chart.update();
                            }
                        },
                    },
                    maintainAspectRatio: false,
                    radius: "75%",
                    layout: {
                        padding: 0
                    }
                }
            });
    }

    const update = () => {
        ctx.render(transactionsTemplate({
            transactions: getDisplayedTransactions(),
            showPrevMonth,
            showNextMonth,
            filters,
            state
        }));

        renderExpensesGraph()
        renderIncomeGraph()
    }

    update();
}