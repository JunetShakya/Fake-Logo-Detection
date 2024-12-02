import React, { useState } from "react";
import "./RegistrationForm.css";
import { TfiUser } from "react-icons/tfi"; 
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordFill } from "react-icons/ri"; 
import { MdPhone } from "react-icons/md"; 
import { BiMaleFemale } from "react-icons/bi";
import { FaHouse } from "react-icons/fa6";

export const RegistrationComponent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(""); 
  const [address, setAddress] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [error, setError] = useState(""); 

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !gender || !address || !phone) {
      setError("Please fill in all fields.");
    } else {
      setError("");
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Gender:", gender);
      console.log("Address:", address);
      console.log("Phone:", phone);
      // Here you can add your registration logic (API call, etc.)
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleFormSubmit}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>} {/* Error Message */}
        <div className="form-group">
          <label>
            <TfiUser /> Username:
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <TfiEmail /> Email:
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <RiLockPasswordFill /> Password:
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <BiMaleFemale />
            Gender:
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <FaHouse />
            Address:
          </label>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <MdPhone /> Phone:
          </label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Register
        </button>
      </form>
    </div>
  );
};
