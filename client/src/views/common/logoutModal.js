import "../../../styles/modal.css"

import { html } from "lit-html";


export const modalTemplate = ({ onConfirmLogout, onCancelLogout }) =>
    html`
    <div class="modal__backdrop" @click=${(e) => e.target === e.currentTarget && onCancelLogout()}>
        <div class="modal__content">
 
            <div class="modal__header">
                <p class="modal__title">Are you sure you want to logout?</p>
                <button class="modal__close" type="button" @click=${onCancelLogout}>
                    <i class="ph-bold ph-x"></i>
                </button>
            </div>
 
            <div class="modal__actions">
                <button class="modal__btn modal__btn--primary" type="button" @click=${onConfirmLogout}>
                    <i class="ph-bold ph-sign-out app-layout__icon"></i>
                    Confirm
                </button>
                <button class="modal__btn modal__btn--secondary" type="button" @click=${onCancelLogout}>Cancel</button>
            </div>
 
        </div>
    </div>
`

