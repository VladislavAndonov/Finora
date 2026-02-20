import page from "page";

import { verifySession } from "../api/data.js";
import { isAuthenticated } from "../state/authState.js";
import { ensureActiveAccount } from "./ensureActiveAccount.js";

export async function authGuard(ctx, next) {
    await verifySession();

    if (!isAuthenticated()) {
        return page.redirect("/auth/login");
    }

    await ensureActiveAccount();
    next();
}

export function guestGuard(ctx, next) {
    if (isAuthenticated()) {
        page.redirect("/");
    }
    next();
}