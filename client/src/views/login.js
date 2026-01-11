import { html } from 'https://esm.run/lit-html@1';

export const loginView = (ctx) =>
    ctx.render(html`
        <section class=login>
            <div class="login-layout">
                <form class="login-form" action="/auth/login" method="POST">
                    <h2>Sign in</h2>

                    <fieldset>
                        <label for="email">Email</label>
                        <input type="email" name="email">
                    </fieldset>

                    <fieldset>
                        <label for="password">Password</label>
                        <input type="password" name="password">
                    </fieldset>

                    <div class="buttons">
                        <button class="sign-in-button">Sign in</button>
                        <p>Or</p>
                        <button class="sign-up-button">Sign up</button>
                    </div>
                </form>
            </div>
        </section>
    `);
