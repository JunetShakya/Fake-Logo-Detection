'use client'

import React, { useState } from "react";
import "./LoginForm.css";
// import { TfiEmail } from "react-icons/tfi";
// import { RiLockPasswordFill } from "react-icons/ri";

const FormComponent = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Adding error state

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
    } else {
      setError("");
      console.log(email);
      console.log(password);
    }
  };

  const handleFormEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleFormPassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className="login-container">
        <form className="login-form" onSubmit={handleFormSubmit}>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>} {/* Error Message */}
          <div className="form-group">
            {/* <label>
              <TfiEmail /> Email:
            </label> */}
            <input
              type="email"
              placeholder="email"
              onChange={handleFormEmail}
            ></input>
          </div>
          <div className="form-group">
            {/* <label>
              <RiLockPasswordFill /> Password:
            </label> */}
            <input
              type="password"
              placeholder="password"
              onChange={handleFormPassword}
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default FormComponent