export const settings = {
    host: ""
}

async function request(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        try {
            const data = await response.json();
            return data;
        } catch (err) {
            return response;
        }
    } catch (err) {
        console.log(err.message)
    }
}

function getOptions(method = "get", body) {
    const options = {
        method,
        credentials: "include",
        headers: {}
    }
    const token = sessionStorage.getItem("authToken");
    if (token != null) {
        options.headers["X-Authorization"] = token;
    }
    if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    return options;
}

export async function get(url) {
    return await request(url, getOptions());
}

export async function post(url, data) {
    return await request(url, getOptions("post", data));
}

export async function put(url, data) {
    return await request(url, getOptions("put", data));
}

export async function del(url) {
    return await request(url, getOptions("delete"));
}

export async function login(email, password) {
    const result = await post(settings.host + "/auth/login", { email, password });

    sessionStorage.setItem("userId", result._id);
    sessionStorage.setItem("email", result.email);
    sessionStorage.setItem("username", result.username);

    return result;
}

export async function register(username, email, password) {
    const result = await post(settings.host + "/auth/register", { username, email, password });

    sessionStorage.setItem("userId", result._id);
    sessionStorage.setItem("email", result.email);
    sessionStorage.setItem("username", result.username);

    return result;
}

export async function logout() {
    const result = get(settings.host + "/auth/logout");

    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("username");

    return result
}