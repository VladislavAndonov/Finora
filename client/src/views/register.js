import { html, render } from 'https://esm.run/lit-html@1';

const root = document.querySelector(".app");

const registerTemplate = () =>
    html`
    <section class="register">
        <div class="register-layout">
            <form class="register-form" action="/auth/register" method="POST">
                <h2>Sign up now</h2>

                <fieldset>
                    <label for="username">Username</label>
                    <input type="username" name="username">
                </fieldset>


                <fieldset>
                    <label for="email">Email</label>
                    <input type="email" name="email">
                </fieldset>

                <fieldset>
                    <label for="password">Password</label>
                    <input type="password" name="password">
                </fieldset>

                <fieldset>
                    <label for="re-password">Confirm Password</label>
                    <input type="password" name="re-password">
                </fieldset>

                <div class="buttons">
                    <button class="sign-up-button">Sign up</button>
                    <p>Or</p>
                    <button class="sign-in-button">Sign in</button>
                </div>
            </form>
        </div>
    </section>`;

export async function registerPage() {
    render(registerTemplate(), root);
}