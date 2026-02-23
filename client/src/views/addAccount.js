import { html } from "lit-html";

import { accountForm } from "./common/accountForm.js";
import { addAccount, addTransaction } from "../api/data.js";

const addAccountTemplate = (onSubmit) =>
    html`<div class="add-account">
            <header class="add-account__header">
                <h1 class="add-account__title">Add Account</h1>
            </header>

            <div class="add-account__content">
                ${accountForm(onSubmit)}
            </div>
        </div>`;


export const addAccountView = (ctx) => {
    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target)
        const createdAccount = {
            name: formData.get("name").trim(),
            currency: formData.get("currency").trim(),
            startingBalance: Number(formData.get("startingBalance"))
        }

        try {
            await addAccount(createdAccount)
            ctx.page.redirect("/");
        } catch (error) {
            console.log(error)
            renderForm()
        }
    }

    function renderForm() {
        ctx.render(addAccountTemplate(onSubmit));
    }

    renderForm()
}