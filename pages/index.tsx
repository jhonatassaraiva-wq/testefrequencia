import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      alert(data.error || "Erro");
    }
  }

  async function punch(type: "IN" | "OUT") {
    if (!token) return alert("faça login");
    const res = await fetch("/api/punches", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ type })
    });
    if (res.ok) {
      alert("Ponto registrado: " + type);
      router.push("/history");
    } else {
      const d = await res.json();
      alert(d.error || "erro");
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Ponto Estágio — MVP</h1>

      {!token ? (
        <form onSubmit={login} style={{ maxWidth: 360 }}>
          <h2>Login</h2>
          <div>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <div>
          <p>Logado como: {user?.email}</p>
          <button onClick={() => punch("IN")} style={{ marginRight: 8 }}>Bater Entrada</button>
          <button onClick={() => punch("OUT")}>Bater Saída</button>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => router.push("/history")}>Ver Histórico</button>
            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); setToken(null); setUser(null); }}>Sair</button>
          </div>
        </div>
      )}
    </div>
  );
}
