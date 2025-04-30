import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.js";
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
// );

// router.post(
//   "forgot-password",
//   body("email").isEmail().withMessage("Please enter a valid email address.")
// );

export { router };
