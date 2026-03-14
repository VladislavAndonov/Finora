import "../../styles/register.css"

import { html } from "lit-html";

import { register } from '../api/data.js';
import { emailValidator } from "../utils/emailValidator.js";
import { navigate } from "../utils/navigation.js";
import { showToast } from "../utils/toast.js";

export const registerTemplate = (onSubmit, errMessage, isSubmitting) =>
    html`
        <main class="register">
            <div class="register__content">

                <form class="register__form" @submit=${onSubmit}>
                    <header class="register__header">
                        <h2 class="register__title">Sign up</h2>
                        <p class="register__subtitle">Welcome to Finora</p>
                    </header>

                    <fieldset class="register__fieldset">
                        <label class="register__label" for="username">Username</label>
                        <input class="register__input" type="text" name="username" id="username" autocomplete="username">
                    </fieldset>

                    <fieldset class="register__fieldset">
                        <label class="register__label" for="email">Email</label>
                        <input class="register__input" type="text" name="email" id="email" inputmode="email" autocomplete="email">
                    </fieldset>

                    <fieldset class="register__fieldset">
                        <label class="register__label" for="password">Password</label>
                        <input class="register__input" type="password" name="password" id="password">
                    </fieldset>

                    <fieldset class="register__fieldset">
                        <label class="register__label" for="confirmPassword">Confirm Password</label>
                        <input class="register__input" type="password" name="confirmPassword" id="confirmPassword">
                    </fieldset>

                    ${errMessage ? html`<p class="register__error">${errMessage}</p>` : null}


                    <div class="register__actions">
                        <button type="submit" class="register__btn register__btn--primary ${isSubmitting ? 'register__btn--loading' : ''}" ?disabled=${isSubmitting}>${isSubmitting ? "Signing up..." : "Sign up"}</button>
                        <p class="register__signup-prompt">
                            Already have an account?
                            <a href="/auth/login" class="register__nav-link" @click=${navigate}>Sign in</a>
                        </p>
                    </div>

                </form>
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
            showToast("Something went wrong! Please, try again later.", "error");
            isSubmitting = false;
            render()
        }
    }
}