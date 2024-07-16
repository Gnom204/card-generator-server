"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const User_1 = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createUser = (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    bcrypt.hash(password, 10).then((hash) => {
        User_1.User.create({ name, email, password: hash })
            .then((user) => {
            const token = jwt.sign({
                id: user._id,
            }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            res.status(200).json({ token, data: user, message: "User created" });
        })
            .catch((err) => {
            res.status(500).json({ message: err.message });
        });
    });
};
exports.createUser = createUser;
const loginUser = (req, res) => {
    const { email, password } = req.body;
    User_1.User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            bcrypt.compare(password, user.password).then((match) => {
                if (match) {
                    const token = jwt.sign({
                        id: user._id,
                    }, process.env.JWT_SECRET, {
                        expiresIn: "30d",
                    });
                    res
                        .status(200)
                        .json({ token, data: user, message: "Login successful" });
                }
                else {
                    res.status(401).json({ message: "Invalid password" });
                }
            });
        }
    });
};
exports.loginUser = loginUser;
