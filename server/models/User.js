import mongoose from 'mongoose';
import bcrypt from "bcrypt"
import config from '../config/config.js';
import { EMAIL_REGEX } from '../../validators/index.js';


const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [14, "Username should be maximum of 14 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                EMAIL_REGEX.test(value)
            },
            message: "This is not a valid email format"
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    monthlyGoal: {
        type: Number,
        min: [10, "Monthly goal should be at least 10"],
        max: [999999.99, "Monthly goal should be maximum of 999,999.99"],
        validate: {
            validator: (value) => {
                return Number.isInteger(value * 100);
            },
            message: "Monthly goal can have at most two decimals places"
        },
        default: null
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, config.saltRounds);
    this.password = hash;
});

export const User = mongoose.model("User", userSchema);