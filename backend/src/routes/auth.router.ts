import { Router } from "express";
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
const router = Router();

router.post(
  "/signup",
  body("name").notEmpty().withMessage("Name is required."),

  body("email").isEmail().withMessage("Please enter a valid email address."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  signup
);
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email address."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  login
);

router.post(
  "/forgotPassword",
  body("email").isEmail().withMessage("Please enter a valid email address."),
  forgotPassword
);

router.get("/logout", logout);
router.post(
  "/resetPassword/:token",
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  resetPassword
);

router.get("/me", protect, getMe);
export { router };
