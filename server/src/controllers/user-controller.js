import { validationResult } from "express-validator";
import User from "../models/User.js";
import { JWT_TOKEN_SECRET, StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  console.log("Login request received:", req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.mapped());
    return res
      .status(StatusCode.VALIDATION_ERROR)
      .json(
        jsonGenerate(
          StatusCode.VALIDATION_ERROR,
          "Validation error",
          errors.mapped()
        )
      );
  }

  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      console.log("User not found");
      return res
        .status(StatusCode.UNPROCESSABLE_ENTITY)
        .json(
          jsonGenerate(
            StatusCode.UNPROCESSABLE_ENTITY,
            "Username or password is incorrect"
          )
        );
    }

    const verified = bcrypt.compareSync(password, user.password);

    if (!verified) {
      console.log("Password incorrect");
      return res
        .status(StatusCode.UNPROCESSABLE_ENTITY)
        .json(
          jsonGenerate(
            StatusCode.UNPROCESSABLE_ENTITY,
            "Username or password is incorrect"
          )
        );
    }

    const token = Jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET);

    return res.status(StatusCode.SUCCESS).json(
      jsonGenerate(StatusCode.SUCCESS, "Login Successful", {
        userId: user._id,
        token: token,
      })
    );
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json(
        jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, "Internal server error")
      );
  }
};

export const Register = async (req, res) => {
  console.log("Register request received:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.mapped());
    return res
      .status(StatusCode.VALIDATION_ERROR)
      .json(
        jsonGenerate(
          StatusCode.VALIDATION_ERROR,
          "Validation error",
          errors.mapped()
        )
      );
  }

  const { firstname, lastname, password, email } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userExist = await User.findOne({
      $or: [{ email: email }, { lastname: lastname }],
    });

    if (userExist) {
      console.log("User already exists");
      return res
        .status(StatusCode.UNPROCESSABLE_ENTITY)
        .json(
          jsonGenerate(
            StatusCode.UNPROCESSABLE_ENTITY,
            "User or Email already exist"
          )
        );
    }

    const result = await User.create({
      firstname: firstname,
      email: email,
      password: hashPassword,
      lastname: lastname,
    });

    const token = Jwt.sign({ userId: result._id }, JWT_TOKEN_SECRET);

    return res.status(StatusCode.SUCCESS).json(
      jsonGenerate(StatusCode.SUCCESS, "Registration successful", {
        userId: result._id,
        token: token,
      })
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json(
        jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, "Internal server error")
      );
  }
};
