import React from "react";
import { Link } from "react-router-dom";
import "../css/GameCard.css";

const GameCard = ({ game }) => {
  return (
    <div className="card-container">
      <a className="site" href={game.site} target="_blank">
        <h3 className="title">{game.title}</h3>
      </a>
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
