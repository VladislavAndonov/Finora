import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema({
    title: String,
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    amount: Number,
    date: Date,
    category: String,
})

export const Transaction = mongoose.model("Transaction", transactionSchema)