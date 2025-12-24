import { User } from "../models/User.js"
import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPass = (password) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            console.log(hash);
            // TODO: Store pass in DB.
        });
    });
};

const authService = {
    async register(username, email, password) {
        // Check if user exist

        hashPass(password);

        return User.create({ username, email, password });


    }
}


export default authService