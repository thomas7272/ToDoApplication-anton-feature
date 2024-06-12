import Jwt from "jsonwebtoken";
import { JWT_TOKEN_SECRET, StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["auth"];

  if (!authHeader) {
    return res.json(jsonGenerate(StatusCode.AUTH_ERROR, "Access Denied"));
  }

  try {
    const decoded = Jwt.verify(authHeader, JWT_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Invalid Token")
    );
  }
};

export default AuthMiddleware;
