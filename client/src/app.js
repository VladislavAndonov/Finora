import page from "//unpkg.com/page/page.mjs";

import { withAppShell, withoutShell } from "./middlewares/render.js"
import { homeView } from "./views/home.js";
import { loginView } from "./views/login.js";
import { registerView } from "./views/register.js";
import { notFoundView } from "./views/notFound.js";
import { calendarView } from "./views/calendar.js";
import { withAppShell, withoutShell } from "./middlewares/render.js"
import { authGuard, guestGuard } from "./middlewares/guards.js";
import { logout, verifySession } from "./api/data.js";

page("/", authGuard, withAppShell, homeView);
page("/index.html", "/");
page("/calendar", authGuard, withAppShell, calendarView);

page("/auth/login", guestGuard, withoutShell, loginView);
page("/auth/register", guestGuard, withoutShell, registerView);
page("/auth/logout", async () => {
    await logout();
    page.redirect("/auth/login");
});

page("*", withoutShell, notFoundView);

page();