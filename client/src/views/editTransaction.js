import { html } from "lit-html";

import { transactionForm } from './common/transactionForm.js';
import { deleteTransaction, editTransaction, getTransactionById } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';

const editTransactionTemplate = ({ onSubmit, onDelete, onTypeChange, transaction, state }) =>
    html`<div class="edit-transaction">
            <header class="edit-transaction__header">
                <h1 class="edit-transaction__title">Edit Transaction</h1>
            </header>
            
            <div class="edit-transaction__content">
                ${transactionForm({ onSubmit, onDelete, onTypeChange, transaction, state })}
            </div>
        </div>`

export const editTransactionView = async (ctx) => {
    const tId = ctx.params.id
    let transaction = null;

    try {
        //TODO: Finish try catch block
        const result = await getTransactionById(tId)
        transaction = { ...result, date: utcToLocal(result.date) }
    } catch (err) {
        console.log(err.message);
    }

    let state = {
        errMessage: null,
        isSubmitting: false,
        submitLabel: 'Edit Transaction',
        deleteLabel: "Delete",
        selectedType: transaction.type
    }


    const renderForm = () => {
        ctx.render(editTransactionTemplate({
            onSubmit,
            onDelete,
            onTypeChange,
            transaction,
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
        const updatedTransaction = {
            title: formData.get("title").trim(),
            type: formData.get("type"),
            amount: Number(formData.get("amount")),
            date: formData.get("date"),
            category: formData.get("category").trim().toLowerCase() ?? undefined
        }

        if (!updatedTransaction.title ||
            !updatedTransaction.type ||
            !updatedTransaction.amount ||
            !updatedTransaction.date) {

            state.errMessage = "Please fill the required fields."
            return renderForm()
        }

        if (updatedTransaction.title.length < 3) {
            state.errMessage = "Title must be at least 3 characters."
            return renderForm();
        }
        if (updatedTransaction.title.length > 20) {
            state.errMessage = "Title must be 20 characters or fewer."
            return renderForm();
        }
        if (updatedTransaction.amount < 0.01) {
            state.errMessage = "Amount must be at least 0.01."
            return renderForm();
        }
        if (updatedTransaction.amount > 999999.99) {
            state.errMessage = "Amount must be a maximum of 999,999.99."
            return renderForm();
        }
        if (!Number.isInteger(updatedTransaction.amount * 100)) {
            state.errMessage = "Amount can have at most two decimals places."
            return renderForm();
        }

        state.isSubmitting = true;
        state.errMessage = null;
        state.submitLabel = "Submitting changes..."
        renderForm();

        try {
            await editTransaction(tId, updatedTransaction);
            ctx.page.redirect("/");
        } catch (err) {
            state.errMessage = err.message;
            state.isSubmitting = false;
            renderForm()
        }
    }

    async function onDelete() {
        state.isSubmitting = true;
        state.errMessage = null;
        state.deleteLabel = "Deleting..."
        renderForm();

        try {
            await deleteTransaction(tId);
            ctx.page.redirect("/");
        } catch (err) {
            state.errMessage = err.message;
            state.isSubmitting = false;
            renderForm()
        }
    }
}

