import express from "express";
import { check } from "express-validator";
import { Login, Register } from "../controllers/user-controller.js";
import {
  createTodo,
  GetTodos,
  MarkTodo,
  RemoveTodo,
  updateTodo,
  patchTodo,
} from "../controllers/todo-controller.js";
import { LoginSchema } from "../validation-schema/login-schema.js";
import { RegisterSchema } from "../validation-schema/register-schema.js";

const apiRoute = express.Router();
export const apiProtected = express.Router();

apiRoute.post("/register", RegisterSchema, Register);
apiRoute.post("/login", LoginSchema, Login);

// protected routes;

apiProtected.post(
  "/createTodo",
  [
    check("title", "Todo title is required").exists(),
    check("desc", "Todo desc is required").exists(),
    check("dueDate", "Due date is required").exists().isISO8601().toDate(),
    check(
      "type",
      "Type is required and should be either personal, hobby, or official"
    )
      .exists()
      .isIn(["personal", "hobby", "official"]),
  ],
  createTodo
);

apiProtected.post(
  "/marktodo",
  [check("todo_id", "Todo id is required").exists()],
  MarkTodo
);

apiProtected.post(
  "/deleteTodo",
  [check("todo_id", "Todo id is required").exists()],
  RemoveTodo
);

apiProtected.post(
  "/updateTodo",
  [
    check("todo_id", "Todo id is required").exists(),
    check("title", "Todo title is required").exists(),
    check("desc", "Todo desc is required").exists(),
    check("dueDate", "Due date is required").exists().isISO8601().toDate(),
    check(
      "type",
      "Type is required and should be either personal, hobby, or official"
    )
      .exists()
      .isIn(["personal", "hobby", "official"]),
  ],
  updateTodo
);

apiProtected.patch(
  "/patchTodo",
  [
    check("todo_id", "Todo id is required").exists(),
    check("title").optional().isString(),
    check("desc").optional().isString(),
    check("dueDate").optional().isISO8601().toDate(),
    check("type").optional().isIn(["personal", "hobby", "official"]),
  ],
  patchTodo
);

apiProtected.get("/todolist", GetTodos);

export default apiRoute;
