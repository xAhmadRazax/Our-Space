import { AppError } from "./AppError.js";
import { signJWT } from "../utils/jwt.js";
export const createSendTokenAndCookie = (user, statusCode, res) => {
    let token = signJWT(user.id);
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
    res.cookie("jwt", token, cookieOption);
    return res
        .status(statusCode)
        .json({ status: "success", token, data: { user } });
};
