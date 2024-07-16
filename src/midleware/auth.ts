import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");
export const authCheck = (
  req: Request<{}, {}, { userId: string }, {}>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.body.userId = decoded.id;
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid token" });
    }
  } else {
    res.status(403).json({ message: "Нет доступа" });
  }
};
