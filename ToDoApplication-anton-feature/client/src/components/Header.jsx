import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

function Header({ searchText, setSearchText, filter, setFilter }) {
  const navigation = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigation("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Add search logic here if needed
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-header">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="https://img.icons8.com/?size=100&id=dclVGORmOZ3R&format=png&color=000000" // Replace with your logo URL
            alt="Logo"
            className="logo"
          />
          <span className="brand-text">Todo App</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor04"
          aria-controls="navbarColor04"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor04">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link home" to="/">
                Home
                <span className="visually-hidden">(current)</span>
              </Link>
            </li>
            {user ? (
              <li className="nav-item">
                <a className="nav-link logout-link" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          {user && (
            <form className="d-flex" onSubmit={handleSearchSubmit}>
              <select
                className="form-control filter-select me-sm-2 filter-select "
                style={{ maxWidth: "150px" }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="not-completed">Not Completed</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <input
                className="form-control me-sm-2"
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                className="btn btn-secondary my-2 my-sm-0 search-button"
                type="submit"
              >
                Search
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
