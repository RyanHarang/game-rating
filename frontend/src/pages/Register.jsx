import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let processing = true;
    //axiosFetchData(processing);
    return () => {
      processing = false;
    };
  }, []);

  // const axiosFetchData = async (processing) => {
  //   await axios
  //     .get("http://localhost:4000/users")
  //     .then((res) => {
  //       if (processing) {
  //         //setUsername(res.data.username);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const axiosPostData = async () => {
    const postData = {
      username: username,
      password: password,
    };
    await axios
      .post("http://localhost:4000/users", postData)
      .then((res) => setError(<p className="success">{res.data}</p>));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError(<p className="error">Please fill all fields.</p>);
    } else {
      setError("");
      axiosPostData();
    }
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          required
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="field"
        />
        <label>Password</label>
        <input
          required
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />
        {error}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
