import { Router, urlencoded } from "express";

const routes = Router();

routes.use(urlencoded({ extended: false }))


routes.get("/", (req, res) => {
    res.send("Hello from homepage")
});

routes.get("/login", (req, res) => {
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

        <form class="login-form" action="/login" method="POST">
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

routes.post("/login", (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);

    res.redirect("/")

})


export default routes