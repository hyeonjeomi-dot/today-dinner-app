"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "🥘 오늘은 어떤 메뉴가 기다리고 있을까요?",
  "🍜 냉장고 속 재료를 확인하는 중이에요.",
  "🥩 유통기한도 함께 살펴보고 있어요.",
  "🍳 오늘도 맛있는 저녁을 준비해볼까요?",
  "🧊 냉장고 문을 살짝 열어보는 중이에요.",
  "⭐ 맛있는 메뉴를 고르는 중이에요.",
];

export default function Loading() {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const randomIndex = Math.floor(
      Math.random() * loadingMessages.length
    );

    setMessage(loadingMessages[randomIndex]);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #fff3df 0%, #fffaf3 45%)",
        padding: "20px",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          textAlign: "center",
          background: "white",
          padding: "36px 24px",
          borderRadius: "28px",
          boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            lineHeight: 1,
            animation:
              "loadingBounce 1.2s ease-in-out infinite",
          }}
        >
          🍽️
        </div>

        <h1
          style={{
            margin: "18px 0 0",
            fontSize: "26px",
            fontWeight: "900",
            color: "#222",
          }}
        >
          우리 저녁 뭐 먹지?
        </h1>

        <div
          style={{
            width: "44px",
            height: "44px",
            border: "4px solid #ffe0b2",
            borderTopColor: "#ff9800",
            borderRadius: "50%",
            margin: "24px auto 0",
            animation: "loadingSpin 0.9s linear infinite",
            boxSizing: "border-box",
          }}
        />

        <p
          style={{
            margin: "20px 0 0",
            color: "#555",
            fontSize: "15px",
            fontWeight: "bold",
            lineHeight: 1.6,
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            wordBreak: "keep-all",
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "18px",
          }}
        >
          <span style={dotStyle} />
          <span
            style={{
              ...dotStyle,
              animationDelay: "0.2s",
            }}
          />
          <span
            style={{
              ...dotStyle,
              animationDelay: "0.4s",
            }}
          />
        </div>

        <p
          style={{
            margin: "18px 0 0",
            color: "#999",
            fontSize: "13px",
          }}
        >
          잠시만 기다려 주세요 😊
        </p>

        <style>{`
          @keyframes loadingBounce {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes loadingSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes loadingDot {
            0%, 100% {
              opacity: 0.25;
              transform: scale(0.8);
            }

            50% {
              opacity: 1;
              transform: scale(1.15);
            }
          }
        `}</style>
      </div>
    </main>
  );
}

const dotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "#ff9800",
  animation: "loadingDot 1.2s ease-in-out infinite",
};