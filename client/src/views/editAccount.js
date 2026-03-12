import "../../styles/editAccount.css"

import { html } from "lit-html";

import { getAccountById, editAccount } from "../api/data.js";
import { currencies } from "../utils/currencies.js";

const editAccountTemplate = ({ onSubmit, selectCurrency, onNameInput, onToggleArchive, state }) =>
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
                    <input class="edit-account__currency--hidden" type="text" name="currency" .value=${state.selectedCurrency} readonly/>

                    <label class="edit-account__label" for="name">Name</label>
                    <input class="edit-account__name-input" type="text" name="name" placeholder="Account name" maxlength="30" autocomplete="off" .value=${state.nameValue} @input=${onNameInput}/>

                    <div class="edit-account__currency-grid">
                        ${currencies.map((c) => html`
                            <button type="button" class="edit-account__currency-btn ${state.selectedCurrency === c.code ? "selected" : ""}" @click=${() => selectCurrency(c.code)}>
                                <span class="edit-account__code">${c.code}</span>
                                <span class="edit-account__sign">${c.sign}</span>
                                <span class="edit-account__country">${c.country}</span>
                            </button>
                        `)}
                    </div>
                </form>

                <div class="edit-account__archive">
                    <span class="edit-account__label">Archive Account</span>
                    <p class="edit-account__archive-description">Archived accounts are hidden from your main view.</p>
                    <button
                        type="button"
                        class="edit-account__toggle ${state.isArchived ? "active" : ""}"
                        @click=${onToggleArchive}
                        role="switch"
                        aria-checked=${state.isArchived}
                    >
                        <span class="edit-account__toggle-thumb"></span>
                    </button>
                </div>

                ${state.errMessage ? html`<p class="add-account__error">${state.errMessage}</p>` : null}
                
                <div class="edit-account__actions">
                    <button class="edit-account__btn" type="submit" form="edit-account__form" ?disabled=${!state.nameValue.trim() || state.isSubmitting}>
                        Save Account (${state.selectedCurrency})
                    </button>
                </div>

            </div>
        </div>
    `;

export const editAccountView = async (ctx) => {
    const accId = ctx.params.id;
    const state = {
        selectedCurrency: "USD",
        nameValue: "",
        isArchived: false,
        isSubmitting: false,
        errMessage: null
    }

    try {
        const account = await getAccountById(accId);
        state.selectedCurrency = account.currency ?? "USD";
        state.nameValue = account.name ?? "";
        state.isArchived = account.isArchived ?? false;
    } catch (err) {
        state.errMessage = err.message
        renderForm()
    }

    function selectCurrency(code) {
        if (state.selectedCurrency === code) return;
        state.selectedCurrency = code;
        renderForm();
    }

    function onNameInput(event) {
        state.nameValue = event.target.value;
        renderForm();
    }

    function onToggleArchive() {
        state.isArchived = !isArchived;
        renderForm();
    }

    async function onSubmit(event) {
        event.preventDefault();
        if (state.isSubmitting) return;

        const formData = new FormData(event.target);
        const name = formData.get("name").trim();
        const currency = state.selectedCurrency
        const isArchived = state.isArchived

        if (!name) {
            state.errMessage = "Account name is required.";
            return renderForm();
        }

        state.isSubmitting = true;
        state.errMessage = null;
        renderForm();

        try {
            await editAccount(accId, { name, currency, isArchived });
            ctx.page.redirect("/");
        } catch (err) {
            state.errMessage = err.message
            state.isSubmitting = false;
            renderForm()
        }
    }

    function renderForm() {
        ctx.render(
            editAccountTemplate({ onSubmit, selectCurrency, onNameInput, onToggleArchive, state })
        );
    }

    renderForm();
};