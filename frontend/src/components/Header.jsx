import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Logo from "../images/logo.png";

export default function Header() {
  const { isGuest, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="nav-bar">
        <div className="left-section">
          <img className="logo" src={Logo} alt="dice-logo" />
        </div>
        {isGuest ? (
          <p className="guest">Guest</p>
        ) : (
          <p className="user">{user}</p>
        )}
        <input
          type="checkbox"
          id="menu-toggle"
          className="menu-toggle"
          checked={menuOpen}
          onChange={() => setMenuOpen(!menuOpen)}
        />
        <label htmlFor="menu-toggle" className="menu-icon">
          &#9776;
        </label>
        <ul className="menu">
          <li>
            <Link to="/" className="nav-link" onClick={handleLinkClick}>
              Games
            </Link>
          </li>
          {!isGuest && (
            <li>
              <Link to="/add" className="nav-link" onClick={handleLinkClick}>
                Add
              </Link>
            </li>
          )}
          <li>
            <Link to="/register" className="nav-link" onClick={handleLinkClick}>
              Register
            </Link>
          </li>
          <li>
            <Link to="/login" className="nav-link" onClick={handleLinkClick}>
              {isGuest ? "Login" : "Logout"}
            </Link>
          </li>
          {user === "Ryan H" && (
            <li>
              <Link to="/admin" className="nav-link" onClick={handleLinkClick}>
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
