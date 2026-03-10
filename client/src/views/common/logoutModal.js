import "../../../styles/modal.css"

import { html } from "lit-html";


export const modalTemplate = ({ onConfirmLogout, onCancelLogout }) =>
    html`
        <div class="modal__backdrop" @click=${(e) => e.target === e.currentTarget && onCancelLogout()}>
            <div class="modal__content">
                <div class="modal__header">
                    <p class="modal__title">Are you sure you want to logout?</p>
                     <button class="modal__close" @click=${onCancelLogout}>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal__actions">
                    <button class="modal__btn modal__btn--primary" @click=${onConfirmLogout}>Confirm</button>
                    <button class="modal__btn modal__btn--secondary" @click=${onCancelLogout}>Cancel</button>
                </div>
            </div>
        </div>
        `

