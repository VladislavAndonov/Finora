import page from "//unpkg.com/page/page.mjs";

import { withAppShell, withoutShell } from "./middlewares/render.js"
import { homeView } from "./views/home.js";
import { loginView } from "./views/login.js";
import { registerView } from "./views/register.js";
import { notFoundView } from "./views/notFound.js";
import { calendarView } from "./views/calendar.js";


page("/", withAppShell, homeView);
page("/index.html", "/");
page("/auth/login", withoutShell, loginView);
page("/auth/register", withoutShell, registerView);
page("/calendar", withAppShell, calendarView);
page("*", withoutShell, notFoundView);

page();