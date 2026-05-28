"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "../../components/BottomNav";

type Menu = {
  id: number;
  name: string;
  ingredients: string;
  image_url: string;
  matchedCount?: number;
  matchedIngredients?: string[];
};

export default function RecommendPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [fridgeNames, setFridgeNames] = useState<string[]>([]);
  const [randomMenu, setRandomMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: fridgeItems } = await supabase
        .from("fridge_items")
        .select("*");

      const { data: menuData } = await supabase.from("menus").select("*");

      const names = fridgeItems?.map((item) => item.name.trim()) || [];
      setFridgeNames(names);

      const recommended =
        menuData
          ?.map((menu) => {
            const ingredientsText = menu.ingredients || "";

            const matchedIngredients = names.filter((name) =>
              ingredientsText.includes(name)
            );

            return {
              ...menu,
              matchedCount: matchedIngredients.length,
              matchedIngredients,
            };
          })
          .filter((menu) => menu.matchedCount > 0)
          .sort((a, b) => b.matchedCount - a.matchedCount) || [];

      setMenus(recommended);
    };

    fetchData();
  }, []);

  const handleRandomPick = async () => {
  const { data } = await supabase.from("menus").select("*");

  if (!data || data.length === 0) {
    alert("등록된 메뉴가 없어요!");
    return;
  }

  let candidates = data;

  if (randomMenu && data.length > 1) {
    candidates = data.filter((menu) => menu.id !== randomMenu.id);
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  setRandomMenu(picked);
};

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
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        🍳 메뉴 추천
      </h1>

      <p style={{ color: "#666", textAlign: "center" }}>
        냉장고 재료로 추천받거나 랜덤으로 골라보세요.
      </p>

      <section style={boxStyle}>
        <h2
  style={{
    margin: 0,
    fontSize: "16px",
    fontWeight: "900",
  }}
>
  🎲 랜덤 메뉴 추천
</h2>

        <button onClick={handleRandomPick} style={randomButtonStyle}>
          아무거나 골라줘!
        </button>

        {randomMenu && (
  <Link
    href={`/menu/${randomMenu.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div
      style={{
        marginTop: "16px",
        borderRadius: "22px",
        overflow: "hidden",
        background: "#fff7e6",
        border: "1px solid #ffd58a",
        boxShadow: "0 8px 22px rgba(255, 122, 0, 0.16)",
      }}
    >
      {randomMenu.image_url && (
        <img
          src={randomMenu.image_url}
          alt={randomMenu.name}
          style={{
            width: "100%",
            height: "170px",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      <div style={{ padding: "18px" }}>
        <p
          style={{
            margin: 0,
            color: "#f28c00",
            fontWeight: "900",
            fontSize: "13px",
          }}
        >
          🎯 오늘의 랜덤 추천
        </p>

        <h2
          style={{
            margin: "6px 0 0",
            fontSize: "26px",
            fontWeight: "900",
          }}
        >
          {randomMenu.name}
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: "#777",
            fontSize: "14px",
          }}
        >
          고민될 땐 이걸로 가보자 →
        </p>
      </div>
    </div>
  </Link>
)}
      </section>

      <section style={boxStyle}>
        <h2
  style={{
    marginTop: 0,
    marginBottom: "16px",
  }}
>
  🧊 현재 재료
</h2>

        {fridgeNames.length === 0 ? (
          <p style={{ color: "#666" }}>냉장고에 재료가 없어요.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {fridgeNames.map((name) => (
              <span key={name} style={chipStyle}>
                {name}
              </span>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
        {menus.length === 0 ? (
          <div style={boxStyle}>
            <p style={{ color: "#666", margin: 0 }}>
              아직 추천할 수 있는 메뉴가 없어요.
            </p>
          </div>
        ) : (
          menus.map((menu) => (
            <Link
              key={menu.id}
              href={`/menu/${menu.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={menuCardStyle}>
                {menu.image_url && (
                  <img
                    src={menu.image_url}
                    alt={menu.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div style={{ padding: "18px" }}>
                  <h2 style={{ margin: 0, fontSize: "22px" }}>
                    {menu.name}
                  </h2>

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#666",
                      fontWeight: "bold",
                    }}
                  >
                    냉장고 재료 {menu.matchedCount}개 사용 가능
                  </p>

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#999",
                      fontSize: "14px",
                    }}
                  >
                    포함 재료: {menu.matchedIngredients?.join(", ")}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      <BottomNav />
    </main>
  );
}

const boxStyle = {
  background: "white",
  padding: "18px",
  borderRadius: "20px",
  marginTop: "20px",
};

const chipStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#fff0d9",
  fontWeight: "bold",
  fontSize: "14px",
};

const randomButtonStyle = {
  padding: "14px 26px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #ff9f1c, #ff7a00)",
  color: "white",
  fontWeight: "900",
  fontSize: "15px",
  display: "block",
  margin: "18px auto 0",
  boxShadow: "0 6px 16px rgba(255, 122, 0, 0.22)",
};

const menuCardStyle = {
  background: "white",
  borderRadius: "20px",
  overflow: "hidden",
  border: "1px solid #eee",
};