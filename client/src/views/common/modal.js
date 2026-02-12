import "../../../styles/modal.css"

import { html } from "lit-html";


export const modalTemplate = (onConfirm, onCancel) =>
    html`<div class="modal-backdrop">
            <div class="modal-content">
                <h4 class="modal-message">Do you really wish to logout?</h4>
                <div class="modal-buttons">
                    <button class="confirm-button" @click=${onConfirm}>
                        Confirm
                    </button>
                    <button class="cancel-button" @click=${onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>`

