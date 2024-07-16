"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const jwt = require("jsonwebtoken");
const authCheck = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    console.log(token);
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.body.userId = decoded.id;
            next();
        }
        catch (err) {
            res.status(403).json({ message: "Invalid token" });
        }
    }
    else {
        res.status(403).json({ message: "Нет доступа" });
    }
};
exports.authCheck = authCheck;
