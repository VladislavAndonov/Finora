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

    const renderForm = (ctx, errMessage = {}) => {
        ctx.render(editTransactionTemplate({
            onSubmit,
            transaction,
            submitLabel: 'Edit Transaction',
            errMessage
        }));
    }

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

        await editTransaction(tId, updatedTransaction);

        ctx.page.redirect("/");

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
        if (updatedTransaction.category.length < 3) {
            return renderForm({ errMessage: "Category must be at least 3 characters." })
        }
        if (updatedTransaction.category.length > 14) {
            return renderForm({ errMessage: "Category must be 14 characters or fewer." })
        }
    }

    async function onDelete() {
        await deleteTransaction(tId);
        ctx.page.redirect("/");
    }
}

