import mongoose from "mongoose";

import { User } from "./User.js";

const { Schema } = mongoose;

const categoriesList = [
    // Housing
    "Rent",
    "Home Maintenance",
    "Bills & Utilities",

    // Food
    "Groceries",
    "Dining Out",

    // Transport
    "Fuel",
    "Public Transport",
    "Auto Maintenance",

    // Lifestyle
    "Shopping",
    "Entertainment",
    "Personal Care",
    "Pets",
    "Travel",

    // Health
    "Medical",
    "Fitness",

    // Financial
    "Insurance",
    "Taxes",
    "Savings & Investments",
    "Loan Repayment",
    "Bank Fees",

    // Income
    "Salary",
    "Side Income",
    "Refunds",
    "Bonuses & Gifts",

    // Other
    "Transfer",
    "Uncategorized"
];

const transactionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required."],
        trim: true,
        maxlength: [30, "Title must be 30 characters or fewer."],
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
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
    },
    category: {
        type: String,
        enum: {
            values: categoriesList,
            message: "Invalid category."
        },
        required: true,
    },
    note: {
        type: String,
        maxlength: [200, "Note is too long"],
        trim: true
    },
    isOpeningBalance: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

transactionSchema.index({ accountId: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);