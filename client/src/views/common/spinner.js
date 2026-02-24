import { html } from "lit-html";
import "../../../styles/spinner.css"

export const spinner = () => html`
     <div class="loading-container">
        <span class="loading-spinner"></span>
    </div>
`;