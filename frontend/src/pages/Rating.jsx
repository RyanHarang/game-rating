import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import "../css/forms.css";
import axios from "axios";

export default function Rating() {
  const { isGuest } = useAuth();
  const [username, setUsername] = useState("");
  const [game, setGame] = useState("");
  const [score, setScore] = useState(5);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let processing = true;
    //axiosFetchData(processing);
    return () => {
      processing = false;
    };
  }, []);

  if (isGuest) {
    // Redirect or show a message for guests
    return <p>You do not have access to the ratings page as a guest.</p>;
  }

  const handleScoreChange = (e) => {
    // Update the score state when the user selects a value
    setScore(parseFloat(e.target.value));
  };

  // eventually I'll need to use something similar to this to pull from a game list I think
  // const axiosFetchData = async (processing) => {
  //   await axios
  //     .get("http://localhost:4000/users")
  //     .then((res) => {
  //       if (processing) {
  //         setScore(res.data.score);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const axiosPostData = async () => {
    const postData = {
      username: username,
      game: game,
      score: score,
    };
    await axios
      .post("http://localhost:4000/rating", postData)
      .then((res) => setMessage(<p className="success">{res.data}</p>));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !game || !score) {
      setMessage(<p className="required">Please fill all fields.</p>);
    } else {
      setMessage("");
      axiosPostData();
    }
  };

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Rating</h1>
        <form className="rating-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="field"
          />
          <label>Game</label>
          <input
            type="text"
            id="game"
            name="game"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="field"
          />
          <label>Score</label>
          <div className="custom-select">
            <div className="score-display">
              <span>{score}</span>
            </div>
            <div className="select-options">
              {[...Array(21).keys()].map((value) => (
                <div
                  key={value}
                  className="option"
                  onClick={() =>
                    handleScoreChange({ target: { value: value / 2 } })
                  }
                >
                  {value / 2}
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="process">
            Submit
          </button>
        </form>
        {message}
      </div>
    </>
  );
}
