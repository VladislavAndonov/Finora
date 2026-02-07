import page from "page";

export function navigate(path) {
    if (page.current === path) return
    page(path);
}