import { html } from 'https://esm.run/lit-html@1';


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

