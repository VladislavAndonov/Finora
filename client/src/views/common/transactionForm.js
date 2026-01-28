import { html } from 'https://esm.run/lit-html@1';
import page from "//unpkg.com/page/page.mjs";

export const transactionForm = ({ onSubmit, onDelete, errMessage, transaction, submitLabel }) =>
    html`<div class="transaction-layout" style="color: #fff">
            <form class="transaction-form" @submit=${onSubmit}>
                <fieldset>
                    <label for="title">Title</label>
                    <input type="text" name="title" id="title" required value=${transaction?.title ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="type">Type</label>
                    <input type="radio" name="type" .checked=${transaction?.type === "expenses"} id="expenses" value="expenses">
                    <label for="expenses">Expenses</label>
                    <input type="radio" name="type" .checked=${transaction?.type === "income"} id="income" value="income">
                    <label for="income">Income</label>
                </fieldset>

                <fieldset>
                    <label for="amount">Amount</label>
                    <input type="number" name="amount" id="amount" required value=${transaction?.amount ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="date">Date</label>
                    <input type="datetime-local" name="date" id="date" value=${transaction?.date ?? ""}>
                </fieldset>

                <fieldset>
                    <label for="category">Category</label>
                    <input type="category" name="category" id="category" value=${transaction?.category ?? ""}>
                </fieldset>

                <div class="err-message">
                    <p>${errMessage}</p>
                </div>

                <div class="buttons">
                    <button class="transaction-form-submit-btn">${submitLabel}</button>
                
                    <button type="button" @click=${() => page.redirect("/")} class="transaction-form-cancel-btn">Cancel</button>

                    ${onDelete ? html`<button class="transaction-form-delete-btn" type="button" @click=${onDelete}>Delete Transaction</button>` : ""}
                </div>
            </form>
        </div>`
