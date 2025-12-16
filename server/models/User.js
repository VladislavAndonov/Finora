import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    balance: { type: Number, default: 0 }
})

export const User = mongoose.model("User", userSchema);