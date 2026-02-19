import { clearActiveAccountId } from "./sessionState.js";

export const isAuthenticated = () => {
    return sessionStorage.getItem("userId") !== null
}

export const setAuth = (user) => {
    sessionStorage.setItem("userId", user._id);
    sessionStorage.setItem("email", user.email);
    sessionStorage.setItem("username", user.username);
}

export const clearAuth = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("username");
    clearActiveAccountId();
}