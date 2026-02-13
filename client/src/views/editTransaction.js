import { html } from "lit-html";

import { transactionForm } from './common/transactionForm.js';
import { deleteTransaction, editTransaction, getTransactionById } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';

const editTransactionTemplate = ({ onSubmit, onDelete, transaction, submitLabel, onTypeChange, selectedType, errMessage }) =>
    html`<div class="edit-transaction">
            <div class="add-transaction-layout">
                <header class="edit-transaction-header">
                    <h2 class="edit-transaction-title">Edit Transaction</h2>
                </header>
                
                ${transactionForm({ onSubmit, onDelete, transaction, submitLabel, onTypeChange, selectedType, errMessage })}
            </div>
        </div>`


export const editTransactionView = async (ctx) => {
    const tId = ctx.params.id
    const result = await getTransactionById(tId)

    const transaction = { ...result, date: utcToLocal(result.date) }

    const renderForm = ({ selectedType = transaction.type, errMessage } = {}) => {
        ctx.render(editTransactionTemplate({
            onSubmit,
            transaction,
            submitLabel: 'Edit Transaction',
            onTypeChange,
            selectedType,
            errMessage
        }));
    }

    const onTypeChange = (event) => {
        const selectedType = event.target.value;
        renderForm({ selectedType });
    };

    renderForm()

    async function onSubmit(event) {
        event.preventDefault();
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
            return renderForm({ errMessage: "Please fill the required fields." })
        }

        if (updatedTransaction.title.length < 3) {
            return renderForm({ errMessage: "Title must be at least 3 characters." })
        }
        if (updatedTransaction.title.length > 20) {
            return renderForm({ errMessage: "Title must be 20 characters or fewer." })
        }
        if (updatedTransaction.amount < 0.01) {
            return renderForm({ errMessage: "Amount must be at least 0.01." })
        }
        if (updatedTransaction.amount > 999999.99) {
            return renderForm({ errMessage: "Amount must be a maximum of 999,999.99." })
        }
        if (!Number.isInteger(updatedTransaction.amount * 100)) {
            return renderForm({ errMessage: "Amount can have at most two decimals places." })
        }

        await editTransaction(tId, updatedTransaction);
        ctx.page.redirect("/");
    }

    async function onDelete() {
        await deleteTransaction(tId);
        ctx.page.redirect("/");
    }
}

