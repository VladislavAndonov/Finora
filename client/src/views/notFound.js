import { html, render } from 'https://esm.run/lit-html@1';

const root = document.querySelector(".app");

const notFoundTemplate = () =>
    html`
    <div style="display: flex; flex-direction: column; align-items: center">
        <h1>Page Not Found!</h1>
        <a style="display: block; width: 200px; margin-top: 2rem; padding: 1rem; border: 1px solid #000; border-radius: 1rem; text-align: center" href="/">
            Get me back Home!
        </a>
    </div>`;

export const notFoundPage = () => render(notFoundTemplate(), root);