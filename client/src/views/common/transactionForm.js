import "../../../styles/transactionForm.css"
import { html } from "lit-html";


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

export const transactionForm = ({ onSubmit, onDelete, onTypeChange, transaction, state }) =>
    html`
        <form class="transaction-form" @submit=${onSubmit}>

            <!-- Title -->
            <fieldset class="transaction-form__fieldset">
                <label class="transaction-form__label" for="title">Title</label>
                <input class="transaction-form__input" type="text" name="title" id="title" value=${transaction?.title ?? ""}>
            </fieldset>

            <!-- Type -->
            <fieldset class="transaction-form__fieldset">
                <legend class="transaction-form__label">Type</legend>
                <div class="transaction-form__radio-group">
                    <div class="transaction-form__radio-option">
                        <input class="transaction-form__radio" type="radio" name="type" .checked=${state.selectedType === "expenses"} id="expenses" value="expenses" @change=${onTypeChange}>
                        <label class="transaction-form__label" for="expenses">Expenses</label>
                    </div>
                    <div class="transaction-form__radio-option">
                        <input class="transaction-form__radio" type="radio" name="type" .checked=${state.selectedType === "income"} id="income" value="income" @change=${onTypeChange}>
                        <label class="transaction-form__label" for="income">Income</label>
                    </div>
                </div>
            </fieldset>

            <!-- Amount -->
            <fieldset class="transaction-form__fieldset">
                <label class="transaction-form__label" for="amount">Amount</label>
                <input class="transaction-form__input--number" type="number" name="amount" id="amount" step="0.01" value=${transaction?.amount ?? ""}>
            </fieldset>

            <!-- Date -->
            <fieldset class="transaction-form__fieldset">
                <label class="transaction-form__label" for="date">Date</label>
                <input class="transaction-form__input--datetime" type="datetime-local" name="date" id="date" value=${transaction?.date ?? ""}>
            </fieldset>

            <!-- Category -->
            <fieldset class="transaction-form__fieldset">
                <label class="transaction-form__label" for="category">Category</label>
                <select class="transaction-form__select" name="category" id="category" value=${transaction?.category ?? ""}>
                    <option value="">Select a category</option>
                    ${state.selectedType === "expenses"
            ? expenseCategories.map((cat) => html`
                            <option ?selected=${transaction?.category === cat} value=${cat}>
                                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        `)
            : state.selectedType === "income"
                ? incomeCategories.map((cat) => html`
                            <option ?selected=${transaction?.category === cat} value=${cat}>
                                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        `)
                : null}
                </select>
            </fieldset>

            ${state.errMessage ? html`<p class="transaction-form__error">${state.errMessage}</p>` : null}

            <div class="transaction-form__actions">
                <button type="submit" class="transaction-form__btn transaction-form__btn--primary" ?disabled=${state.isSubmitting}>${state.submitLabel}</button>
            
                <button type="button" class="transaction-form__btn transaction-form__btn--secondary" @click=${() => history.back()}>Cancel</button>

                ${onDelete ? html`<button type="button" class="transaction-form__btn transaction-form__btn--danger" @click=${onDelete} ?disabled=${state.isSubmitting}>${state.deleteLabel}</button>` : null}
            </div>
        </form>
    `;