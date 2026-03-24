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

page("/", withAppShell, authGuard, homeView);
page("/index.html", "/");
page("/calendar", withAppShell, authGuard, calendarView);
page("/transactions", withAppShell, authGuard, transactionsView);
page("/transactions/add", withAppShell, authGuard, addTransactionView)
page("/transactions/edit/:id", withAppShell, authGuard, editTransactionView)
page("/accounts/add", withAppShell, authGuard, addAccountView)
page("/accounts/edit/:id", withAppShell, authGuard, editAccountView)


page("/auth/login", withoutShell, guestGuard, loginView);
page("/auth/register", withoutShell, guestGuard, registerView);

page("*", withoutShell, notFoundView);

page.start();