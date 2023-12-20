import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Rating() {
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
    // Add your form submission logic here
    if (!username || !game || !score) {
      setMessage(<p className="required">Please fill all fields.</p>);
    } else {
      setMessage("");
      axiosPostData();
    }
  };

  return (
    <>
      <h1>Rating</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Game</label>
        <input
          type="text"
          id="game"
          name="game"
          value={game}
          onChange={(e) => setGame(e.target.value)}
        />
        <label>Score</label>
        <select value={score} onChange={handleScoreChange}>
          <option value={0}>0</option>
          <option value={0.5}>0.5</option>
          <option value={1}>1</option>
          <option value={1.5}>1.5</option>
          <option value={2}>2</option>
          <option value={2.5}>2.5</option>
          <option value={3}>3</option>
          <option value={3.5}>3.5</option>
          <option value={4}>4</option>
          <option value={4.5}>4.5</option>
          <option value={5}>5</option>
          <option value={5.5}>5.5</option>
          <option value={6}>6</option>
          <option value={6.5}>6.5</option>
          <option value={7}>7</option>
          <option value={7.5}>7.5</option>
          <option value={8}>8</option>
          <option value={8.5}>8.5</option>
          <option value={9}>9</option>
          <option value={9.5}>9.5</option>
          <option value={10}>10</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {message}
    </>
  );
}
