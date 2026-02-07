import { html } from "lit-html";

import { transactionForm } from './common/transactionForm.js';
import { addTransaction } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';

const addTransactionTemplate = ({ onSubmit, transaction, submitLabel, errMessage }) =>
    html`<div>
            <header>
                <h3 style="color: #fff">Add Transaction</h3>
            </header>
            ${transactionForm({ onSubmit, transaction, submitLabel, errMessage })}
        </div>`;

export const addTransactionView = (ctx) => {

    const now = utcToLocal(new Date());
    const defaultType = "expenses";

    const renderForm = (ctx, errMessage = {}) => {
        ctx.render(addTransactionTemplate({
            onSubmit,
            transaction: { date: now, type: defaultType },
            submitLabel: 'Add Transaction',
            errMessage
        }));
    }

    renderForm(ctx)

    async function onSubmit(event) {
        event.preventDefault();
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
            !createdTransaction.date) {
            return renderForm({ errMessage: "Please fill the required fields." })
        }

        if (createdTransaction.title.length < 3) {
            return renderForm({ errMessage: "Title must be at least 3 characters." })
        }
        if (createdTransaction.title.length > 20) {
            return renderForm({ errMessage: "Title must be 20 characters or fewer." })
        }
        if (createdTransaction.amount < 0.01) {
            return renderForm({ errMessage: "Amount must be at least 0.01." })
        }
        if (createdTransaction.amount > 999999.99) {
            return renderForm({ errMessage: "Amount must be a maximum of 999,999.99." })
        }
        if (!Number.isInteger(createdTransaction.amount * 100)) {
            return renderForm({ errMessage: "Amount can have at most two decimals places." })
        }
        if (createdTransaction.category.length < 3) {
            return renderForm({ errMessage: "Category must be at least 3 characters." })
        }
        if (createdTransaction.category.length > 14) {
            return renderForm({ errMessage: "Category must be 14 characters or fewer." })
        }

        await addTransaction(createdTransaction);
        ctx.page.redirect("/");
    }
}