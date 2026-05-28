import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";
import Link from "next/link";

type Menu = {
  id: number;
  name: string;
  category: string;
  ingredients: string;
  youtube_url: string;
  description: string;
  image_url: string;
};

export default async function MenuPage() {
  const { data: menus, error } = await supabase
    .from("menus")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
  }

  return (
    <main style={{
      padding: "20px",
      paddingBottom: "90px",
      maxWidth: "430px",
      margin: "0 auto",
      background: "#fffaf3",
      minHeight: "100vh",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        🍽 메뉴판
      </h1>

      <input
        placeholder="먹고 싶은 메뉴 검색"
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "15px",
          border: "1px solid #ddd",
          marginTop: "20px",
          fontSize: "16px",
          boxSizing: "border-box"
        }}
      />

      {menus && menus.length > 0 ? (
  menus.map((menu: Menu) => (
    <Link
  key={menu.id}
  href={`/menu/${menu.id}`}
  style={{ textDecoration: "none", color: "black" }}
>
      <div
            style={{
              background: "white",
              borderRadius: "24px",
              marginTop: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
            }}
          >
            <img
  src={menu.image_url || "https://placehold.co/400x300"}
  alt={menu.name}
  style={{
    width: "100%",
    height: "220px",
    objectFit: "cover"
  }}
/>

            <div style={{ padding: "18px" }}>
              <h2 style={{ margin: 0 }}>{menu.name}</h2>
              <p style={{ color: "#666" }}>{menu.description}</p>
              <p>🏷 {menu.category}</p>
              <p>🥬 {menu.ingredients}</p>

              {menu.youtube_url && (
                <a href={menu.youtube_url} target="_blank" rel="noopener noreferrer">
                  🎥 유튜브 레시피 보기
                </a>
              )}

              <button style={{
                marginTop: "15px",
                width: "100%",
                padding: "15px",
                borderRadius: "15px",
                border: "none",
                background: "orange",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px"
              }}>
                오늘 선택하기
              </button>
            </div>
          </div>
        </Link>
      ))
      ) : (
        <p style={{ marginTop: "30px" }}>
          아직 등록된 메뉴가 없어요.
        </p>
      )}

      <BottomNav />
    </main>
  );
}