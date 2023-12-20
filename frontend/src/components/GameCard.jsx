import React from "react";

const GameCard = ({ game }) => {
  const imageUrl = game.imageUrl;

  return (
    <div>
      <h2>{game.title}</h2>
      <p>{game.site}</p>
      <img src={imageUrl} alt={game.title} loading="lazy" />
    </div>
  );
};

export default GameCard;
