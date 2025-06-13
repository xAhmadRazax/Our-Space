import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../services/Auth.service.js";
import { AppError } from "../utils/AppError.js";
import {
  createSendTokenAndCookie,
  expireJwtCookie,
} from "../utils/jwtTokenCookieHandler.js";
import { UserRequest } from "../utils/Types.js";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationErrors = validationResult(req);
  if (validationErrors.array().length > 0) {
    res.status(400).json({
      status: "fail",
      error: validationErrors.array(),
    });
    return;
  }
  const { name, email, password } = req.body;

  try {
    const user = await authService.signup({ name, email, password });

    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: error.status,
        error: error.message,
      });
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationErrors = validationResult(req);
  if (validationErrors.array().length > 0) {
    res.status(400).json({
      status: "fail",
      errors: validationErrors.array(),
    });
    return;
  }
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    createSendTokenAndCookie(user, 200, res);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: error.status,
        error: error.message,
      });
    }
  }
};

export const logout = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.jwt ||
      (req.headers?.authorization?.startsWith("Bearer")
        ? req.headers?.authorization?.split(" ")[1]
        : null);

    console.log(token, req.cookies);

    if (token) {
      await authService.logout(token);
      expireJwtCookie(res);
    }
    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: error.status,
        error: error.message,
      });
    }
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationErrors = validationResult(req);
  if (validationErrors.array().length > 0) {
    res.status(400).json({
      status: "fail",
      errors: validationErrors.array(),
    });
    return;
  }

  try {
    const { email } = req.body;
    await authService.forgotPassword(email, `${req.protocol}://${req.host}`);
    res.status(200).json({
      status: "success",
      data: "If the email exists in our system, you will receive a password reset token shortly.",
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: error.status,
        error: error.message,
      });
    }
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationErrors = validationResult(req);
  if (validationErrors.array().length > 0) {
    res.status(400).json({
      status: "fail",
      errors: validationErrors.array(),
    });
    return;
  }

  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    res
      .status(200)
      .json({ status: "success", data: "Password changed successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: error.status,
        error: error.message,
      });
    }
  }
};

export const getMe = async (req: UserRequest, res: Response) => {
  res.status(200).json({ status: "success", data: req.user });
};
