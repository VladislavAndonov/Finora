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
                <form @submit=${onSubmit} id="add-account__form">
                    <input class="add-account__currency--hidden" type="text" name="currency" .value=${selectedCurrency} readonly/>

                    <label class="add-account__label" for="name">Name</label>
                    <input class="add-account__name-input" type="text" name="name" placeholder="Account name" maxlength="30" autocomplete="off" @input=${onNameInput}/>

                    <div class="add-account__starting-balance">
                        <label for="startingBalance">Starting at</label>
                        <span class="add-account__currency-prefix">${currencySign}</span>
                        <input class="add-account__balance-input" type="number" name="startingBalance" autocomplete="off" placeholder="0" step="0.1"/>
                    </div>

                    <div class="add-account__currency-grid">
                        ${currencies.map((c) => html`
                        <button type="button" class="add-account__currency-btn ${selectedCurrency === c.code ? "selected" : ""}" @click=${() => selectCurrency(c.code)}>
                            <span class="add-account__code">${c.code}</span>
                            <span class="add-account__sign">${c.sign}</span>
                            <span class="add-account__country">${c.country}</span>
                        </button>
                    `)}
                    </div>
                </form>

                <div class="add-account__actions">
                    <button class="add-account__btn" type="submit" form="add-account__form" ?disabled=${!nameValue.trim()}>
                        Add Account (${selectedCurrency})
                    </button>
                </div>
            </div>
        </div>
`};

export const addAccountView = (ctx) => {
    const DEFAULT_CURRENCY = "USD";
    let selectedCurrency = DEFAULT_CURRENCY;
    let nameValue = "";

    function selectCurrency(code) {
        if (selectedCurrency === code) {
            return
        }

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

            ctx.page.redirect("/")
        } catch (error) {
            console.error(error)
            renderForm()
        }
    }

    function renderForm() {
        ctx.render(
            addAccountTemplate({ onSubmit, selectCurrency, selectedCurrency, nameValue, onNameInput })
        );
    }

    renderForm();
};