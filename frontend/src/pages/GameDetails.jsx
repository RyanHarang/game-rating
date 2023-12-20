import React from "react";
import { useParams } from "react-router-dom";

export default function GameDetails() {
  const params = useParams();
  let gameData = null;

  // DB lookup
  if (params.id === "1") {
    gameData = {
      name: "Game One",
      price: 40.0,
      image: "../assets/images/g1",
    };
  }
  return (
    <>
      <h1>Game Details</h1>
      <p>Game ID: {params.id}</p>
      {gameData != null ? (
        <>
          <img
            src={gameData.image}
            alt={gameData.name}
            className="game-image"
          />
          <h2>
            Name : {gameData.name} Price: {gameData.price}
          </h2>
        </>
      ) : (
        "No Game Data Found"
      )}
    </>
  );
}
