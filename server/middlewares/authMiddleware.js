import jwt from "jsonwebtoken";
import config from "../config/config.js";
import AppError from "../errors/AppError.js";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new AppError("No authentication token", 401)
        }

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