import { AppError } from "../utils/AppError.js";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../utils/Types.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as authService from "../services/Auth.service.js";
import { Blacklist } from "../models/blacklist.model.js";
import { cryptoEncryption } from "../utils/encryptionHandler.utils.js";

export const protect = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.jwt ||
    (req.headers?.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  //   here what i want to do is to check if token doesnt exist or token is in blacklist throw error
  if (
    !token ||
    (await Blacklist.findOne({ token: cryptoEncryption("sha512", token) }))
  ) {
    res.status(401).json({ status: "fail", data: "unauthorized access" });
    return;
  }
  //   if (!token) {
  //     res.status(401).json({ status: "fail", data: "unauthorized access" });
  //     return;
  //   }
  //   if (await Blacklist.findOne({ token: cryptoEncryption("sha512", token) })) {
  //     res.status(401).json({ status: "fail", data: "blacklist token access" });
  //     return;
  //   }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authService.getMe((decodedToken as JwtPayload).id);

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: error.status,
        error: error.message,
      });
    }
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role!)) {
      throw new AppError(
        "You do not have the required permission to perform this action",
        403
      );
    }
    next();
  };
};
