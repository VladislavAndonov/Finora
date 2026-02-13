import { html } from "lit-html";

import { navigate } from "../../utils/navigation";

const expenseCategories = [
    "housing",
    "utilities",
    "groceries",
    "dining",
    "transport",
    "health",
    "shopping",
    "entertainment",
    "education",
    "debt",
    "travel",
    "insurance",
    "kids",
    "pets",
    "gifts",
    "subscriptions",
    "other"
]

const incomeCategories = [
    "salary",
    "freelance",
    "business",
    "bonus",
    "investment",
    "rental",
    "refund",
    "gift",
    "other"
]

export const transactionForm = ({ onSubmit, onDelete, transaction, submitLabel, errMessage, onTypeChange, selectedType }) =>
    html`
        <div class="transaction-form-container">
            <form class="transaction-form" @submit=${onSubmit}>
                <fieldset>
                    <label for="title">Title</label>
                    <input type="text" name="title" id="title" value=${transaction?.title ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="type">Type</label>
                    <input type="radio" name="type" .checked=${selectedType === "expenses"} id="expenses" value="expenses" @change=${onTypeChange}>
                    <label for="expenses">Expenses</label>
                    <input type="radio" name="type" .checked=${selectedType === "income"} id="income" value="income" @change=${onTypeChange}>
                    <label for="income">Income</label>
                </fieldset>

                <fieldset>
                    <label for="amount">Amount</label>
                    <input type="number" name="amount" id="amount" value=${transaction?.amount ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="date">Date</label>
                    <input type="datetime-local" name="date" id="date" value=${transaction?.date ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="category">Category</label>
                    <select name="category" id="category" .value=${transaction?.category ?? ""}>
                        <option value="">Select a category</option>
                        ${selectedType === "expenses"
            ? expenseCategories.map((cat) => html`<option ?selected=${transaction?.category === cat} value=${cat}>${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`)
            : selectedType === "income"
                ? incomeCategories.map((cat) => html`<option ?selected=${transaction?.category === cat} value=${cat}>${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`)
                : ""}
                    </select>
                </fieldset>

                <div class="transaction-form-error">
                    ${errMessage}
                </div>

                <div class="transaction-form-buttons">
                    <button type="submit" class="transaction-form-submit">${submitLabel}</button>
                
                    <button type="button" class="transaction-form-cancel" @click=${() => history.length > 1 ? history.back() : navigate("/")}>Cancel</button>

                    ${onDelete ? html`<button type="button" class="transaction-form-delete" @click=${onDelete}>Delete Transaction</button>` : ""}
                </div>
            </form>
        </div>`