import React from "react";
import "../css/GameCard.css";

const GameCard = ({ game }) => {
  const imageUrl = game.imageUrl;

  return (
    <div className="card-container">
      <h2 className="title">{game.title}</h2>
      <p className="site">{game.site}</p>
      <img
        src={imageUrl}
        alt={game.title}
        loading="lazy"
        className="game-image"
      />
    </div>
  );
};

export default GameCard;
