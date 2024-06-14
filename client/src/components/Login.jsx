import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import { login } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles.css";
import { StatusCode } from "../utils/constants.js";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    // Front-end validation
    let validationErrors = {};
    if (!form.identifier) {
      validationErrors.identifier = "Email is required";
    }
    if (!form.password) {
      validationErrors.password = "Password is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await login(form);
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
      console.error("Error during login:", error);
      toast(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <Header />
      <div className="container">
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
                Login Now
              </h4>
              <div>
                <label htmlFor="identifier" className="form-label mt-4">
                  Email
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="identifier"
                  className="form-control"
                  id="identifier"
                  placeholder="Enter email or Username"
                />
                {errors.identifier && (
                  <small className="form-text text-danger">
                    {errors.identifier}
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
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary mt-4 btn-custom"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
