"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const cardRouter_1 = __importDefault(require("./routes/cardRouter"));
const auth_1 = require("./midleware/auth");
const path_1 = __importDefault(require("path"));
const cors = require("cors");
dotenv_1.default.config();
const { PORT } = process.env || 4000;
const app = (0, express_1.default)();
//MIDLEWARES
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "uploads")));
//ROUTES
app.use("/api/auth", authRouter_1.default);
app.use("/api/cards", auth_1.authCheck, cardRouter_1.default);
mongoose_1.default.connect("mongodb://localhost:27017/generate-cards").then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
