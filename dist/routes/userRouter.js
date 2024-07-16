"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const auth_1 = require("../midleware/auth");
const userRouter = require("express").Router();
userRouter.get("/me", auth_1.authCheck, users_1.getMe);
exports.default = userRouter;
