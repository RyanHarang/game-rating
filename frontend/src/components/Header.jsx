import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Logo from "../../public/logo.png";

export default function Header() {
  const { logout, isGuest, user } = useAuth();
  return (
    <nav className="nav-bar">
      <img className="logo" src={Logo} alt="dice-logo" />
      {isGuest ? <p className="user">Guest</p> : <p className="user">{user}</p>}
      {/* <div className="menu-icon">&#9776;</div> */}
      <ul>
        <li>
          <Link to="/list" className="nav-link">
            Games
          </Link>
        </li>
        {!isGuest && (
          <li>
            <Link to="/add" className="nav-link">
              Add
            </Link>
          </li>
        )}
        {!isGuest && (
          <li>
            <Link to="/rating" className="nav-link">
              Rate
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
