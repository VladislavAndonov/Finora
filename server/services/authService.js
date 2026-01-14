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

        const createdUser = await User.create({ username, email, password });

        console.log("User register successfully");
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

        console.log("Successful login");
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