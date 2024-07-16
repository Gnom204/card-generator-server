import { Router } from "express";
import {
  createCard,
  createCardWithLang,
  deleteCard,
  getCards,
  getCardWithLang,
  getUserCards,
} from "../controllers/createCards";
import { generatePreview } from "../controllers/generateImg";

const cardRouter = Router();

cardRouter.post("/", createCardWithLang);
cardRouter.post("/cardId/:id", createCard);
cardRouter.post("/upload", generatePreview);
cardRouter.get("/public", getCards);
cardRouter.get("/lesson/:id", getCardWithLang);
cardRouter.delete("/delete/:id", deleteCard);
//Временно
cardRouter.get("/", getUserCards);

export default cardRouter;
