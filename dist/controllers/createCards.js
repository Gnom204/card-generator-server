"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCards = exports.getUserCards = exports.getCardWithLang = exports.createCard = exports.deleteCard = exports.createCardWithLang = void 0;
const Card_1 = require("../models/Card");
const User_1 = require("../models/User");
const Cards_1 = require("../models/Cards");
const createCardWithLang = (req, res) => {
    const { language, isPrivate, userId, lessonName, preview } = req.body;
    console.log(req.body);
    Cards_1.Cards.create({ language, isPrivate, lessonName, preview }).then((cards) => {
        User_1.User.findOneAndUpdate({ _id: userId }, {
            $push: { cardsWithLang: cards },
        })
            .then((user) => {
            res.status(201).json({ user, message: "Массив карточек создан" });
        })
            .catch((err) => {
            console.log("its lang");
            res.status(500).json({ message: "Такого пользователя нет" });
        });
    });
};
exports.createCardWithLang = createCardWithLang;
const deleteCard = (req, res) => {
    const cardId = req.params.id;
    const { userId } = req.body;
    User_1.User.findOneAndUpdate({ _id: userId }, { $pull: { cardsWithLang: cardId } }, { new: true })
        .then((user) => {
        if (!user) {
            throw new Error("Такой карточки нет");
        }
        return Promise.all(user.cardsWithLang.map((card) => Cards_1.Cards.findById(card).then((card) => card.toObject())));
    })
        .then((cardsWithLang) => {
        res.status(200).json({ message: "Карточка удалена", cardsWithLang });
    })
        .catch((err) => {
        res.status(500).json({ message: "Такой карточки нет" });
    });
};
exports.deleteCard = deleteCard;
const createCard = (req, 
//   req: CastomRequest<CreateCardRequest>,
res) => {
    const { name, image, translate } = req.body;
    const cardsId = req.params.id;
    const newCard = new Card_1.Card({ name, image, translate });
    newCard.save();
    Cards_1.Cards.findOneAndUpdate({ _id: cardsId }, {
        $push: { cards: newCard },
    }, { new: true })
        .then((user) => {
        res.status(201).json({ user, message: "Карта добавлена" });
    })
        .catch((err) => {
        console.log("its card");
        res.status(500).json({ message: "Такого пользователя нет" });
    });
};
exports.createCard = createCard;
const getCardWithLang = (req, res) => {
    const cardId = req.params.id;
    Cards_1.Cards.findById(cardId)
        .then((card) => {
        if (!card) {
            throw new Error("Такой карточки нет");
        }
        const cards = Promise.all(card.cards.map((card) => Card_1.Card.findById(card)));
        cards.then((cards) => {
            res.status(200).json({ cards });
        });
        console.log({ cards, card: card.cards });
    })
        .catch((err) => {
        res.status(500).json({ message: "Не удалось найти карточку", err });
    });
};
exports.getCardWithLang = getCardWithLang;
const getUserCards = (req, res) => {
    const { userId } = req.body;
    User_1.User.findOne({ _id: userId })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error("Такого пользователя нет");
        }
        const cardsWithLang = yield Promise.all(user.cardsWithLang.map((card) => Cards_1.Cards.findById(card)));
        res.status(200).json({ cardsWithLang });
    }))
        .catch((err) => {
        res.status(500).json({ message: "Не удалось найти юзера", err });
    });
};
exports.getUserCards = getUserCards;
const getCards = (req, res) => {
    Cards_1.Cards.find({ isPrivate: false })
        .then((cards) => {
        res.status(200).json({ cards });
    })
        .catch((err) => {
        res.status(500).json({ message: "Не удалось найти карточки", err });
    });
};
exports.getCards = getCards;
