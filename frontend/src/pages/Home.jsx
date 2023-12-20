import React from "react";
import { Link } from "react-router-dom";
import g1 from "../assets/images/g1.jpg";
import g2 from "../assets/images/g2.jpg";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <p>This is the homepage</p>
      <ul className="game-box">
        <li>
          <Link to="/game/1" className="game">
            <img className="game-image" src={g1} alt="Game one" />
          </Link>
        </li>
        <li>
          <Link to="/game/2" className="game">
            <img className="game-image" src={g2} alt="Game two" />
          </Link>
        </li>
      </ul>
    </>
  );
}
