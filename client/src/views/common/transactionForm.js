import page from "page";
import { html } from "lit-html";

export const transactionForm = ({ onSubmit, onDelete, transaction, submitLabel, errMessage }) =>
    html`
        <div class="transaction-form-container">
            <form class="transaction-form" @submit=${onSubmit}>
                <fieldset>
                    <label for="title">Title</label>
                    <input type="text" name="title" id="title" .value=${transaction?.title ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="type">Type</label>
                    <input type="radio" name="type" .checked=${transaction?.type === "expenses"} id="expenses" .value="expenses">
                    <label for="expenses">Expenses</label>
                    <input type="radio" name="type" .checked=${transaction?.type === "income"} id="income" .value="income">
                    <label for="income">Income</label>
                </fieldset>

                <fieldset>
                    <label for="amount">Amount</label>
                    <input type="number" name="amount" id="amount" .value=${transaction?.amount ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="date">Date</label>
                    <input type="datetime-local" name="date" id="date" .value=${transaction?.date ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="category">Category</label>
                    <input type="text" name="category" id="category" .value=${transaction?.category ?? ""}>
                </fieldset>

                <div class="transaction-form-error">
                    ${errMessage}
                </div>

                <div class="transaction-form-buttons">
                    <button type="submit" class="transaction-form-submit">${submitLabel}</button>
                
                    <button type="button" class="transaction-form-cancel" @click=${() => page.redirect("/")}>Cancel</button>

                    ${onDelete ? html`<button type="button" class="transaction-form-delete" @click=${onDelete}>Delete Transaction</button>` : ""}
                </div>
            </form>
        </div>`
