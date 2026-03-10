import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).end();
    }

    try {
        const decodedToken = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });

        req.user = decodedToken;
        next();
    } catch (err) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.status(401).end();
    }
}