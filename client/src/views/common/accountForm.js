import { html } from "lit-html";

export const accountForm = (onSubmit) =>
    html`
     <form @submit=${onSubmit}>
        <label class="account-form__label" for="name">Name</label>
        <input class="account-form__input" type="text" name="name" id="name">

        <label class="account-form__label" for="currency">Currency</label>
        <input class="account-form__input" type="text" name="currency" id="currency">

        <label class="account-form__label" for="startingBalance">Starting at:</label>
        <input class="account-form__input" type="text" name="startingBalance" id="startingBalance">
        
        <button type="submit" class="account-form__btn account-form__btn--primary">Submit</button>
        </form>`
