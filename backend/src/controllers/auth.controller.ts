import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../services/Auth.service.js";
import { AppError } from "../utils/AppError.js";
import { createSendTokenAndCookie } from "../utils/createJwtTokenCookie.js";

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
    // TODO: error handling here
    console.log(error);
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

// export const forgotPassword = () => {};
