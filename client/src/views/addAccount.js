import "../../styles/addAccount.css"

import { html } from "lit-html";

import { addAccount } from "../api/data.js";
import { currencies } from "../utils/currencies.js";
import { showToast } from "../utils/toast.js";

const addAccountTemplate = ({ onSubmit, selectCurrency, onNameInput, state }) => {
    const currencySign = currencies.find((c) => c.code === state.selectedCurrency)?.sign ?? "$";

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
                    <input class="add-account__currency--hidden" type="text" name="currency" .value=${state.selectedCurrency} readonly/>

                    <label class="add-account__label" for="name">Name</label>
                    <input class="add-account__name-input" type="text" name="name" placeholder="Account name" maxlength="30" autocomplete="off" @input=${onNameInput}/>

                    <div class="add-account__starting-balance">
                        <label for="startingBalance">Starting at</label>
                        <span class="add-account__currency-prefix">${currencySign}</span>
                        <input class="add-account__balance-input" type="number" name="startingBalance" autocomplete="off" placeholder="0" step="0.01"/>
                    </div>

                    <div class="add-account__currency-grid">
                        ${currencies.map((c) => html`
                        <button type="button" class="add-account__currency-btn ${state.selectedCurrency === c.code ? "selected" : ""}" @click=${() => selectCurrency(c.code)}>
                            <span class="add-account__code">${c.code}</span>
                            <span class="add-account__sign">${c.sign}</span>
                            <span class="add-account__country">${c.country}</span>
                        </button>
                    `)}
                    </div>
                </form>

                ${state.errMessage ? html`<p class="add-account__error">${state.errMessage}</p>` : null}

                <div class="add-account__actions">
                    <button class="add-account__btn" type="submit" form="add-account__form" ?disabled=${!state.nameValue.trim() || state.isSubmitting}>
                        Add Account (${state.selectedCurrency})
                    </button>
                </div>
            </div>
        </div>
`};

export const addAccountView = (ctx) => {
    const state = {
        selectedCurrency: "USD",
        nameValue: "",
        isSubmitting: false,
        errMessage: null
    }

    function selectCurrency(code) {
        if (state.selectedCurrency === code) {
            return
        }

        state.selectedCurrency = code;
        renderForm();
    }

    function onNameInput(event) {
        state.nameValue = event.target.value;
        renderForm();
    }

    async function onSubmit(event) {
        event.preventDefault();
        if (state.isSubmitting) return;

        const formData = new FormData(event.target);
        const name = formData.get("name").trim();
        const currency = state.selectedCurrency
        const startingBalance = Number(formData.get("startingBalance")) || 0;

        if (!name) {
            state.errMessage = "Account name is required.";
            return renderForm();
        }
        if (isNaN(startingBalance)) {
            state.errMessage = "Please enter a valid starting balance.";
            return renderForm();
        }
        if (startingBalance < -999999.99 || startingBalance > 999999.99) {
            state.errMessage = "Starting balance must be between -999,999.99 and 999,999.99.";
            return renderForm();
        }

        state.isSubmitting = true;
        state.errMessage = null;
        renderForm();

        try {
            await addAccount({ name, currency, startingBalance });
            showToast("Account successfully created!")
            ctx.page.redirect("/")
        } catch (err) {
            showToast("Failed to create account!", "error");
            state.isSubmitting = false;
            renderForm();
        }
    }

    function renderForm() {
        ctx.render(
            addAccountTemplate({ onSubmit, selectCurrency, onNameInput, state })
        );
    }

    renderForm();
};