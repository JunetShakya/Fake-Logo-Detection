'use client'

import "./NavComponent.css";

export const NavComponent = () => {
  return (
    <nav className="nav-container">
      <a href="/" className="nav-link">
        Home
      </a>
      {/* <div className="nav-right">
        <a href="../LoginForm" className="nav-link">
          Login
        </a>
        <a href="/register" className="nav-link">
          Register
        </a>
      </div> */}
    </nav>
  );
};
