// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      alert("Connexion réussie !");
    } catch (err) {
      alert("Erreur de connexion !");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" onChange={(e)=>setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
    </form>
  );
}
