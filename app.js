import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);

  const register = async () => {
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    alert(await response.text());
  };

  const login = async () => {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    setToken(data.access_token);
    alert("Login Successful!");
  };

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5000/users/", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    const data = await response.json();
    setUsers(data);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <h2>Flask + React Auth</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={register}>Register</button>
      <button onClick={login} style={{ marginLeft: 10 }}>Login</button>

      {token && (
        <>
          <hr />
          <h3>Users</h3>
          <button onClick={fetchUsers}>Fetch Users</button>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
