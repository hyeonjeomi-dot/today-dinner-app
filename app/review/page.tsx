"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";

type DinnerChoice = {
  id: number;
  menu_id: number;
  menu_name: string;
  person: string;
};

type Review = {
  id: number;
  review_date: string;
  menu_id: number;
  menu_name: string;
  person: string;
  rating: number;
  content: string;
  created_at: string;
};

export default function ReviewPage() {
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10)

  const [mode, setMode] = useState<"write" | "recent" | "top" | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [hyunjungChoice, setHyunjungChoice] = useState<DinnerChoice | null>(null);

  const [person, setPerson] = useState("현정");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [topReviews, setTopReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchHyunjungChoice();
  }, [selectedDate]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchHyunjungChoice = async () => {
    const { data } = await supabase
      .from("dinner_choices")
      .select("*")
      .eq("date", selectedDate)
      .eq("person", "현정")
      .order("id", { ascending: false })
      .limit(1);

    setHyunjungChoice(data?.[0] || null);
  };

  const fetchReviews = async () => {
    const { data: recent } = await supabase
      .from("menu_reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: top } = await supabase
      .from("menu_reviews")
      .select("*")
      .order("rating", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentReviews(recent || []);
    setTopReviews(top || []);
  };

  const handleSaveReview = async () => {
    if (!hyunjungChoice) {
      alert("해당 날짜에 현정이 선택한 메뉴가 없어요 😢");
      return;
    }

    if (!content.trim()) {
      alert("후기 내용을 입력해주세요 😢");
      return;
    }

    const { error } = await supabase.from("menu_reviews").insert([
      {
        review_date: selectedDate,
        menu_id: hyunjungChoice.menu_id,
        menu_name: hyunjungChoice.menu_name,
        person,
        rating,
        content,
      },
    ]);

    if (error) {
      console.log(error);
      alert("후기 저장 실패 😢");
      return;
    }

    alert("후기 저장 완료 ✨");

setContent("");
setRating(5);
setPerson("현정");

await fetchReviews();
setMode("recent");
  };

  const handleDeleteReview = async (reviewId: number) => {
  const ok = confirm("이 후기를 삭제할까요?");

  if (!ok) return;

  const { error } = await supabase
    .from("menu_reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    console.log(error);
    alert("후기 삭제 실패 😢");
    return;
  }

  alert("후기 삭제 완료 🗑");
  await fetchReviews();
};

  return (
    <main
      style={{
        padding: "20px",
        paddingBottom: "110px",
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
        우리의 식사 기록
      </p>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "900",
          margin: "6px 0 0",
        }}
      >
        ✍️ 오늘의 후기
      </h1>

      <p style={{ color: "#777", marginTop: "8px" }}>
        먹었던 메뉴의 후기를 남기고 다시 확인해보세요.
      </p>

      <div style={{ display: "grid", gap: "12px", marginTop: "22px" }}>
        <button onClick={() => setMode("write")} style={bannerStyle}>
          ✍️ 리뷰 작성하기
        </button>

        <button onClick={() => setMode("recent")} style={bannerStyle}>
          🕘 최근 리뷰 확인하기
        </button>

        <button onClick={() => setMode("top")} style={bannerStyle}>
          ⭐ 평점 높은순
        </button>
      </div>

      {mode === "write" && (
        <section style={boxStyle}>
          <h2 style={{ marginTop: 0 }}>✍️ 리뷰 작성하기</h2>

          <p style={labelStyle}>날짜 선택</p>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={inputStyle}
          />

          <div
            style={{
              marginTop: "18px",
              padding: "16px",
              borderRadius: "18px",
              background: "#fff7e6",
              border: "1px solid #ffe0a3",
            }}
          >
            <p style={{ margin: 0, color: "#d97706", fontWeight: "bold" }}>
              이날의 메뉴
            </p>

            <h2 style={{ margin: "8px 0 0" }}>
              {hyunjungChoice?.menu_name || "현정이 선택한 메뉴 없음"}
            </h2>
          </div>

          <p style={labelStyle}>작성자</p>
          <select
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            style={inputStyle}
          >
            <option value="현정">현정</option>
            <option value="상혁">상혁</option>
          </select>

          <p style={labelStyle}>별점</p>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={inputStyle}
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          <p style={labelStyle}>후기 내용</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: 존맛 / 또 먹고 싶음 / 다음엔 덜 맵게"
            style={textareaStyle}
          />

          <button onClick={handleSaveReview} style={saveButtonStyle}>
            후기 저장하기 ✨
          </button>
        </section>
      )}

      {mode === "recent" && (
        <section style={boxStyle}>
          <h2 style={{ marginTop: 0 }}>🕘 최근 리뷰</h2>
          <ReviewList
  reviews={recentReviews}
  onDelete={handleDeleteReview}
/>
        </section>
      )}

      {mode === "top" && (
        <section style={boxStyle}>
          <h2 style={{ marginTop: 0 }}>⭐ 평점 높은순</h2>
          <ReviewList
  reviews={topReviews}
  onDelete={handleDeleteReview}
/>
        </section>
      )}

      <BottomNav />
    </main>
  );
}

function ReviewList({
  reviews,
  onDelete,
}: {
  reviews: Review[];
  onDelete: (reviewId: number) => void;
}) {
  if (reviews.length === 0) {
    return <p style={{ color: "#666" }}>아직 작성된 리뷰가 없어요.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "12px",
      }}
    >
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/menu/${review.menu_id}`}
          style={{ textDecoration: "none", color: "inherit", minWidth: 0 }}
        >
          <div
            style={{
              minHeight: "150px",
              padding: "14px",
              borderRadius: "18px",
              background: "#fafafa",
              border: "1px solid #eee",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  }}
>
  <p
    style={{
      margin: 0,
      color: "#999",
      fontSize: "11px",
      fontWeight: "bold",
    }}
  >
    {review.review_date} · {review.person}
  </p>

  <button
    onClick={(e) => {
      e.preventDefault();
      onDelete(review.id);
    }}
    style={{
      padding: "4px 7px",
      borderRadius: "999px",
      border: "none",
      background: "#ffefef",
      color: "#d00",
      fontWeight: "bold",
      fontSize: "10px",
      flexShrink: 0,
    }}
  >
    삭제
  </button>
</div>

              <h3
                style={{
                  margin: "6px 0 0",
                  fontSize: "17px",
                  fontWeight: "900",
                  lineHeight: 1.25,
                  wordBreak: "keep-all",
                }}
              >
                {review.menu_name}
              </h3>

              <p style={{ margin: "6px 0 0", fontSize: "13px" }}>
                {"⭐".repeat(review.rating)}
              </p>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#555",
                  fontSize: "13px",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {review.content}
              </p>
            </div>

           
          </div>
        </Link>
      ))}
    </div>
  );
}

const bannerStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "22px",
  border: "none",
  background: "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  fontWeight: "900",
  fontSize: "17px",
  textAlign: "left" as const,
};

const boxStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "24px",
  marginTop: "22px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const labelStyle = {
  marginTop: "22px",
  marginBottom: "8px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box" as const,
};

const textareaStyle = {
  width: "100%",
  minHeight: "120px",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box" as const,
  resize: "none" as const,
};

const saveButtonStyle = {
  marginTop: "24px",
  width: "100%",
  padding: "16px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(135deg, #ff9f1c, #ff7a00)",
  color: "white",
  fontWeight: "900",
  fontSize: "17px",
};