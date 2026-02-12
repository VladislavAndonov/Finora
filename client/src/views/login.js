import "../../styles/login.css"

import { html } from "lit-html";

import { login } from "../api/data.js"
import { navigate } from "../utils/navigation.js";

export const loginTemplate = (onSubmit, errMessage) =>
    html`
        <div class="login-view">
            <div class="login-view-layout">

                <form class="login-form" @submit=${onSubmit}>
                    <header class="login-header">
                        <h2 class="login-title">Sign in</h2>
                    </header>

                    <fieldset>
                        <label for="email">Email</label>
                        <input type="text" name="email" id="email" inputmode="email" autocomplete="email">
                    </fieldset>

                    <fieldset>
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password">
                    </fieldset>
                    
                    <div class="login-form-error">
                        <p>${errMessage}</p>
                    </div>

                    <div class="login-form-buttons">
                        <button type="submit" class="login-sign-in">Sign in</button>
                        <span>Or</span>
                        <button type="button" class="login-sign-up" @click=${() => navigate("/auth/register")}>Sign up</button>
                    </div>
                </form>
                
            </div>
        </div>
    `;

export async function loginView(ctx) {
    ctx.render(loginTemplate(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email").trim();
        const password = formData.get("password").trim();

        if (email === "" || password === "") {
            return ctx.render(loginTemplate(onSubmit, "All fields are required."));
        }

        await login(email, password);

        ctx.page.redirect("/");
    }
}