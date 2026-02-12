import "../../styles/register.css"

import { html } from "lit-html";

import { register } from '../api/data.js';
import { emailValidator } from "../utils/emailValidator.js";
import { navigate } from "../utils/navigation.js";

export const registerTemplate = (onSubmit, errMessage) =>
    html`
        <div class="register-view">
            <div class="register-view-layout">

                <form class="register-form" @submit=${onSubmit}>
                    <header class="register-header">
                        <h2 class="register-title">Sign up</h2>
                    </header>

                    <fieldset>
                        <label for="username">Username</label>
                        <input type="text" name="username" id="username" autocomplete="username">
                    </fieldset>

                    <fieldset>
                        <label for="email">Email</label>
                        <input type="text" name="email" id="email" inputmode="email" autocomplete="email">
                    </fieldset>

                    <fieldset>
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password">
                    </fieldset>

                    <fieldset>
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword">
                    </fieldset>

                    <div class="register-form-error">
                        <p>${errMessage}</p>
                    </div>

                    <div class="register-form-buttons">
                        <button type="submit" class="register-sign-up">Sign up</button>
                        <span>Or</span>
                        <button type="button" class="register-sign-in" @click=${() => navigate("/auth/login")}>Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    `;

export async function registerView(ctx) {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username").trim()
        const email = formData.get("email").trim()
        const password = formData.get("password").trim();
        const confirmPassword = formData.get("confirmPassword").trim();

        if (username === "" || email === "" || password === "" || confirmPassword === "") {
            return ctx.render(registerTemplate(onSubmit, "All fields are required"));
        }
        if (username.length < 3) {
            return ctx.render(registerTemplate(onSubmit, "Username must be at least 3 characters."));
        }
        if (username.length > 14) {
            return ctx.render(registerTemplate(onSubmit, "Username must be 14 characters or fewer."));
        }
        if (!emailValidator(email)) {
            return ctx.render(registerTemplate(onSubmit, "Email format is invalid."));
        }
        if (password !== confirmPassword) {
            return ctx.render(registerTemplate(onSubmit, "Passwords should match!"));
        }
        if (password.length < 6) {
            return ctx.render(registerTemplate(onSubmit, "Password must be at least 6 characters."));
        }

        await register(username, email, password);

        ctx.page.redirect("/");
    }
}