import "../../styles/addAccount.css"

import { html } from "lit-html";

import { addAccount } from "../api/data.js";
import { currencies } from "../utils/currencies.js";

const addAccountTemplate = ({ onSubmit, selectCurrency, selectedCurrency, nameValue, onNameInput }) => {
    const currencySign = currencies.find((c) => c.code === selectedCurrency)?.sign ?? "$";

    return html`
        <div class="add-account">
            <header class="add-account__header">
                <button class="add-account__back" @click=${() => history.back()} type="button">
                <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h1 class="add-account__title">Add Account</h1>
            </header>

            <div class="add-account__content">
                <form @submit=${onSubmit} id="add-account-form">
                    <input class="account-form__currency-hidden" type="text" name="currency" .value=${selectedCurrency} readonly/>

                    <label class="account-form__label" for="name">Name</label>
                    <input class="account-form__name-input" type="text" name="name" placeholder="Account name" autocomplete="off" @input=${onNameInput}/>

                    <div class="starting-balance-row"> <label for="startingBalance">Starting at</label>
                        <input class="account-form__balance-input" type="number" name="startingBalance" placeholder="${currencySign}0" step="0.1"/>
                    </div>

                    <div class="currency-grid">
                        ${currencies.map(
        (c) => html`
                        <button type="button" class="currency-btn ${selectedCurrency === c.code ? "selected" : ""}" @click=${() => selectCurrency(c.code)}>
                            <span class="currency-btn__code">${c.code}</span>
                            <span class="currency-btn__sign">${c.sign}</span>
                            <span class="currency-btn__country">${c.country}</span>
                        </button>
                    `)}
                    </div>
                </form>
            </div>

            <div class="account-form__actions">
                <button class="account-form__btn" type="submit" form="add-account-form" ?disabled=${!nameValue.trim()}>
                    Add Account (${selectedCurrency})
                </button>
            </div>
        </div>
`};

export const addAccountView = (ctx) => {
    const DEFAULT_CURRENCY = "USD";
    let selectedCurrency = DEFAULT_CURRENCY;
    let nameValue = "";

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
        const createdAccount = {
            name: formData.get("name").trim(),
            currency: selectedCurrency,
            startingBalance: Number(formData.get("startingBalance")) || 0,
        };

        try {
            await addAccount(createdAccount);
            ctx.page.redirect("/");
        } catch (error) {
            console.error(error);
            renderForm();
        }
    }

    function renderForm() {
        ctx.render(
            addAccountTemplate({ onSubmit, selectCurrency, selectedCurrency, nameValue, onNameInput })
        );
    }

    renderForm();
};