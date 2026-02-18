import { html } from "lit-html";

import { navigate } from "../utils/navigation";

export const notFoundView = (ctx) =>
    ctx.render(html`
        <div style="display: flex; flex-direction: column; height: 100vh; padding-bottom: 20vh; align-items: center; justify-content: center">
            <p>404 Not Found</p>
            <h1 style="margin: 1rem">Oops! Page Not Found</h1>
            <p>The page you are looking for doesn't exist. Click button bellow to go to homepage.</p>
            <a href="/" style="display: block; background-color: var(--bg-secondary); width: 10rem; margin-top: 4rem; padding: 1rem; border-radius: 1rem; text-align: center" @click=${navigate}>
                Back to Home
            </a>
        </div>
    `);