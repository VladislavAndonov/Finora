import page from "page";

export function navigate(e) {
    e.preventDefault();
    const path = e.currentTarget.getAttribute("href");

    if (page.current === path) return

    page(path);
}