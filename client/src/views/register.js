import "../../styles/register.css"

import { html } from "lit-html";

import { register } from '../api/data.js';
import { emailValidator } from "../utils/emailValidator.js";
import { navigate } from "../utils/navigation.js";
import { showToast } from "../utils/toast.js";

export const registerTemplate = (onSubmit, errMessage, isSubmitting) =>
    html`
        <main class="register">
            <div class="register__card">

                <div class="register__panel register__panel--form">
                    <div class="register__form-inner">

                        <header class="register__header">
                            <h2 class="register__title">Create account</h2>
                            <p class="register__subtitle">Start tracking your finances today</p>
                        </header>

                        <form class="register__form" @submit=${onSubmit}>

                            <div class="register__fieldset">
                                <label class="register__label" for="username">Username</label>
                                <input class="register__input" type="text" name="username" id="username"
                                    autocomplete="username" placeholder="john.doe">
                            </div>

                            <div class="register__fieldset">
                                <label class="register__label" for="email">Email</label>
                                <input class="register__input" type="text" name="email" id="email"
                                    inputmode="email" autocomplete="email" placeholder="johndoe@gmail.com">
                            </div>

                            <div class="register__fieldset">
                                <label class="register__label" for="password">Password</label>
                                <input class="register__input" type="password" name="password" id="password"
                                    placeholder="••••••••">
                            </div>

                            <div class="register__fieldset">
                                <label class="register__label" for="confirmPassword">Confirm Password</label>
                                <input class="register__input" type="password" name="confirmPassword" id="confirmPassword"
                                    placeholder="••••••••">
                            </div>

                            <div class="register__error-slot">
                                ${errMessage ? html`
                                    <p class="register__error">
                                        <i class="ph-fill ph-warning-circle" aria-hidden="true"></i>
                                        ${errMessage}
                                    </p>
                                ` : null}
                            </div>

                            <div class="register__actions">
                                <button type="submit"
                                    class="register__btn register__btn--primary ${isSubmitting ? 'register__btn--loading' : ''}"
                                    ?disabled=${isSubmitting}>
                                    ${isSubmitting ? "Signing up..." : "Create account"}
                                </button>
                            </div>

                        </form>

                        <p class="register__signup-prompt">
                            Already have an account?
                            <a href="/auth/login" class="register__nav-link" @click=${navigate}>Sign in</a>
                        </p>

                    </div>
                </div>

                <div class="register__panel register__panel--visual" aria-hidden="true">
                    <div class="register__panel-overlay"></div>

                    <div class="register__branding">
                        <span class="register__brand-label">Finora</span>
                    </div>

                    <div class="register__panel-copy">
                        <p class="register__panel-eyebrow">Take the first step,</p>
                        <h1 class="register__panel-headline">Know your numbers</h1>
                        <p class="register__panel-body">Join thousands who've taken back control of their finances. It only takes a minute to get started.</p>
                    </div>
                </div>

            </div>
        </main>
    `;

export async function registerView(ctx) {
    let errMessage = null;
    let isSubmitting = false

    function render() {
        ctx.render(registerTemplate(onSubmit, errMessage, isSubmitting));
    }

    render()

    async function onSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        const formData = new FormData(event.target);
        const username = formData.get("username").trim()
        const email = formData.get("email").trim()
        const password = formData.get("password").trim();
        const confirmPassword = formData.get("confirmPassword").trim();

        if (!username || !email || !password || !confirmPassword) {
            errMessage = "Please fill all fields.";
            return render()
        }
        if (username.length < 3) {
            errMessage = "Username must be at least 3 characters.";
            return render()
        }
        if (username.length > 20) {
            errMessage = "Username must be 20 characters or fewer.";
            return render()
        }
        if (!emailValidator(email)) {
            errMessage = "Please enter a valid email address.";
            return render()
        }
        if (password !== confirmPassword) {
            errMessage = "Passwords must match.";
            return render()
        }
        if (password.length < 6) {
            errMessage = "Password must be at least 6 characters.";
            return render()
        }

        isSubmitting = true;
        errMessage = null;
        render();

        try {
            await register(username, email, password);
            showToast("Welcome to Finora!");
            ctx.page.redirect("/");
        } catch (err) {
            showToast("Register failed. Please, try again later.", "error");
            isSubmitting = false;
            render()
        }
    }
}