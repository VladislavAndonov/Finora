import page from "//unpkg.com/page/page.mjs";

export function navigate(path) {
    if (page.current === path) return
    page(path);
}