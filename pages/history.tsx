import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function History() {
  const [punches, setPunches] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { router.push("/"); return; }
    setToken(t);
    fetch("/api/punches", { headers: { Authorization: "Bearer " + t } })
      .then((r) => r.json())
      .then((data) => setPunches(data || []));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Histórico</h1>
      <button onClick={() => router.push("/")}>Voltar</button>
      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Timestamp</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {punches.map((p) => (
            <tr key={p.id}>
              <td>{p.type}</td>
              <td>{new Date(p.ts).toLocaleString()}</td>
              <td>{p.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
