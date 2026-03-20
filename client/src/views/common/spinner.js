import "../../../styles/spinner.css"
import { html } from "lit-html";

export const spinner = () => html`
     <div class="loading-container">
        <span class="loading-spinner" aria-label="Loading"></span>
    </div>
`;