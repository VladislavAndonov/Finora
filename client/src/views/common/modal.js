import "../../../styles/modal.css"

import { html } from "lit-html";


export const modalTemplate = ({ message, onConfirm, onCancel }) =>
    html`<div class="modal-backdrop">
            <div class="modal-content">
                <h4 class="modal-message">${message}</h4>
                <div class="modal-buttons">
                    <button class="modal-confirm" @click=${onConfirm}>
                        Confirm
                    </button>
                    <button class="modal-cancel" @click=${onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>`

