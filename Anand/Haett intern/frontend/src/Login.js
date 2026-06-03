import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    console.log("Email:", email);
    console.log("Password:", password);

    if (email.trim() === "admin@test.com" && password.trim() === "admin123") {
      alert("Admin Login Successful");
    } else if (
      email.trim() === "user@test.com" &&
      password.trim() === "user123"
    ) {
      alert("User Login Successful");
    } else {
      alert("Invalid Login");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login Page</h1>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;