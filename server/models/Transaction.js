import mongoose from "mongoose";

import { User } from "./User.js";

const { Schema } = mongoose;

const expensesCategories = [
    "housing",
    "utilities",
    "groceries",
    "dining",
    "transport",
    "health",
    "shopping",
    "entertainment",
    "education",
    "debt",
    "travel",
    "insurance",
    "kids",
    "pets",
    "gifts",
    "subscriptions",
    "other"
]

const incomeCategories = [
    "salary",
    "freelance",
    "business",
    "bonus",
    "investment",
    "rental",
    "refund",
    "gift",
    "other"
]

const transactionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required."],
        trim: true,
        minlength: [3, "Title must be at least 3 characters."],
        maxlength: [20, "Title must be 20 characters or fewer."],
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    type: {
        type: String,
        enum: {
            values: ["expenses", "income"],
            message: "Type can be either expenses or income."
        },
        required: [true, "Type is required."],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required."],
        min: [0.01, "Amount must be at least 0.01."],
        max: [999999.99, "Amount must be a maximum of 999,999.99."],
        validate: {
            validator: (value) => {
                return Number.isInteger(value * 100);
            },
            message: "Amount can have at most two decimals places."
        }
    },
    date: {
        type: Date,
        default: Date.now,
        index: true,
    },
    category: {
        type: String,
        enum: {
            values: [...expensesCategories, ...incomeCategories],
            message: "Invalid category."
        },
        required: true,
    },
}, { timestamps: true })

transactionSchema.index({ ownerId: 1, date: -1 });
transactionSchema.index({ ownerId: 1, category: 1, date: -1 });
transactionSchema.index({ ownerId: 1, type: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);