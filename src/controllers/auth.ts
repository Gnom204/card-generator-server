import { Request, Response } from "express";
import { User } from "../models/User";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const createUser = (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  bcrypt.hash(password, 10).then((hash: string) => {
    User.create({ name, email, password: hash })
      .then((user) => {
        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        res.status(200).json({ token, data: user, message: "User created" });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then((match: boolean) => {
        if (match) {
          const token = jwt.sign(
            {
              id: user._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
          );
          res
            .status(200)
            .json({ token, data: user, message: "Login successful" });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      });
    }
  });
};
