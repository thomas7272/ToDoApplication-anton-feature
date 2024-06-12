import { check, body } from "express-validator";

export const LoginSchema = [
  check("identifier", "Username or email is required")
    .exists()
    .trim()
    .custom((value, { req }) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9]{6,32}$/.test(value);
      if (!isEmail && !isUsername) {
        throw new Error(
          "Must be a valid email with 6-32 alphanumeric characters"
        );
      }
      return true;
    }),

  check("password", "Password is required")
    .exists()
    .isLength({ min: 6, max: 100 })
    .trim(),
];
