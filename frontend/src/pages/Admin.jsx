import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import RequestCard from "../components/RequestCard";
import axios from "axios";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [gamesList, setGamesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user === "Ryan H") {
      fetchUsersAndGames();
    }
    if (isAdmin) {
      fetchRequests();
    }
  }, [requests]);

  const fetchUsersAndGames = async () => {
    try {
      const usersResponse = await axios.get(
        "http://localhost:4000/users/all-users"
      );
      const gamesResponse = await axios.get("http://localhost:4000/games");
      setUsersList(usersResponse.data);
      setGamesList(gamesResponse.data);
    } catch (error) {
      console.error("Error fetching users and games:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:4000/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleUserDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:4000/users/${selectedUser}`
      );
      setMessage(response.data);
      console.log(`User ${selectedUser} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleGameDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:4000/games/${selectedGame}`
      );
      setMessage(response.data);
      console.log(`Game ${selectedGame} deleted successfully`);
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  if (!isAdmin) {
    return <p>Only an admin can access this page</p>;
  }
  return (
    <>
      <div className="request-grid">
        {requests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
      <div className="deletion">
        <form onSubmit={handleUserDelete}>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="field dropdown"
          >
            <option value="">Select User</option>
            {usersList.map((user) => (
              <option key={user._id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
          <button type="submit" className="delete">
            Delete User
          </button>
        </form>

        <form onSubmit={handleGameDelete}>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="field dropdown"
          >
            <option value="">Select Game</option>
            {gamesList.map((game) => (
              <option key={game._id} value={game.title}>
                {game.title}
              </option>
            ))}
          </select>
          <button type="submit" className="delete">
            Delete Game
          </button>
        </form>
      </div>
      {message}
    </>
  );
}
