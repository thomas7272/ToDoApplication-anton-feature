import React, { useState } from "react";
import { register } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles.css";
import Header from "./Header.jsx";
import { StatusCode } from "../utils/constants.js";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front-end validation
    let validationErrors = {};
    if (!form.firstname) {
      validationErrors.firstname = "First name is required";
    }
    if (!form.lastname) {
      validationErrors.lastname = "Last name is required";
    }
    if (!form.email) {
      validationErrors.email = "Email is required";
    }
    if (!form.password) {
      validationErrors.password = "Password is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await register(form);
      setErrors({});

      if (result.status === 200) {
        const data = result.data;

        if (data.status === StatusCode.SUCCESS) {
          localStorage.setItem("user", JSON.stringify(data.data));
          navigate("/");
        } else if (data.status === StatusCode.VALIDATION_ERROR) {
          setErrors(data.data);
        } else if (data.status === StatusCode.UNPROCESSABLE_ENTITY) {
          toast(data.message);
        } else {
          toast("Unexpected error occurred");
        }
      } else {
        toast("Unexpected error occurred");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <Header />
      <div className="container zoom-out">
        <ToastContainer />
        <div className="row justify-content-center mt-4">
          <div className="col-lg-5 card border-primary mt-4">
            <div className="card-header header-title">
              <div className="header-container">
                <span>Task Management Tool</span>
                <img
                  src="https://img.icons8.com/?size=100&id=dclVGORmOZ3R&format=png&color=000000"
                  alt="Logo"
                  className="logo"
                />
              </div>
            </div>

            <div className="card-body">
              <h4
                className="card-title card-title-custom"
                style={{ color: "#00008b" }}
              >
                Register Now
              </h4>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="firstname" className="form-label mt-4">
                    First Name
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="firstname"
                    className="form-control"
                    id="firstname"
                    placeholder="Enter First Name"
                  />
                  {errors.firstname && (
                    <small className="form-text text-danger">
                      {errors.firstname}
                    </small>
                  )}
                </div>
                <div>
                  <label htmlFor="lastname" className="form-label mt-4">
                    Last Name
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="lastname"
                    className="form-control"
                    id="lastname"
                    placeholder="Enter Last Name"
                  />
                  {errors.lastname && (
                    <small className="form-text text-danger">
                      {errors.lastname}
                    </small>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="form-label mt-4">
                    Email
                  </label>
                  <input
                    type="email"
                    onChange={handleChange}
                    name="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Email"
                  />
                  {errors.email && (
                    <small className="form-text text-danger">
                      {errors.email}
                    </small>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="form-label mt-4">
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={handleChange}
                    name="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter Password"
                  />
                  {errors.password && (
                    <small className="form-text text-danger">
                      {errors.password}
                    </small>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-4 btn-custom"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
