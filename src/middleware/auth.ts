import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET as string;

  if (!token) {
    return res.json({ msg: "Token not available" });
  }

  try {
    const verifyingToken = jwt.verify(token, secret) as JwtPayload;
    console.log(verifyingToken);

    if (!verifyingToken) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.userId = verifyingToken.id as string;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};