import { html } from 'https://esm.run/lit-html@1';
import { transactionForm } from './common/transactionForm.js';
import { editTransaction, getTransactionById } from '../api/data.js';

const editTransactionTemplate = ({ onSubmit, errMessage, transaction }) =>
    html`<div>
            <header>
                <h3 style="color: #fff">Edit Transaction</h3>
            </header>
            ${transactionForm(onSubmit, errMessage, transaction)}
        </div>`


export const editTransactionView = async (ctx) => {
    const tId = ctx.params.id
    const transaction = await getTransactionById(tId)

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get("title").trim();
        const type = formData.get("type").trim();
        const amount = formData.get("amount").trim();
        const date = formData.get("date") || undefined;
        const category = formData.get("category").trim() || undefined;

        await editTransaction(tId, { title, type, amount, date, category });

        ctx.page.redirect("/");
    }

    const errMessage = ""

    ctx.render(editTransactionTemplate({ onSubmit, errMessage, transaction }));
}

