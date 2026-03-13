import "../../styles/toast.css"

let container = null;
let toastIdCounter = 0

function getContainer() {
    if (!container) {
        container = document.createElement("div");
        container.classNmae = "toast-container"
        document.body.appendChild(container)
    }

    return container
}

export function showToast(message, type = "success", duration = 3000) {
    const id = toastIdCounter++;
    const el = document.createElement("div");

    el.className = `toast toast--${type}`;
    el.setAttribute("role", "alert");
    el.innerHTML = `
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Dismiss">✕</button>
    `;

    el.querySelector(".toast__close").addEventListener("click", () => clearToast(el));
    getContainer().appendChild(el);

    setTimeout(() => clearToast(el), duration);
}

function clearToast(el) {
    el.classList.add("toast--exit");
    el.addEventListener("animationend", () => el.remove(), { once: true });
}