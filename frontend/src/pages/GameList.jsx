import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import GameCard from "../components/GameCard";
import ScrollButton from "../components/ScrollButton";
import axios from "axios";

export default function GameList() {
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("None");
  const [scrollPosition, setScrollPosition] = useState(() => {
    const storedScrollPosition = localStorage.getItem("gameListScrollPosition");
    return storedScrollPosition ? parseInt(storedScrollPosition, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("gameListScrollPosition", scrollPosition.toString());
  }, [scrollPosition]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: scrollPosition });
  }, [games]);

  useEffect(() => {
    fetchGames();
  }, [searchTerm, ratingFilter, user]);

  const fetchGames = async () => {
    try {
      let apiUrl = `http://localhost:4000/games?search=${searchTerm}`;
      if (!isGuest) {
        apiUrl += `&currentUser=${user}`;
        if (ratingFilter === "Rated") {
          apiUrl += `&ratingFilter=Rated`;
        } else if (ratingFilter === "NotRated" && !isGuest) {
          apiUrl += `&ratingFilter=NotRated`;
        }
      }

      const response = await axios.get(apiUrl);
      // const response = await axios.get(
      //   `http://localhost:4000/games?search=${searchTerm}`
      // );
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRatingFilterChange = (e) => {
    setRatingFilter(e.target.value);
  };

  const handleScroll = () => {
    requestAnimationFrame(() => {
      setScrollPosition(window.scrollY);
    });
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <div className="search-methods">
        {!isGuest && (
          <div className="filter-bar">
            <label>
              Filter By
              <select
                value={ratingFilter}
                onChange={handleRatingFilterChange}
                className="field filter"
              >
                <option value="None">None</option>
                <option value="Rated">Rated</option>
                <option value="NotRated">Not Rated</option>
              </select>
            </label>
          </div>
        )}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a game"
            value={searchTerm}
            onChange={handleSearchChange}
            className="field"
          />
        </div>
      </div>
      <div className="card-grid">
        {games.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
      <ScrollButton />
    </>
  );
}
