import mongoose from "mongoose";

import { User } from "./User.js";

const { Schema } = mongoose;

const transactionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters"],
        maxlength: [20, "Title must be maximum of 20 characters"],
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: {
            values: ["expenses", "income"],
            message: "Type can be either expenses or income"
        },
        required: [true, "Type is required"],
        index: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0.01, "Amount should be at least 0.01"],
        max: [999999.99, "Amount should be maximum of 999,999.99"],
        validate: {
            validator: (value) => {
                return Number.isInteger(value * 100);
            },
            message: "Amount can have at most two decimals places"
        }
    },
    date: {
        type: Date,
        default: Date.now,
        index: true,
    },
    category: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: [3, "Category must be at least 3 characters"],
        maxlength: [14, "Category must be maximum of 14 characters"],
    },
}, { timestamps: true })

transactionSchema.index({ ownerId: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);