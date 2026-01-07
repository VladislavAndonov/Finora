import page from "//unpkg.com/page/page.mjs"
import { calendarPage } from "./views/calendar.js";
import { homePage } from "./views/home.js"
import { loginPage } from "./views/login.js";
import { notFoundPage } from "./views/notFound.js";
import { registerPage } from "./views/register.js";

page("/", homePage);
page("/index.html", "/");
page("/calendar", calendarPage);
page("/auth/login", loginPage);
page("/auth/register", registerPage);
page("*", notFoundPage)

page();