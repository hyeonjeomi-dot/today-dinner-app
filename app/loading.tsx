export default function Loading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #fff3df 0%, #fffaf3 45%)",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          textAlign: "center",
          background: "white",
          padding: "34px 24px",
          borderRadius: "28px",
          boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            fontSize: "54px",
            animation: "loadingBounce 1.2s ease-in-out infinite",
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

        <p
          style={{
            margin: "10px 0 0",
            color: "#777",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          오늘의 메뉴를 준비하는 중이에요
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <span style={dotStyle} />
          <span style={{ ...dotStyle, animationDelay: "0.2s" }} />
          <span style={{ ...dotStyle, animationDelay: "0.4s" }} />
        </div>

        <style>{`
          @keyframes loadingBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
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