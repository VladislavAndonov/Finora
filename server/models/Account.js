import mongoose from "mongoose";

import { User } from "./User.js";

const { Schema } = mongoose;

const currencies = [
    "USD",
    "EUR",
    "JPY",
    "GBP",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "SEK",
    "NZD",
    "MXN",
    "INR",
    "NOK",
    "KRW",
    "BTC"
]

const accountSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
        maxlength: [20, "Name must be 20 characters or fewer."],
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
        enum: {
            values: currencies,
            message: "Invalid currency."
        },
    },
    balance: {
        type: Number,
        requred: true,
        default: 0
    },
    isArchived: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

accountSchema.index({ ownerId: 1, isArchived: 1 });

export const Account = mongoose.model("Account", accountSchema);