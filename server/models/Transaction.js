import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema({
    title: { type: String, required: true },
    ownerId: mongoose.Schema.Types.ObjectId,
    type: { type: String, enum: ["expenses", "income"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: String,
})

export const Transaction = mongoose.model("Transaction", transactionSchema);