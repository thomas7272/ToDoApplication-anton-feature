import { validationResult } from "express-validator";
import User from "../models/user.js";
import { JWT_TOKEN_SECRET, StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

// Function to generate JWT token
export const generateToken = (user) => {
  return Jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET, { expiresIn: "1h" });
};

// Login function to authenticate user and generate token
export const login = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { identifier, password } = req.body;

    // Find user by either username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "Username or password is incorrect"
        )
      );
    }

    const verified = bcrypt.compareSync(password, user.password);

    if (!verified) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "Username or password is incorrect"
        )
      );
    }

    const token = generateToken(user);

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Login Successful", {
        userId: user._id,
        token: token,
      })
    );
  }

  res.json(
    jsonGenerate(
      StatusCode.VALIDATION_ERROR,
      "Validation error",
      errors.mapped()
    )
  );
};

// Register function to create a new user and generate token
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { firstname, lastname, password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userExist = await User.findOne({
      $or: [{ email: email }, { lastname: lastname }],
    });

    if (userExist) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "User or Email already exist"
        )
      );
    }

    try {
      const result = await User.create({
        firstname: firstname,
        email: email,
        password: hashPassword,
        lastname: lastname,
      });

      const token = generateToken(result);

      res.json(
        jsonGenerate(StatusCode.SUCCESS, "Registration successful", {
          userId: result._id,
          token: token,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "Registration failed",
          error
        )
      );
    }
  }

  res.json(
    jsonGenerate(
      StatusCode.VALIDATION_ERROR,
      "Validation error",
      errors.mapped()
    )
  );
};
