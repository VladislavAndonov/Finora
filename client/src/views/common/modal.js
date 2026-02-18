import "../../../styles/modal.css"

import { html } from "lit-html";


export const modalTemplate = ({ message, onConfirm, onCancel }) =>
    html`<div class="modal__backdrop">
            <div class="modal__content">
                <p class="modal__message">${message}</p>
                <div class="modal__actions">
                    <button class="modal__btn modal__btn--primary" @click=${onConfirm}>
                        Confirm
                    </button>
                    <button class="modal__btn modal__btn--secondary" @click=${onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>`

