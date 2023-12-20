import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Logo from "../assets/images/logo.png";

export default function Header() {
  const { logout, isGuest } = useAuth();
  return (
    <nav className="nav-bar">
      <img className="logo" src={Logo}></img>
      <ul>
        <li>
          <Link to="list" className="link">
            Games
          </Link>
        </li>
        {!isGuest && (
          <li>
            <Link to="add" className="link">
              Add Games
            </Link>
          </li>
        )}
        {!isGuest && (
          <li>
            <Link to="rating" className="link">
              Rating
            </Link>
          </li>
        )}
        <li>
          <Link to="register" className="link">
            Register
          </Link>
        </li>
        <li>
          <Link to="/" className="link" onClick={() => logout()}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
