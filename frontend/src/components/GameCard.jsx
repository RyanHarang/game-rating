import React from "react";
import "../css/GameCard.css";

const GameCard = ({ game }) => {
  return (
    <div className="card-container">
      <a className="site" href={game.site} target="_blank">
        <h3 className="title">{game.title}</h3>
      </a>
      <img
        src={game.imageUrl}
        alt={game.title}
        loading="lazy"
        className="game-image"
      />
    </div>
  );
};

export default GameCard;
