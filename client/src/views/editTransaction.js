import { html } from 'https://esm.run/lit-html@1';
import { transactionForm } from './common/transactionForm.js';
import { deleteTransaction, editTransaction, getTransactionById } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';

const editTransactionTemplate = ({ onSubmit, onDelete, transaction, submitLabel }) =>
    html`<div>
            <header>
                <h3 style="color: #fff">Edit Transaction</h3>
            </header>
            ${transactionForm({ onSubmit, onDelete, transaction, submitLabel })}
        </div>`


export const editTransactionView = async (ctx) => {
    const tId = ctx.params.id
    const result = await getTransactionById(tId)

    const transaction = { ...result, date: utcToLocal(result.date) }

    ctx.render(editTransactionTemplate({ onSubmit, onDelete, transaction, submitLabel: 'Edit Transaction' }));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const updatedTransaction = {
            title: formData.get("title").trim(),
            type: formData.get("type"),
            amount: Number(formData.get("amount")),
            date: formData.get("date"),
            category: formData.get("category") ?? undefined
        }

        await editTransaction(tId, updatedTransaction);

        ctx.page.redirect("/");
    }

    async function onDelete() {
        await deleteTransaction(tId);
        ctx.page.redirect("/");
    }
}

