import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <div className="card-container">
      <h3 className="title">{game.title}</h3>
      <Link to={`/game/${game.title}`} className="game-link">
        <img
          src={game.imageUrl}
          alt={game.title}
          loading="lazy"
          className="game-image"
        />
      </Link>
    </div>
  );
};

export default GameCard;
