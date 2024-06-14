import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { createTodoApi } from "../utils/api.js";

function AddTodoModal({ setRefreshList }) {
  const [title, setTitle] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");

  const handleTodoSubmit = async () => {
    if (title === "" || todoDesc === "" || dueDate === "" || type === "") {
      toast("Title, Todo description, Due Date, and Type are required");
      return;
    }

    const result = await createTodoApi({
      title,
      desc: todoDesc,
      dueDate,
      type,
    });

    if (result.status === 200 && result.data.status === 200) {
      toast("Todo Added");
      setRefreshList(new Date());
      setTitle("");
      setTodoDesc("");
      setDueDate("");
      setType("");
    } else {
      toast(result.data.message);
    }
  };

  return (
    <div className="modal mt-5" id="exampleModal">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title">
              <span style={{ color: "#00008B", fontWeight: "bold" }}>
                Add New Todo{" "}
              </span>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span arial-hidden="true"></span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="form-group mt-2">
              <textarea
                name=""
                className="form-control"
                rows={3}
                value={todoDesc}
                onChange={(e) => setTodoDesc(e.target.value)}
                placeholder="Write todos.."
              ></textarea>
            </div>
            <div className="form-group mt-2">
              <input
                type="datetime-local"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Due Date"
              />
            </div>
            <div className="form-group mt-2">
              <select
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="personal">Personal</option>
                <option value="official">Official</option>
                <option value="hobby">Hobby</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={handleTodoSubmit}
              data-bs-dismiss="modal"
              style={{ backgroundColor: "#00008B", color: "white" }}
            >
              Save Todo
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setTitle("");
                setTodoDesc("");
                setDueDate("");
                setType("");
              }}
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTodoModal;
