"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "bongbong3") {
      localStorage.setItem("dinner-auth", "yes");
      window.location.href = "/";
    } else {
      alert("비밀번호가 틀렸어요 😢");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fffaf3",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1>🔒 우리만의 저녁앱</h1>

        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            border: "1px solid #ddd",
            marginTop: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            border: "none",
            background: "orange",
            color: "white",
            fontWeight: "bold",
            marginTop: "16px",
          }}
        >
          입장하기
        </button>
      </div>
    </main>
  );
}