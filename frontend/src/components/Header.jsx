import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";

export default function Header() {
  return (
    <nav className="nav-bar">
      <img className="logo" src={Logo}></img>
      <ul>
        <li>
          <Link to="/" className="link">
            Home
          </Link>
        </li>
        <li>
          <Link to="rating" className="link">
            Rating
          </Link>
        </li>
        <li>
          <Link to="register" className="link">
            Register
          </Link>
        </li>
        <li>
          <Link to="login" className="link">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
