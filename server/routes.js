import { Router } from "express";
import authController from "./controllers/authController.js";

const routes = Router();

routes.use(authController);

routes.get("/", (req, res) => {
    res.send("Hello from homepage")
});

routes.get("/auth/login", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="/styles/reset.css">
    <link rel="stylesheet" href="./styles/variables.css">
    <link rel="stylesheet" href="../../client/styles/typography.css">
    <link rel="stylesheet" href="../styles/login.css">
</head>

<body>
    <div class="login-wrapper">

        <form class="login-form" action="/auth/login" method="POST">
            <h2>Sign in</h2>

            <fieldset>
                <label for="email">Email</label>
                <input type="email" name="email" id="email">
            </fieldset>

            <fieldset>
                <label for="password">Password</label>
                <input type="password" name="password" id="password">
            </fieldset>

            <div class="buttons">
                <button class="sign-in-button">Sign in</button>
                <p>Or</p>
                <button class="sign-up-button">Sign up</button>
            </div>
        </form>
    </div>
</body>

</html>
`)
});

routes.get("/auth/register", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="../../styles/reset.css">
    <link rel="stylesheet" href="../../styles/variables.css">
    <link rel="stylesheet" href="../../styles/typography.css">
    <link rel="stylesheet" href="../../styles/register.css">
</head>

<body>
    <div class="register-wrapper">

        <form class="register-form" action="/auth/register" method="POST">
            <h2>Sign up now</h2>

            <fieldset>
                <label for="username">Username</label>
                <input type="username" name="username">
            </fieldset>


            <fieldset>
                <label for="email">Email</label>
                <input type="email" name="email">
            </fieldset>

            <fieldset>
                <label for="password">Password</label>
                <input type="password" name="password">
            </fieldset>

            <fieldset>
                <label for="re-password">Confirm Password</label>
                <input type="password" name="re-password">
            </fieldset>

            <div class="buttons">
                <button class="sign-up-button">Sign up</button>
                <p>Or</p>
                <button class="sign-in-button">Sign in</button>
            </div>
        </form>
    </div>
</body>

</html>
`)
})


export default routes