import "../../styles/login.css"

import { html } from "lit-html";

import { login } from "../api/data.js"
import { navigate } from "../utils/navigation.js";

export const loginTemplate = (onSubmit, errMessage, isSubmitting) =>
    html`
        <main class="login">
            <div class="login__content">

                <form class="login__form" @submit=${onSubmit}>
                    <header class="login__header">
                        <h2 class="login__title">Sign in</h2>
                    </header>

                    <fieldset class="login__fieldset">
                        <label class="login__label" for="email">Email</label>
                        <input class="login__input" type="text" name="email" id="email" inputmode="email" autocomplete="email">
                    </fieldset>

                    <fieldset class="login__fieldset">
                        <label class="login__label" for="password">Password</label>
                        <input class="login__input" type="password" name="password" id="password">
                    </fieldset>
                    
                    ${errMessage ? html`<p class="login__error">${errMessage}</p>` : null}

                    <div class="login__actions">
                        <button type="submit" class="login__btn login__btn--primary ${isSubmitting ? 'login__btn--loading' : ''}" ?disabled=${isSubmitting}>${isSubmitting ? "Signing in..." : "Sign in"}</button>
                        <span class="login__divider">Or</span>
                        <a href="/auth/register" class="login__nav-link" @click=${navigate}>Sign up</a>
                    </div>
                </form>
                
            </div>
        </main>
    `;

export async function loginView(ctx) {
    let errMessage = null;
    let isSubmitting = false;

    function render() {
        ctx.render(loginTemplate(onSubmit, errMessage, isSubmitting));
    }

    render()

    async function onSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        const formData = new FormData(event.target);
        const email = formData.get("email").trim();
        const password = formData.get("password").trim();

        if (!email || !password) {
            errMessage = "All fields are required.";
            return render()
        }

        isSubmitting = true;
        errMessage = null;
        render();

        try {
            await login(email, password);
            ctx.page.redirect("/");
        } catch (err) {
            errMessage = err.message;
            isSubmitting = false;
            render()
        }
    }
}