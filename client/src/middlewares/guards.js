import page from "page";

import { render } from "lit-html";
import { verifySession } from "../api/data.js";
import { isAuthenticated } from "../state/authState.js";
import { ensureActiveAccount } from "./ensureActiveAccount.js";
import { spinner } from "../views/common/spinner.js";

const root = document.querySelector(".app");

export async function authGuard(ctx, next) {
    render(spinner(), root);

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