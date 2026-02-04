import page from "//unpkg.com/page/page.mjs";
import { html } from 'https://esm.run/lit-html@1';
import { login } from "../api/data.js"

export const loginTemplate = (onSubmit, errMessage) =>
    html`
        <section class=login>
            <div class="login-layout">
                <form class="login-form" @submit=${onSubmit}>
                    <h2>Sign in</h2>

                    <fieldset>
                        <label for="email">Email</label>
                        <input type="text" name="email" id="email" autocomplete="on">
                    </fieldset>

                    <fieldset>
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password">
                    </fieldset>
                    
                    <div class="err-message">
                        <p>${errMessage}</p>
                    </div>

                    <div class="buttons">
                        <button class="sign-in-btn">Sign in</button>
                        <p>Or</p>
                        <button type="button" class="sign-up-btn" @click=${() => page.redirect("/auth/register")}>Sign up</button>
                    </div>

                    
                </form>
            </div>
        </section>
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