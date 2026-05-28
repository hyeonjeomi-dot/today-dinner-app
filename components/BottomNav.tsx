import Link from "next/link";

export default function BottomNav() {
  return (
    <>
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: "520px",
          width: "100%",
          margin: "0 auto",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid #f0f0f0",
          borderRadius: "24px 24px 0 0",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          padding: "10px 6px",
          boxSizing: "border-box",
          boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
          zIndex: 9999,
        }}
      >
        <NavItem href="/" icon="🏠" label="홈" />
        <NavItem href="/menu" icon="📖" label="메뉴판" />
        <NavItem href="/calendar" icon="📅" label="달력" />
        <NavItem href="/fridge" icon="🧊" label="냉장고" />
        <NavItem href="/recommend" icon="🍳" label="추천" />
        <NavItem href="/add" icon="➕" label="추가" />
      </nav>

      <div style={{ height: "50px" }} />
    </>
  );
}

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
};

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "4px 0",
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: "19px", lineHeight: 1 }}>{icon}</span>

      <span
        style={{
          fontSize: "11px",
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </Link>
  );
}