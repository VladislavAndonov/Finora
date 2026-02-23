import { accountForm } from "./common/accountForm";

const editAccountTemplate = (onSubmit) =>
    html`<div class="edit-account">
            <header class="edit-account__header">
                <h1 class="edit-account__title">Edit Account</h1>
            </header>

            <div class="edit-account__content">
                ${accountForm(onSubmit)}
            </div>
        </div>`;


export const editAccountView = (ctx) => {
    function renderForm() {
        ctx.render(editAccountTemplate(onSubmit))
    }

    renderForm()
}