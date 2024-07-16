import { Request, Response } from "express";
import { User } from "../models/User";

export const getMe = (req: Request, res: Response) => {
  const { userId } = req.body;
  User.findById({ _id: userId })
    .then((user: any) => {
      console.log(user, userId);
      res.status(200).json(user);
    })
    .catch((err: any) => {
      res.status(500).json({ message: "Не удалось найти юзера", err });
    });
};
