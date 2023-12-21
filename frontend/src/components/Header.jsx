import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Logo from "../../public/logo.png";

export default function Header() {
  const { logout, isGuest } = useAuth();
  return (
    <nav className="nav-bar">
      <img className="logo" src={Logo} alt="dice-logo" />
      <ul>
        <li>
          <Link to="/list" className="nav-link">
            Games
          </Link>
        </li>
        {!isGuest && (
          <li>
            <Link to="/add" className="nav-link">
              Add Games
            </Link>
          </li>
        )}
        {!isGuest && (
          <li>
            <Link to="/rating" className="nav-link">
              Rating
            </Link>
          </li>
        )}
        <li>
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
        <li>
          <Link to="/" className="nav-link" onClick={() => logout()}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
