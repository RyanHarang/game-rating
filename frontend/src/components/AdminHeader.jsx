import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <>
      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="/requests" className="admin-link">
              Requests
            </Link>
          </li>
          <li>
            <Link to="/updates" className="admin-link">
              Update
            </Link>
          </li>
          {user === "Ryan H" && (
            <li>
              <Link to="/deletions" className="admin-link">
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
