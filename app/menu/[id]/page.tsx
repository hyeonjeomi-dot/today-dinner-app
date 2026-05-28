"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import BottomNav from "../../../components/BottomNav";

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

    const { data: existingChoices, error: findError } = await supabase
      .from("dinner_choices")
      .select("*")
      .eq("date", today)
      .eq("person", person)
      .order("id", { ascending: false })
      .limit(1);

    const existingChoice = existingChoices?.[0];

    if (findError) {
      alert("기존 선택 확인 실패 😢");
      console.log(findError);
      return;
    }

    if (existingChoice) {
      const { error: updateError } = await supabase
        .from("dinner_choices")
        .update({
          user_name: person,
          menu_id: menu.id,
          menu_name: menu.name,
        })
        .eq("id", existingChoice.id);

      if (updateError) {
        alert("선택 변경 실패 😢");
        console.log(updateError);
        return;
      }

      alert(`${person}이의 저녁 선택을 변경했어요 🍽`);
      return;
    }

    const { error: insertError } = await supabase.from("dinner_choices").insert([
      {
        user_name: person,
        person: person,
        menu_id: menu.id,
        menu_name: menu.name,
        date: today,
      },
    ]);

    if (insertError) {
      alert("선택 저장 실패 😢");
      console.log(insertError);
    } else {
      alert(`${person}이의 오늘 저녁 선택 완료 🍽`);
    }
  };


  const handleDelete = async () => {
  const ok = confirm("정말 삭제할까요?");

  if (!ok) return;

  const { error } = await supabase
    .from("menus")
    .delete()
    .eq("id", menu?.id);

  if (error) {
    alert("삭제 실패 😢");
    console.log(error);
    return;
  }

  alert("메뉴 삭제 완료 🍽");

  window.location.href = "/menu";
};
  if (!menu) {
    return (
      <main
        style={{
          padding: "20px",
          maxWidth: "520px",
          width: "100%",
          boxSizing: "border-box",
          margin: "0 auto",
          background: "#fffaf3",
          minHeight: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <p>불러오는 중...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "520px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        background: "linear-gradient(180deg, #fff3df 0%, #fffaf3 45%)",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        paddingBottom: "90px",
      }}
    >
      <div
        style={{
          padding: "16px 18px 10px",
        }}
      >
        <Link
          href="/menu"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            color: "#333",
            fontWeight: "bold",
            background: "white",
            padding: "10px 14px",
            borderRadius: "999px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          ← 메뉴판으로
        </Link>
      </div>

      <div
        style={{
          margin: "0 16px",
          borderRadius: "26px",
          overflow: "hidden",
          boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
          background: "white",
        }}
      >
        <img
          src={menu.image_url || "https://placehold.co/400x300"}
          alt={menu.name}
          style={{
            width: "100%",
            height: "290px",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div style={{ padding: "20px" }}>
          <p
            style={{
              margin: 0,
              color: "#f28c00",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            {menu.category || "오늘의 메뉴"}
          </p>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "900",
              margin: "6px 0 0",
              letterSpacing: "-1px",
            }}
          >
            {menu.name}
          </h1>

          <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "14px",
  }}
>
  <Link
    href={`/add?id=${menu.id}`}
    style={{
      flex: 1,
      textDecoration: "none",
      background: "#111",
      color: "white",
      padding: "12px 14px",
      borderRadius: "14px",
      fontWeight: "bold",
      fontSize: "14px",
      textAlign: "center",
    }}
  >
    ✏️ 메뉴 수정
  </Link>

  <button
    onClick={handleDelete}
    style={{
      flex: 1,
      border: "none",
      background: "#ff4d4f",
      color: "white",
      padding: "12px 14px",
      borderRadius: "14px",
      fontWeight: "bold",
      fontSize: "14px",
      cursor: "pointer",
    }}
  >
    🗑 삭제
  </button>
</div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "20px",
            }}
          >
            <section style={boxStyle}>
              <h2 style={sectionTitleStyle}>🥬 재료</h2>
              <p style={contentTextStyle}>{menu.ingredients || "등록된 재료가 없어요."}</p>
            </section>

            <section style={boxStyle}>
              <h2 style={sectionTitleStyle}>📝 설명</h2>
              <p style={contentTextStyle}>{menu.description || "등록된 설명이 없어요."}</p>
            </section>
          </div>

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

          <div
            style={{
              marginTop: "20px",
              background: "#fff7e6",
              border: "1px solid #ffe0a3",
              borderRadius: "22px",
              padding: "16px",
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                fontWeight: "bold",
                color: "#d97706",
                textAlign: "center",
              }}
            >
              오늘 저녁으로 선택하기
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                onClick={() => handleSelectDinner("현정")}
                style={buttonStyle}
              >
                현정이
              </button>

              <button
                onClick={() => handleSelectDinner("상혁")}
                style={secondButtonStyle}
              >
                상혁이
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

const boxStyle = {
  background: "#fafafa",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid #f0f0f0",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "900",
};

const contentTextStyle = {
  margin: "10px 0 0",
  color: "#555",
  lineHeight: 1.6,
  whiteSpace: "pre-line" as const,
};

const youtubeStyle = {
  display: "block",
  textAlign: "center" as const,
  background: "#ff2d2d",
  color: "white",
  padding: "16px",
  borderRadius: "18px",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "20px",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #ff9f1c, #ff7a00)",
  color: "white",
  fontWeight: "900",
  fontSize: "16px",
};

const secondButtonStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background: "#111",
  color: "white",
  fontWeight: "900",
  fontSize: "16px",
};