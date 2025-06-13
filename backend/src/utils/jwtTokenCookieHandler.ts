import { AppError } from "./AppError.js";
import { UserDocument } from "../models/user.model.js";
import { signJWT } from "./jwt.js";
import { Response } from "express";

if (!process?.env?.JWT_EXPIRES_IN_MS) {
  throw new AppError("Missing JWT EXPIRES IN MS environment variable", 500);
}
const JWTExpiryInMS = new Date(Date.now() + +process?.env?.JWT_EXPIRES_IN_MS);

const cookieOption = {
  expires: JWTExpiryInMS,
  httpOnly: true, // ✅ Prevent XSS attacks
  sameSite: true,
  secure: false,
};
if (process.env.NODE_ENV === "production") {
  cookieOption.secure = true;
}

export const createSendTokenAndCookie = (
  user: UserDocument,
  statusCode: number,
  res: Response
) => {
  let token = signJWT(user.id);

  res.cookie("jwt", token, cookieOption);

  return res
    .status(statusCode)
    .json({ status: "success", token, data: { user } });
};

export const expireJwtCookie = (res: Response) => {
  res.cookie("jwt", "", {
    ...cookieOption,
    expires: new Date(Date.now()), // expire now });
  });
};
