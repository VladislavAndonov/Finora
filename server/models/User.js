import mongoose from 'mongoose';
import bcrypt from "bcrypt"

const saltRounds = 10;
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    balance: { type: Number, default: 0 }
});

userSchema.pre("save", async function () {
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
});



export const User = mongoose.model("User", userSchema);