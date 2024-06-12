import React, { useState } from "react";
import moment from "moment/moment";
import {
  deleteTodoApi,
  MarkTodoApi,
  EditTodoApi,
  patchTodoApi,
} from "../utils/api";
import { toast } from "react-toastify";
import "../styles.css";

function Todo({ todo, setRefreshList, editingTodoId, setEditingTodoId }) {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [newDesc, setNewDesc] = useState(todo.desc);
  const [newDueDate, setNewDueDate] = useState(
    moment(todo.dueDate).format("YYYY-MM-DDTHH:mm")
  );
  const [newType, setNewType] = useState(todo.type);

  const handleDelete = async () => {
    const result = await deleteTodoApi({ todo_id: todo._id });

    if (result.data.status === 200) {
      setRefreshList(new Date());
      toast("Todo Deleted Successfully");
    } else {
      toast("Failed to delete, please try again later");
    }
  };

  const handleMarkTodo = async () => {
    const result = await MarkTodoApi({ todo_id: todo._id });

    if (result.data.status === 200) {
      setRefreshList(new Date());
      toast(result.data.message);
    } else {
      toast("Failed to Mark, please try again later");
    }
  };

  const handleEdit = () => {
    setEditingTodoId(todo._id);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setNewTitle(todo.title);
    setNewDesc(todo.desc);
    setNewDueDate(moment(todo.dueDate).format("YYYY-MM-DDTHH:mm"));
    setNewType(todo.type);
  };

  const handleSaveEdit = async () => {
    const result = await patchTodoApi({
      todo_id: todo._id,
      title: newTitle,
      desc: newDesc,
      dueDate: newDueDate,
      type: newType,
      updated_at: new Date(),
    });

    if (result.data.status === 200) {
      setRefreshList(new Date());
      toast("Todo Updated Successfully");
      setEditingTodoId(null);
    } else {
      toast("Failed to update, please try again later");
    }
  };

  const isEditing = editingTodoId === todo._id;

  return (
    <div
      className={`todo-item col-sm-3 mx-3 my-2 alert bg-light ${
        isEditing ? "editing" : ""
      }`}
    >
      <div className="card-header">
        {todo.isCompleted ? "Completed" : "Not Completed"}
      </div>
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control mb-3"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              className="form-control mb-3"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description"
            ></textarea>
            <input
              type="datetime-local"
              className="form-control mb-3"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              placeholder="Due Date"
            />
            <select
              className="form-control mb-3"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="official">Official</option>
              <option value="hobby">Hobby</option>
            </select>
            <button className="btn btn-success me-2" onClick={handleSaveEdit}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h4
              className="card-title mb-3"
              style={{
                textDecoration: todo.isCompleted ? "line-through" : "none",
              }}
            >
              {todo.title}
            </h4>
            <p>{todo.desc}</p>
            <p className="due-date">
              Due: {moment(todo.dueDate).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <p style={{ fontWeight: "bold", color: "#708090" }}>
              Type: {todo.type}
            </p>
          </>
        )}
        <p className="card-text mb-2 bold-text">
          {moment(todo.date).fromNow()}
        </p>
        <p className="card-text mb-2 bold-text">
          Last updated: {moment(todo.updated_at).fromNow()}
        </p>
      </div>

      <div
        className="actionButtons"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="deleteButton">
          <button
            type="button"
            className="btn btn-primary mt-2"
            style={{ background: "#00008B", color: "white" }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        <div className="editButton">
          {!isEditing && !todo.isCompleted && (
            <button
              type="button"
              className="btn btn-sm btn-warning mt-2 me-2"
              onClick={handleEdit}
              style={{ backgroundColor: "#454545", color: "white" }}
            >
              Edit
            </button>
          )}
        </div>

        <div className="markTodo">
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleMarkTodo}
            style={{ background: " ", color: "#00008B" }}
          >
            {todo.isCompleted ? "Mark Uncomplete" : "Mark Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Todo;
