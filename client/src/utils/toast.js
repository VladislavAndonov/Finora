import "../../styles/toast.css"

let container = null;

function getContainer() {
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container"
        document.body.appendChild(container)
    }

    return container
}

const icons = {
    success: "ph-check-circle",
    error: "ph-x-circle",
    info: "ph-info",
};

export function showToast(message, type = "success", duration = 4000) {
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.setAttribute("role", "alert");

    const icon = icons[type] ?? icons.info;

    el.innerHTML = `
        <i class="toast__icon ph-fill ${icon}" aria-hidden="true"></i>
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Dismiss notification">
            <i class="ph-bold ph-x" aria-hidden="true"></i>
        </button>
    `;

    el.querySelector(".toast__close").addEventListener("click", () => clearToast(el));
    getContainer().appendChild(el);

    setTimeout(() => clearToast(el), duration);
}

function clearToast(el) {
    el.classList.add("toast--exit");
    el.addEventListener("animationend", () => el.remove(), { once: true });
}