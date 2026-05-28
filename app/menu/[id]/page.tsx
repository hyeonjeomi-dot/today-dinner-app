"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Menu = {
  id: number;
  name: string;
  category: string;
  ingredients: string;
  youtube_url: string;
  description: string;
  image_url: string;
};

export default function MenuDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        console.log(error);
      }

      if (data) {
        setMenu(data);
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id]);

  const handleSelectDinner = async (person: "현정" | "상혁") => {
    if (!menu) return;

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("dinner_choices").insert([
      {
        user_name: person,
        person: person,
        menu_id: menu.id,
        menu_name: menu.name,
        date: today,
      },
    ]);

    if (error) {
      alert("선택 저장 실패 😢");
      console.log(error);
    } else {
      alert(`${person}이의 오늘 저녁 선택 완료 🍽`);
    }
  };

  if (!menu) {
    return <p>불러오는 중...</p>;
  }

  return (
    <main
      style={{
        maxWidth: "520px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        background: "#fffaf3",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        paddingBottom: "30px",
      }}
    >
      <img
        src={menu.image_url || "https://placehold.co/400x300"}
        alt={menu.name}
        style={{
          width: "100%",
          height: "280px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "20px" }}>
        <Link href="/menu">← 메뉴판으로</Link>

        <h1 style={{ fontSize: "30px", marginTop: "20px" }}>
          {menu.name}
        </h1>

        <p>🏷 {menu.category}</p>

        <section style={boxStyle}>
          <h2>🥬 재료</h2>
          <p>{menu.ingredients}</p>
        </section>

        <section style={boxStyle}>
          <h2>📝 설명</h2>
          <p>{menu.description}</p>
        </section>

        {menu.youtube_url && (
          <a
            href={menu.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            style={youtubeStyle}
          >
            🎥 유튜브 레시피 보기
          </a>
        )}

        <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={() => handleSelectDinner("현정")}
            style={buttonStyle}
          >
            현정이 선택
          </button>

          <button
            onClick={() => handleSelectDinner("상혁")}
            style={secondButtonStyle}
          >
            상혁이 선택
          </button>
        </div>
      </div>
    </main>
  );
}

const boxStyle = {
  background: "white",
  padding: "18px",
  borderRadius: "20px",
  marginTop: "18px",
};

const youtubeStyle = {
  display: "block",
  textAlign: "center" as const,
  background: "red",
  color: "white",
  padding: "16px",
  borderRadius: "16px",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "20px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "orange",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
};

const secondButtonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#111",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
};