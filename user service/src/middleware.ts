import Jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IUser, User } from "./modal.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({
        message: "Not Authorized Pls Login",
      });
      return;
    }
    const decoded = Jwt.verify(
      token,
      process.env.JWT_SEC as string
    ) as JwtPayload;
    if (!decoded || !decoded._id) {
      res.status(403).json({
        message: "Invalid Token",
      });
      return;
    }
    const userId = decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(403).json({
        message: "User not Found",
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Not Authorized Pls Login",
    });
  }
};
