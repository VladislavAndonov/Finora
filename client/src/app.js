import page from "//unpkg.com/page/page.mjs";

import { homeView } from "./views/home.js";
import { loginView } from "./views/login.js";
import { registerView } from "./views/register.js";
import { notFoundView } from "./views/notFound.js";
import { calendarView } from "./views/calendar.js";
import { withAppShell, withoutShell } from "./middlewares/render.js"
import { authGuard, guestGuard } from "./middlewares/guards.js";
import { transactionsView } from "./views/transactions.js";
import { addTransactionView } from "./views/addTransaction.js";
import { editTransactionView } from "./views/editTransaction.js";

page("/", authGuard, withAppShell, homeView);
page("/index.html", "/");
page("/calendar", authGuard, withAppShell, calendarView);
page("/transactions", authGuard, withAppShell, transactionsView);
page("/transactions/add", authGuard, withAppShell, addTransactionView)
page("/transactions/edit/:id", authGuard, withAppShell, editTransactionView)

page("/auth/login", guestGuard, withoutShell, loginView);
page("/auth/register", guestGuard, withoutShell, registerView);

page("*", withoutShell, notFoundView);

page.start();