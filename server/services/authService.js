import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


const authService = {
    async register(username, email, password) {
        const user = await User.findOne({ email });
        if (user) {
            throw new Error("This email has already been used")
        }

        const createdUser = await User.create({ username, email, password });
        return buildAuthResponse(createdUser);
    },

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("No such user found");
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            throw new Error("Invalid credentials");
        }

        return buildAuthResponse(user);
    },

    async logout() {
        // TODO: Invalidate Token;

        return true;
    }
}

async function buildAuthResponse(user) {
    const payload = {
        _id: user._id,
        email: user.email,
    };

    const token = await jwt.sign(payload, config.jwtSecret, { expiresIn: "2h" }, async (err, token) => {
        if (err) {
            throw new Error(err.message);
        };
        return token;
    });

    return { ...payload, accessToken: token }
}

export default authService;