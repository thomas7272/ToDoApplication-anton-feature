import { validationResult } from "express-validator";
import Todo from "../models/Todo.js";
import User from "../models/user.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

export const createTodo = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "Todo title, description, due date, and type are required",
        error.mapped()
      )
    );
  }

  try {
    const result = await Todo.create({
      userId: req.userId,
      title: req.body.title,
      desc: req.body.desc,
      dueDate: req.body.dueDate,
      type: req.body.type,
    });

    if (result) {
      await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { todos: result },
        }
      );
      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Todo created Successfully", result)
      );
    }
  } catch (error) {
    return res.json(
      jsonGenerate(
        StatusCode.UNPROCESSABLE_ENTITY,
        "Something went wrong",
        error
      )
    );
  }
};

export const updateTodo = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "Todo id, title, description, due date, and type are required",
        error.mapped()
      )
    );
  }

  try {
    const { todo_id, title, desc, dueDate, type } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: todo_id, userId: req.userId },
      { title, desc, dueDate, type, updated_at: new Date() },
      { new: true }
    );

    if (!todo) {
      return res.json(
        jsonGenerate(
          StatusCode.NOT_FOUND,
          "Todo not found or you don't have permission to update this todo"
        )
      );
    }

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Todo updated successfully", todo)
    );
  } catch (error) {
    return res.json(
      jsonGenerate(
        StatusCode.UNPROCESSABLE_ENTITY,
        "Something went wrong",
        error
      )
    );
  }
};

export const patchTodo = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(StatusCode.VALIDATION_ERROR, "Invalid input", error.mapped())
    );
  }

  try {
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.desc) updateData.desc = req.body.desc;
    if (req.body.dueDate) updateData.dueDate = req.body.dueDate;
    if (req.body.type) updateData.type = req.body.type;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.body.todo_id, userId: req.userId },
      { ...updateData, updated_at: new Date() },
      { new: true }
    );

    if (!todo) {
      return res.json(
        jsonGenerate(
          StatusCode.NOT_FOUND,
          "Todo not found or you don't have permission to update this todo"
        )
      );
    }

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Todo updated successfully", todo)
    );
  } catch (error) {
    return res.json(
      jsonGenerate(
        StatusCode.UNPROCESSABLE_ENTITY,
        "Something went wrong",
        error
      )
    );
  }
};

export const GetTodos = async (req, res) => {
  try {
    const list = await User.findById(req.userId)
      .select("-password")
      .populate("todos")
      .exec();

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All todo lists", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};

export const MarkTodo = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "todo id is required",
        error.mapped()
      )
    );
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.body.todo_id,
        userId: req.userId,
      },
      [
        {
          $set: {
            isCompleted: {
              $eq: [false, "$isCompleted"],
            },
          },
        },
      ]
    );

    if (todo) {
      return res.json(jsonGenerate(StatusCode.SUCCESS, "Todo updated", todo));
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not update", null)
    );
  }
};

export const RemoveTodo = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "todo id is required",
        error.mapped()
      )
    );
  }

  try {
    const result = await Todo.findOneAndDelete({
      userId: req.userId,
      _id: req.body.todo_id,
    });

    if (result) {
      await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { todos: req.body.todo_id } }
      );

      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Todo is deleted", null)
      );
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not delete", null)
    );
  }
};
