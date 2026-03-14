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

export function showToast(message, type = "success", duration = 4000) {
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.setAttribute("role", "alert");

    el.innerHTML = `
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Dismiss">
            <i class="fa-solid fa-xmark"></i>
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