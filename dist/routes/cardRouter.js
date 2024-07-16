"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createCards_1 = require("../controllers/createCards");
const generateImg_1 = require("../controllers/generateImg");
const cardRouter = (0, express_1.Router)();
cardRouter.post("/", createCards_1.createCardWithLang);
cardRouter.post("/cardId/:id", createCards_1.createCard);
cardRouter.post("/upload", generateImg_1.generatePreview);
cardRouter.get("/public", createCards_1.getCards);
cardRouter.get("/lesson/:id", createCards_1.getCardWithLang);
cardRouter.delete("/delete/:id", createCards_1.deleteCard);
//Временно
cardRouter.get("/", createCards_1.getUserCards);
exports.default = cardRouter;
