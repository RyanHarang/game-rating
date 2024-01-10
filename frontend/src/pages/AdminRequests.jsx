import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import RequestCard from "../components/RequestCard";
import AdminHeader from "../components/AdminHeader";
import axios from "axios";

export default function AdminRequests() {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [requests]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:4000/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  if (!isAdmin) {
    return <p>Only an admin can access this page</p>;
  }
  return (
    <>
      <AdminHeader />
      {requests.length > 0 ? (
        <div className="request-grid">
          {requests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </div>
      ) : (
        <p className="message">No requests to display</p>
      )}
    </>
  );
}
