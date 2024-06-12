import React, { useEffect, useState } from "react";
import { getToken } from "../utils/api.js";
import Header from "./Header.jsx";
import Todo from "./Todo.jsx";
import AddTodoModal from "./AddTodoModal.jsx";
import { useNavigate } from "react-router-dom";
import { getTodoListApi } from "../utils/api.js";
import { ToastContainer, toast } from "react-toastify";
import "../styles.css";

function Home() {
  const navigation = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("all");

  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [refreshList, setRefreshList] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      navigation("/login");
    }
    fetchTodoList();
  }, [navigation, refreshList]);

  useEffect(() => {
    let filtered = list;

    if (filter === "not-completed") {
      filtered = list.filter((todo) => !todo.isCompleted);
    } else if (filter === "completed") {
      filtered = list.filter((todo) => todo.isCompleted);
    } else if (filter === "overdue") {
      const currentDate = new Date();
      filtered = list.filter(
        (todo) => new Date(todo.dueDate) < currentDate && !todo.isCompleted
      );
    }

    if (searchText !== "") {
      filtered = filtered.filter((todo) =>
        todo.desc.toLowerCase().includes(searchText.toLowerCase().trim())
      );
    }

    setFilteredList(filtered);
  }, [list, searchText, filter]);

  async function fetchTodoList() {
    const result = await getTodoListApi();
    console.log("todolist", result);
    if (result.status === 200 && result.data.status === 200) {
      setList(result.data.data.todos.reverse());
    }
  }

  return (
    <div className="home-container">
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
        filter={filter}
        setFilter={setFilter}
      />
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-md-center mt-4">
          <h1
            className="text-center mb-4"
            style={{ color: "", fontWeight: "bold" }}
          >
            My Todo List
          </h1>
          {filteredList.map((todo) => (
            <Todo
              todo={todo}
              key={todo._id}
              setRefreshList={setRefreshList}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
            />
          ))}
          {filteredList.length === 0 && (
            <div className="notFoundTodos">No Todos Found</div>
          )}
        </div>
      </div>
      <div style={{ position: "fixed", right: 50, bottom: 50, zIndex: 1030 }}>
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn btn-outline-light"
          style={{ backgroundColor: "#00008B", color: "white" }}
        >
          Add Todo
        </button>
      </div>
      <AddTodoModal setRefreshList={setRefreshList} />
    </div>
  );
}

export default Home;
