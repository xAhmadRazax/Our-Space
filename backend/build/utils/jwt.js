import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";
export const signJWT = (id) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    if (!secret || !expiresIn) {
        throw new AppError("JWT secret or expiration environment variables is missing", 500);
    }
    return jwt.sign({ id }, secret, {
        expiresIn: expiresIn,
    });
};
