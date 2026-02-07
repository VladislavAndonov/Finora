import { clearAuth, setAuth } from '../state/auth.js';
import page from '//unpkg.com/page/page.mjs';

export const settings = {
    host: ""
}

async function request(url, options) {
    const response = await fetch(settings.host + url, options);
    if (response.status === 401) {
        clearAuth();
        page.redirect("/auth/login");
        throw new Error("Unauthorized");
    }

    if (response.status === 404) {
        throw new Error("Not Found")
    }

    if (!response.ok) {
        throw new Error("Request failed");
    }

    if (response.status === 204) {
        return null
    }

    return response.json();
}

function getOptions(method = "get", body) {
    const options = {
        method,
        credentials: "include",
        headers: {}
    }

    if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    return options;
}

export async function get(url) {
    return request(url, getOptions());
}

export async function post(url, data) {
    return request(url, getOptions("post", data));
}

export async function put(url, data) {
    return request(url, getOptions("put", data));
}

export async function del(url) {
    return request(url, getOptions("delete"));
}

export async function login(email, password) {
    const user = await post("/auth/login", { email, password });

    setAuth(user);
    return user;
}

export async function register(username, email, password) {
    const user = await post("/auth/register", { username, email, password });

    setAuth(user);
    return user;
}

export async function logout() {
    await get("/auth/logout");

    clearAuth();
}

export async function verifySession() {
    try {
        const user = await get("/auth/me");

        setAuth(user);
    } catch {
        clearAuth();
    }
}