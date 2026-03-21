import "../../styles/notFound.css"

import { html } from "lit-html";

import { navigate } from "../utils/navigation";

export const notFoundView = (ctx) =>
    ctx.render(html`
        <div class="not-found">
            <div class="not-found__bg" aria-hidden="true"></div>

            <div class="not-found__content">
                <p class="not-found__code" aria-hidden="true">404</p>

                <div class="not-found__body">
                    <h1 class="not-found__title">Page not found</h1>
                    <p class="not-found__description">
                        The page you're looking for has been moved, deleted, or never existed.
                    </p>
                    <a href="/" class="not-found__btn" @click=${navigate}>
                        <i class="ph-bold ph-arrow-left" aria-hidden="true"></i>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    `);