import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <>
      <nav className="admin-header">
        <ul className="menu">
          <li>
            <Link to="/requests" className="nav-link">
              Requests
            </Link>
          </li>
          <li>
            <Link to="/updates" className="nav-link">
              Update
            </Link>
          </li>
          {user === "Ryan H" && (
            <li>
              <Link to="/deletions" className="nav-link">
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
