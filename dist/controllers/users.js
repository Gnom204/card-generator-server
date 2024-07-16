"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const User_1 = require("../models/User");
const getMe = (req, res) => {
    const { userId } = req.body;
    User_1.User.findById({ _id: userId })
        .then((user) => {
        console.log(user, userId);
        res.status(200).json(user);
    })
        .catch((err) => {
        res.status(500).json({ message: "Не удалось найти юзера", err });
    });
};
exports.getMe = getMe;
