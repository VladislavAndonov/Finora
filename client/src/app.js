import '@fortawesome/fontawesome-free/css/all.min.css'
import "../styles/reset.css";
import "../styles/variables.css"
import "../styles/typography.css"

import page from "page";

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
import { addAccountView } from './views/addAccount.js';
import { editAccountView } from './views/editAccount.js';

page("/", authGuard, withAppShell, homeView);
page("/index.html", "/");
page("/calendar", authGuard, withAppShell, calendarView);
page("/transactions", authGuard, withAppShell, transactionsView);
page("/transactions/add", authGuard, withAppShell, addTransactionView)
page("/transactions/edit/:id", authGuard, withAppShell, editTransactionView)
page("/accounts/add", authGuard, withAppShell, addAccountView)
page("/accounts/edit/:id", authGuard, withAppShell, editAccountView)


page("/auth/login", guestGuard, withoutShell, loginView);
page("/auth/register", guestGuard, withoutShell, registerView);

page("*", withoutShell, notFoundView);

page.start();