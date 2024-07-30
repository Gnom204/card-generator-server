import { Request, Response } from "express";
import { CastomRequest } from "../types/CastomRequest";
import { CreateCardRequest } from "../types/CreateCardRequest";
import { Card } from "../models/Card";
import { User } from "../models/User";
import { Cards } from "../models/Cards";

export const createCardWithLang = (req: Request, res: Response) => {
  const { language, isPrivate, userId, lessonName, preview } = req.body;

  console.log(req.body);

  Cards.create({ language, isPrivate, lessonName, preview }).then((cards) => {
    User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { cardsWithLang: cards },
      }
    )
      .then((user) => {
        res.status(201).json({ user, message: "Массив карточек создан" });
      })
      .catch((err) => {
        console.log("its lang");
        res.status(500).json({ message: "Такого пользователя нет" });
      });
  });
};

export const deleteCard = (req: Request, res: Response) => {
  const cardId = req.params.id;
  const { userId } = req.body;
  User.findOneAndUpdate(
    { _id: userId },
    { $pull: { cardsWithLang: cardId } },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        throw new Error("Такой карточки нет");
      }
      return Promise.all(
        user.cardsWithLang.map((card) =>
          Cards.findById(card).then((card) => card?.toObject())
        )
      );
    })
    .then((cardsWithLang) => {
      res.status(200).json({ message: "Карточка удалена", cardsWithLang });
    })
    .catch((err) => {
      res.status(500).json({ message: "Такой карточки нет" });
    });
};
export const createCard = (
  req: Request,
  //   req: CastomRequest<CreateCardRequest>,
  res: Response
) => {
  const { name, image, translate } = req.body;

  const cardsId = req.params.id;

  const newCard = new Card({ name, image, translate });
  newCard.save();
  Cards.findOneAndUpdate(
    { _id: cardsId },
    {
      $push: { cards: newCard },
    },
    { new: true }
  )
    .then((user) => {
      res.status(201).json({ user, message: "Карта добавлена" });
    })
    .catch((err) => {
      console.log("its card");

      res.status(500).json({ message: "Такого пользователя нет" });
    });
};

export const getCardWithLang = (req: Request, res: Response) => {
  const cardId = req.params.id;
  Cards.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new Error("Такой карточки нет");
      }
      const cards = Promise.all(card.cards.map((card) => Card.findById(card)));
      cards.then((cards) => {
        res.status(200).json({ cards });
      });
      console.log({ cards, card: card.cards });
    })
    .catch((err) => {
      res.status(500).json({ message: "Не удалось найти карточку", err });
    });
};

export const getUserCards = (req: Request, res: Response) => {
  const { userId } = req.body;

  User.findOne({ _id: userId })
    .then(async (user) => {
      if (!user) {
        throw new Error("Такого пользователя нет");
      }
      const cardsWithLang = await Promise.all(
        user.cardsWithLang.map((card) => Cards.findById(card))
      );
      res.status(200).json({ cardsWithLang });
    })
    .catch((err) => {
      res.status(500).json({ message: "Не удалось найти юзера", err });
    });
};

export const getCards = (req: Request, res: Response) => {
  Cards.find({ isPrivate: false })
    .then((cards) => {
      res.status(200).json({ cards });
    })
    .catch((err) => {
      res.status(500).json({ message: "Не удалось найти карточки", err });
    });
};
