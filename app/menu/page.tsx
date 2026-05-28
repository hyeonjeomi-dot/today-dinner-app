"use client";

import { useEffect, useState } from "react";
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

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
      }

      if (data) {
        setMenus(data);
      }
    };

    fetchMenus();
  }, []);

  const filteredMenus = menus.filter((menu) => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return true;

    return (
      menu.name?.toLowerCase().includes(keyword) ||
      menu.ingredients?.toLowerCase().includes(keyword)
    );
  });

  return (
    <main
      style={{
        padding: "16px",
        paddingBottom: "90px",
        maxWidth: "520px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        background: "linear-gradient(180deg, #fff3df 0%, #fffaf3 45%)",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#f28c00",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        오늘의 저녁 선택
      </p>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "900",
          margin: "6px 0 0",
        }}
      >
        📖 메뉴판
      </h1>

      <p style={{ color: "#777", marginTop: "8px" }}>
        오늘의 저녁을 선택해보아요.
      </p>

      <input
        placeholder="메뉴 이름 또는 재료 검색"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "18px",
          border: "1px solid #eee",
          marginTop: "18px",
          fontSize: "16px",
          boxSizing: "border-box",
          background: "white",
          outline: "none",
        }}
      />

      <Link href="/add">
        <button
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "16px",
            borderRadius: "18px",
            border: "none",
            background: "linear-gradient(135deg, #ff9f1c, #ff7a00)",
            color: "white",
            fontWeight: "900",
            fontSize: "16px",
            boxShadow: "0 6px 16px rgba(255, 122, 0, 0.25)",
          }}
        >
          ➕ 새 메뉴 등록하기
        </button>
      </Link>

      {filteredMenus.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "22px",
            marginTop: "24px",
            textAlign: "center",
            color: "#666",
          }}
        >
          검색 결과가 없어요.
        </div>
      ) : (
        <div
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          {filteredMenus.map((menu) => (
            <Link
              key={menu.id}
              href={`/menu/${menu.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "22px",
                  overflow: "hidden",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  border: "1px solid #f1f1f1",
                  height: "100%",
                }}
              >
                <img
                  src={menu.image_url || "https://placehold.co/300x220"}
                  alt={menu.name}
                  style={{
                    width: "100%",
                    height: "135px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "13px" }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "900",
                      lineHeight: 1.25,
                      wordBreak: "keep-all",
                    }}
                  >
                    {menu.name}
                  </h2>

                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "12px",
                      color: "#f28c00",
                      fontWeight: "bold",
                    }}
                  >
                    자세히 보기 →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}