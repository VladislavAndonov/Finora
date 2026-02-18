import { html } from "lit-html";
import page from "page";

import { transactionForm } from './common/transactionForm.js';
import { addTransaction } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';

const addTransactionTemplate = ({ onSubmit, onTypeChange, transaction, state }) =>
    html`<div class="add-transaction">
            <header class="add-transaction__header">
                <h1 class="add-transaction__title">Add Transaction</h1>
            </header>

            <div class="add-transaction__content">
                ${transactionForm({ onSubmit, onTypeChange, transaction, state })}
            </div>
        </div>`;

export const addTransactionView = (ctx) => {
    const defaultType = "expenses"

    let state = {
        errMessage: null,
        isSubmitting: false,
        currentDate: utcToLocal(new Date()),
        submitLabel: 'Add Transaction',
        selectedType: defaultType
    }

    function renderForm() {
        ctx.render(addTransactionTemplate({
            onSubmit,
            onTypeChange,
            transaction: { date: state.currentDate, type: state.selectedType },
            state
        }));
    }

    renderForm()

    function onTypeChange(event) {
        state.selectedType = event.target.value;
        renderForm();
    };

    async function onSubmit(event) {
        event.preventDefault();

        if (state.isSubmitting) return;

        const formData = new FormData(event.target);
        const createdTransaction = {
            title: formData.get("title").trim(),
            type: formData.get("type"),
            amount: Number(formData.get("amount")),
            date: formData.get("date"),
            category: formData.get("category").trim().toLowerCase() ?? undefined
        }

        if (!createdTransaction.title ||
            !createdTransaction.type ||
            !createdTransaction.amount ||
            !createdTransaction.date ||
            !createdTransaction.category) {

            state.errMessage = "Please fill the required fields."
            return renderForm()
        }

        if (createdTransaction.title.length < 3) {
            state.errMessage = "Title must be at least 3 characters."
            return renderForm();
        }
        if (createdTransaction.title.length > 20) {
            state.errMessage = "Title must be 20 characters or fewer."
            return renderForm();
        }
        if (createdTransaction.amount < 0.01) {
            state.errMessage = "Amount must be at least 0.01."
            return renderForm();
        }
        if (createdTransaction.amount > 999999.99) {
            state.errMessage = "Amount must be a maximum of 999,999.99."
            return renderForm();
        }
        if (!Number.isInteger(createdTransaction.amount * 100)) {
            state.errMessage = "Amount can have at most two decimals places."
            return renderForm();
        }

        state.isSubmitting = true;
        state.errMessage = null;
        state.submitLabel = "Adding transaction..."
        renderForm();

        try {
            await addTransaction(createdTransaction);
            ctx.page.redirect("/");
        } catch (err) {
            state.errMessage = err.message;
            state.isSubmitting = false;
            renderForm()
        }
    }
}