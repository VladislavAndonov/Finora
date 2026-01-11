import * as api from "./api.js";

const host = "http://localhost:3000";
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;