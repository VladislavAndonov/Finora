import { isAuthenticated } from "../state/auth.js";
import page from "//unpkg.com/page/page.mjs";

export function authGuard(ctx, next) {
    if (!isAuthenticated()) {
        page.redirect("/auth/login");
    }
    next();
}

export function guestGuard(ctx, next) {
    if (isAuthenticated()) {
        page.redirect("/");
    }
    next();
}