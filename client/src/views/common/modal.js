import "../../../styles/modal.css"

import { html } from "lit-html";


export const modalTemplate = ({ content, onClose }) =>
    html`<div class="modal__backdrop" @click=${(e) => e.target === e.currentTarget && onClose()}>
            <div class="modal__content">
               ${content}
            </div>
        </div>`

