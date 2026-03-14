import "../../styles/login.css"

import { html } from "lit-html";

import { login } from "../api/data.js"
import { navigate } from "../utils/navigation.js";
import { emailValidator } from "../utils/emailValidator.js";
import { showToast } from "../utils/toast.js";

export const loginTemplate = (onSubmit, onDemoLogin, errMessage, isSubmitting) =>
    html`
        <main class="login">
            <div class="login__content">

                <form class="login__form" @submit=${onSubmit}>
                    <header class="login__header">
                        <h2 class="login__title">Sign in</h2>
                        <p class="login__subtitle">Welcome back</p>
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

                    <div class="login__demo-section">

                        <div class="login__actions">
                            <button type="submit" class="login__btn login__btn--primary ${isSubmitting ? 'login__btn--loading' : ''}" ?disabled=${isSubmitting}>${isSubmitting ? "Signing in..." : "Sign in"}</button>
                            <p class="login__signup-prompt">
                                Don't have an account yet?
                                <a href="/auth/register" class="login__nav-link" @click=${navigate}>Sign up</a>
                            </p>
                        </div>

                        <div class="login__divider">try without an account</div>

                        <button type="button" class="login__btn login__btn--demo" @click=${onDemoLogin} ?disabled=${isSubmitting}>Demo Login</button>
                    </div>

                </form>
                
            </div>
        </main>
    `;

export async function loginView(ctx) {
    let errMessage = null;
    let isSubmitting = false;

    function render() {
        ctx.render(loginTemplate(onSubmit, onDemoLogin, errMessage, isSubmitting));
    }

    render()

    async function onSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        const formData = new FormData(event.target);
        const email = formData.get("email").trim();
        const password = formData.get("password").trim();

        if (!email || !password) {
            errMessage = "Please fill all fields.";
            return render()
        }
        if (!emailValidator(email)) {
            errMessage = "Please enter a valid email address.";
            return render();
        }

        isSubmitting = true;
        errMessage = null;
        render();

        try {
            await login(email, password);
            showToast("Logged in successfully!");
            ctx.page.redirect("/");
        } catch (err) {
            showToast("Something went wrong! Please, try again later.", "error");
            isSubmitting = false;
            render()
        }
    }

    async function onDemoLogin() {
        if (isSubmitting) return;

        isSubmitting = true;
        errMessage = null;
        render();

        try {
            await login("demo@gmail.com", "123456");
            showToast("Logged in successfully!");
            ctx.page.redirect("/");
        } catch (err) {
            showToast("Something went wrong! Please, try again later.", "error");
            isSubmitting = false;
            render();
        }
    }
}