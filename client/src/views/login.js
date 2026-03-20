import "../../styles/login.css"

import { html } from "lit-html";

import { login } from "../api/data.js"
import { navigate } from "../utils/navigation.js";
import { emailValidator } from "../utils/emailValidator.js";
import { showToast } from "../utils/toast.js";

export const loginTemplate = (onSubmit, onDemoLogin, errMessage, isSubmitting) =>
    html`
        <main class="login">
            <div class="login__card">

            <div class="login__panel login__panel--visual" aria-hidden="true">
                    <div class="login__panel-overlay"></div>

                    <div class="login__branding">
                        <span class="login__brand-label">Finora</span>
                    </div>

                    <div class="login__panel-copy">
                        <p class="login__panel-eyebrow">Your money,</p>
                        <h1 class="login__panel-headline">Fully in control</h1>
                        <p class="login__panel-body">Track spending, manage accounts, and understand where your money goes — all in one place.</p>
                    </div>
                </div>

                <div class="login__panel login__panel--form">
                    <div class="login__form-inner">

                        <header class="login__header">
                            <h2 class="login__title">Welcome back</h2>
                            <p class="login__subtitle">Sign in to your account to continue</p>
                        </header>

                        <form class="login__form" @submit=${onSubmit}>

                            <div class="login__fieldset">
                                <label class="login__label" for="email">Email</label>
                                <input class="login__input" type="text" name="email" id="email"
                                    inputmode="email" autocomplete="email" placeholder="johndoe@gmail.com">
                            </div>

                            <div class="login__fieldset">
                                <label class="login__label" for="password">Password</label>
                                <input class="login__input" type="password" name="password" id="password"
                                    placeholder="••••••••">
                            </div>

                           <div class="login__error-slot">
                                ${errMessage ? html`
                                    <p class="login__error">
                                        <i class="ph-fill ph-warning-circle" aria-hidden="true"></i>
                                        ${errMessage}
                                    </p>
                                ` : null}
                            </div>

                            <div class="login__actions">
                                <button type="submit"
                                    class="login__btn login__btn--primary ${isSubmitting ? 'login__btn--loading' : ''}"
                                    ?disabled=${isSubmitting}>
                                    ${isSubmitting ? "Signing in..." : "Sign in"}
                                </button>

                                <div class="login__divider">or</div>

                                <button type="button" class="login__btn login__btn--demo"
                                    @click=${onDemoLogin} ?disabled=${isSubmitting}>
                                    Try the demo
                                </button>
                            </div>

                        </form>

                        <p class="login__signup-prompt">
                            Don't have an account?
                            <a href="/auth/register" class="login__nav-link" @click=${navigate}>Sign up</a>
                        </p>

                    </div>
                </div>

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
            showToast("Logged in successfully.");
            ctx.page.redirect("/");
        } catch (err) {
            showToast("Login failed. Please, try again later.", "error");
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
            showToast("Logged in with demo account. Data is for demonstration purposes only.");
            ctx.page.redirect("/");
        } catch (err) {
            showToast("Login failed. Please, try again later.", "error");
            isSubmitting = false;
            render();
        }
    }
}