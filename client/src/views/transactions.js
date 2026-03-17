import "../../styles/transactions.css"

import { html } from "lit-html";
import { Chart } from "chart.js";

import { getTransactions } from '../api/data.js';
import { transactionList } from './common/transactionList.js';
import { formatDate } from '../utils/dateUtils.js';
import { categoriesMasterList } from "../utils/categoryList.js";
import { getActiveAccountId } from "../state/sessionState.js";

const transactionsTemplate = ({ transactionsByDate, monthList, filters, state, noTransactionsMessage, selectMonth, handleWheel }) =>
    html`
    <div class="transactions">
        <header class="transactions__header">
            <h1 class="transactions__title">Transactions</h1>
        </header>

        <div class="transactions__content">

            <section class="transactions__section transactions__body">
                <div class="transactions__month-scroll" id="month-scroll" @wheel=${handleWheel}>
                    ${monthList.map((m) => html`
                        <button 
                            class="transactions__month-item ${state.currentDate.getFullYear() === m.year && state.currentDate.getMonth() === m.month ? "transactions__month-item--active" : ""}"
                            @click=${() => selectMonth(m.year, m.month)}>${m.label}
                            ${state.today.getFullYear() !== m.year ? html`<span class="transactions__year-label">${m.year}</span>` : ""}
                        </button>`)}
                </div>

                ${transactionList(filters, transactionsByDate, noTransactionsMessage)}
            </section>

            <section class="transactions__section transactions__charts">
                
                <div class="transactions__chart ${state.ui.activeTab === "expenses" || state.ui.activeTab === "all" ? "transactions__chart--active" : "transactions__chart--inactive"}">
                    <canvas id="expenses-chart" class="transactions__canvas" aria-label="Expenses chart"></canvas>
                </div>

                <div class="transactions__chart ${state.ui.activeTab === "income" || state.ui.activeTab === "all" ? "transactions__chart--active" : "transactions__chart--inactive"}">
                    <canvas id="income-chart" class="transactions__canvas" aria-label="Income chart"></canvas>
                </div>
            </section>

        </div>
        
    </div>`;

export const transactionsView = async (ctx) => {
    const state = {
        today: new Date(),
        currentDate: new Date(),
        minDate: new Date(),
        maxDate: new Date(),
        activeAccountId: getActiveAccountId() || null,
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

    state.maxDate.setMonth(state.today.getMonth() + 7);
    state.minDate.setMonth(state.today.getMonth() - 13)

    async function loadMonthTransactions() {
        if (!state.activeAccountId) return;

        const transactions = await getTransactions({
            acccountId: state.activeAccountId,
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

    function buildMonthList() {
        const months = [];
        let current = new Date(state.minDate.getFullYear(), state.minDate.getMonth(), 1);
        const end = new Date(state.maxDate.getFullYear(), state.maxDate.getMonth(), 1);

        while (current <= end) {
            months.push({
                year: current.getFullYear(),
                month: current.getMonth(),
                label: current.toLocaleDateString("en-GB", {
                    month: "long",
                }),
            });

            current.setMonth(current.getMonth() + 1);
        }
        return months
    }

    async function selectMonth(year, month) {
        state.currentDate = new Date(year, month, 1);

        await loadMonthTransactions();
        state.ui.activeTab = "all";
        setActive("All");
        update();
    }

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
                colors: ["rgb(18, 18, 18)"]
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
        const canvas = document.getElementById("expenses-chart");

        if (!state.expensesGraphInstance) {
            state.expensesGraphInstance = createGraph(canvas, "Expenses distribution");
        }

        updateGraph(state.expensesGraphInstance, "expenses");
        state.expensesGraphInstance.resize();
    }

    function renderIncomeGraph() {
        const canvas = document.getElementById("income-chart");

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

        graph.options.plugins.tooltip.enabled = !result.isEmpty;
        graph.options.hover.mode = result.isEmpty ? null : 'nearest';
        graph.options.hover.animationDuration = result.isEmpty ? 0 : 400;

        graph.config._config.customData = result;
        graph.update();
    }

    const centerTextPlugin = {
        id: 'centerText',
        afterDraw(chart) {
            const { ctx, chartArea: { left, top, width, height } } = chart;
            const result = chart.config._config.customData;

            if (!result || result.isEmpty) return;

            ctx.save();
            const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const centerX = left + width / 2;
            const centerY = top + height / 2.1;

            // Total Label
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgb(163, 163, 163)';
            ctx.fillText('TOTAL', centerX, centerY - 10);

            // Amount
            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = 'rgb(250, 250, 250)';
            ctx.fillText(`$${total.toLocaleString()}`, centerX, centerY + 15);
            ctx.restore();
        }
    };

    function createGraph(canvas, titleText) {
        return new Chart(
            canvas,
            {
                type: 'doughnut',
                plugins: [centerTextPlugin],
                data: {
                    datasets: [{
                        labels: [],
                        data: [],
                        backgroundColor: [],
                        borderRadius: 4,
                        borderColor: "rgba(0, 0, 0, 0.5)",
                        hoverOffset: 20,
                        hoverBorderColor: 'transparent',
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    cutout: '70%',
                    radius: "75%",
                    plugins: {
                        tooltip: {
                            backgroundColor: 'rgb(18, 18, 18)',
                            padding: 12,
                            borderColor: 'rgba(255,255,255,0.15)',
                            borderWidth: 1,
                            boxHeight: 12,
                            boxWidth: 12,
                            boxPadding: 4,
                            usePointStyle: true,
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
                            callbacks: {
                                title: (items) => items[0].label,
                                label: (item) => {
                                    const dataset = item.dataset;
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    const percent = ((item.parsed / total) * 100).toFixed(1);
                                    const value = item.parsed.toLocaleString();
                                    return `$${value} (${percent}%)`;
                                },
                                labelTextColor: () => 'rgb(250, 250, 250)',
                            }
                        },
                        title: {
                            display: true,
                            text: titleText,
                            font: {
                                size: 16
                            },
                            color: "rgb(213, 213, 213)"
                        },
                        legend: {
                            position: "bottom",
                            align: "start",
                            labels: {
                                color: 'rgb(163, 163, 163)',
                                boxWidth: 12,
                                boxHeight: 12,
                                borderRadius: 7,
                                useBorderRadius: true,
                                font: {
                                    size: 12,
                                    weight: "bold"
                                },
                                padding: 12,
                            },
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
        ctx.render(transactionsTemplate({
            transactionsByDate: getDisplayedTransactions(),
            monthList: buildMonthList(),
            filters,
            state,
            noTransactionsMessage: "No transactions this month.",
            selectMonth,
            handleWheel
        }));

        renderExpensesGraph()
        renderIncomeGraph()

        const monthScroll = document.getElementById('month-scroll');

        // Auto-scroll on every render
        setTimeout(() => {
            const active = monthScroll?.querySelector('.transactions__month-item--active');
            active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 0);
    }

    update();
}