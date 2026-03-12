import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/User.js";
import config from "../config/config.js";
import mongoose from "mongoose";
import { Account } from "../models/Account.js";
import AppError from "../errors/AppError.js";


const authService = {
    async register(username, email, password) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            const user = await User.findOne({ email });

            if (user) {
                throw new AppError("This email has already been used", 409)
            }

            const [createdUser] = await User.create([{ username, email, password }], { session });

            await Account.create([{
                name: "Bank",
                currency: "EUR",
                balanceCents: 0,
                ownerId: createdUser._id
            }], { session })

            await session.commitTransaction();
            return buildAuthResponse(createdUser);

        } catch (err) {
            await session.abortTransaction()
            throw err
        } finally {
            session.endSession()
        }
    },

    async login(email, password) {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new AppError("Invalid credentials", 400);
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            throw new AppError("Invalid credentials", 400);
        }

        return buildAuthResponse(user);
    },

    async logout() {
        // TODO: Invalidate token on logout
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