import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/User.js";
import config from "../config/config.js";


const authService = {
    async register(username, email, password) {
        const user = await User.findOne({ email });
        if (user) {
            throw new Error("This email has already been used")
        }

        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters")
        }

        const createdUser = await User.create({ username, email, password });

        return buildAuthResponse(createdUser);
    },

    async login(email, password) {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            throw new Error("Invalid credentials");
        }

        return buildAuthResponse(user);
    },

    async logout() {
        // Invalidate token
        return true;
    }
}

function buildAuthResponse(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        username: user.username
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "30m" });

    return { payload, token }
}

export default authService;