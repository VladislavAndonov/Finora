import { html } from 'https://esm.run/lit-html@1';
import { transactionForm } from './common/transactionForm.js';
import { addTransaction } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';

const addTransactionTemplate = ({ onSubmit, submitLabel, transaction }) =>
    html`<div>
            <header>
                <h3 style="color: #fff">Add Transaction</h3>
            </header>
            ${transactionForm({ onSubmit, submitLabel, transaction })}
        </div>`;

export const addTransactionView = (ctx) => {

    const now = utcToLocal(new Date());
    const defaultType = "expenses";

    ctx.render(addTransactionTemplate({ onSubmit, transaction: { date: now, type: defaultType }, submitLabel: 'Add Transaction' }));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const createdTransaction = {
            title: formData.get("title").trim(),
            type: formData.get("type"),
            amount: Number(formData.get("amount")),
            date: formData.get("date"),
            category: formData.get("category") ?? undefined
        }

        await addTransaction(createdTransaction);
        ctx.page.redirect("/");
    }
}