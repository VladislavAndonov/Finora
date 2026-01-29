import page from "//unpkg.com/page/page.mjs";
import { html } from 'https://esm.run/lit-html@1';
import { register } from '../api/data.js';

export const registerTemplate = (onSubmit, errMessage) =>
    html`
        <section class="register">
            <div class="register-layout">
                <form class="register-form" @submit=${onSubmit}>
                    <h2>Sign up now</h2>

                    <fieldset>
                        <label for="username">Username</label>
                        <input type="username" name="username" id="username" autocomplete="on">
                    </fieldset>


                    <fieldset>
                        <label for="email">Email</label>
                        <input type="email" name="email" id="email" autocomplete="on">
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
            return ctx.render(registerTemplate(onSubmit, "All fields are required!"));
        }
        if (password !== rePassword) {
            return ctx.render(registerTemplate(onSubmit, "Passwords should match!"));
        }

        await register(username, email, password);

        ctx.page.redirect("/");
    }
}