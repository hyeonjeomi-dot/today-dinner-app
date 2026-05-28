import Link from "next/link";

export default function BottomNav() {
  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: "430px",
      margin: "0 auto",
      background: "white",
      borderTop: "1px solid #eee",
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0",
      fontSize: "13px"
    }}>
      <Link href="/" style={{ textDecoration: "none", color: "black", textAlign: "center" }}>
        🏠<br />홈
      </Link>

      <Link href="/menu" style={{ textDecoration: "none", color: "black", textAlign: "center" }}>
        🍽<br />메뉴판
      </Link>

      <Link href="/calendar" style={{ textDecoration: "none", color: "black", textAlign: "center" }}>
        📅<br />달력
      </Link>

      <Link href="/fridge" style={{ textDecoration: "none", color: "black", textAlign: "center" }}>
        🧊<br />냉장고
      </Link>

      <Link href="/add" style={{ textDecoration: "none", color: "black", textAlign: "center" }}>
        ➕<br />추가
      </Link>
    </nav>
  );
}