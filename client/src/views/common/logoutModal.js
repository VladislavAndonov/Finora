import "../../../styles/modal.css"

import { html } from "lit-html";


export const modalTemplate = ({ onConfirmLogout, onCancelLogout, onClose }) =>
    html`
        <div class="modal__backdrop" @click=${(e) => e.target === e.currentTarget && onClose()}>
            <div class="modal__content">
                <p class="modal__message">Are you sure you want to logout?</p>
                <div class="modal__actions">
                    <button class="modal__btn modal__btn--primary" @click=${onConfirmLogout}>Confirm</button>
                    <button class="modal__btn modal__btn--secondary" @click=${onCancelLogout}>Cancel</button>
                </div>
            </div>
        </div>
        `

