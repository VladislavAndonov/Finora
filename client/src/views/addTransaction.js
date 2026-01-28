import { html } from 'https://esm.run/lit-html@1';
import { transactionForm } from './common/transactionForm.js';
import { addTransaction } from '../api/data.js';

const addTransactionTemplate = (onSubmit) =>
    html`<div>
            <header>
                <h3 style="color: #fff">Add Transaction</h3>
            </header>
            ${transactionForm(onSubmit)}
        </div>`;

export const addTransactionView = (ctx) => {

    const now = utcToLocal(new Date());
    const defaultType = "expenses";

    ctx.render(addTransactionTemplate({ onSubmit, transaction: { date: now, type: defaultType }, submitLabel: 'Add Transaction' }));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get("title").trim();
        // TODO: make a default option for type
        const type = formData.get("type");
        const amount = formData.get("amount").trim();
        const date = formData.get("date") || undefined;
        const category = formData.get("category").trim() || undefined;

        await addTransaction({ title, type, amount, date, category });

        ctx.page.redirect("/");
    }


    ctx.render(addTransactionTemplate(onSubmit));
}