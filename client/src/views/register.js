import "../../styles/register.css"

import { html } from "lit-html";

import { register } from '../api/data.js';
import { emailValidator } from "../utils/emailValidator.js";
import { navigate } from "../utils/navigation.js";

export const registerTemplate = (onSubmit, errMessage) =>
    html`
        <section class="register">
            <div class="register-layout">
                <form class="register-form" @submit=${onSubmit}>
                    <h2>Sign up now</h2>

                    <fieldset>
                        <label for="username">Username</label>
                        <input type="text" name="username" id="username" autocomplete="on">
                    </fieldset>

                    <fieldset>
                        <label for="email">Email</label>
                        <input type="text" name="email" id="email" autocomplete="on"">
                    </fieldset>

                    <fieldset>
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password">
                    </fieldset>

                    <fieldset>
                        <label for="rePassword">Confirm Password</label>
                        <input type="password" name="rePassword" id="rePassword">
                    </fieldset>

                    <div class="err-message">
                        <p>${errMessage}</p>
                    </div>

                    <div class="buttons">
                        <button class="sign-up-btn">Sign up</button>
                        <p>Or</p>
                        <button type="button" class="sign-in-btn" @click=${() => page.redirect("/auth/login")}>Sign in</button>
                    </div>
                </form>
            </div>
        </section>
    `;

export async function registerView(ctx) {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username").trim()
        const email = formData.get("email").trim()
        const password = formData.get("password").trim();
        const rePassword = formData.get("rePassword").trim();

        if (username === "" || email === "" || password === "" || rePassword === "") {
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
        if (password !== rePassword) {
            return ctx.render(registerTemplate(onSubmit, "Passwords should match!"));
        }
        if (password.length < 6) {
            return ctx.render(registerTemplate(onSubmit, "Password must be at least 6 characters."));
        }

        await register(username, email, password);

        ctx.page.redirect("/");
    }
}