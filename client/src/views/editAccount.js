import "../../styles/editAccount.css"

import { html } from "lit-html";

import { getAccountById, editAccount } from "../api/data.js";
import { currencies } from "../utils/currencies.js";

const editAccountTemplate = ({ onSubmit, selectCurrency, selectedCurrency, nameValue, onNameInput }) =>
    html`
        <div class="edit-account">
            <header class="edit-account__header">
                <button class="edit-account__back" @click=${() => history.back()} type="button">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h1 class="edit-account__title">Edit Account</h1>
            </header>

            <div class="edit-account__content">
                <form @submit=${onSubmit} id="edit-account__form">
                    <input class="edit-account__currency--hidden" type="text" name="currency" .value=${selectedCurrency} readonly/>

                    <label class="edit-account__label" for="name">Name</label>
                    <input class="edit-account__name-input" type="text" name="name" placeholder="Account name" maxlength="30" autocomplete="off" .value=${nameValue} @input=${onNameInput}/>

                    <div class="edit-account__currency-grid">
                        ${currencies.map((c) => html`
                            <button type="button" class="edit-account__currency-btn ${selectedCurrency === c.code ? "selected" : ""}" @click=${() => selectCurrency(c.code)}>
                                <span class="edit-account__code">${c.code}</span>
                                <span class="edit-account__sign">${c.sign}</span>
                                <span class="edit-account__country">${c.country}</span>
                            </button>
                        `)}
                    </div>
                </form>
                
                <div class="edit-account__actions">
                    <button class="edit-account__btn" type="submit" form="edit-account__form" ?disabled=${!nameValue.trim()}>
                        Save Account (${selectedCurrency})
                    </button>
                </div>

            </div>
        </div>
    `;

export const editAccountView = async (ctx) => {
    const accId = ctx.params.id;
    let selectedCurrency = "USD";
    let nameValue = "";

    try {
        const account = await getAccountById(accId);
        selectedCurrency = account.currency ?? "USD";
        nameValue = account.name ?? "";
    } catch (err) {
        console.error(err.message);
    }

    function selectCurrency(code) {
        if (selectedCurrency === code) return;
        selectedCurrency = code;
        renderForm();
    }

    function onNameInput(event) {
        nameValue = event.target.value;
        renderForm();
    }

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const updatedAccount = {
            name: formData.get("name").trim(),
            currency: selectedCurrency,
        };

        try {
            await editAccount(accId, updatedAccount);
            ctx.page.redirect("/");
        } catch (error) {
            console.error(error);
            renderForm();
        }
    }

    function renderForm() {
        ctx.render(
            editAccountTemplate({ onSubmit, selectCurrency, selectedCurrency, nameValue, onNameInput })
        );
    }

    renderForm();
};