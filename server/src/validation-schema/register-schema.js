import { body } from "express-validator";

export const RegisterSchema = [
  body("firstname").notEmpty().withMessage("First name is required"),
  body("lastname")
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must contain only alphabets"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
