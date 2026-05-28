"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";


function AddPageContent() {
  const searchParams = useSearchParams();
const editId = searchParams.get("id");
console.log("editId:", editId);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
  const fetchMenu = async () => {
    if (!editId) return;

    const { data } = await supabase
      .from("menus")
      .select("*")
      .eq("id", Number(editId))
      .single();

    if (data) {
      setName(data.name || "");
      setCategory(data.category || "");
      setIngredients(data.ingredients || "");
      setYoutubeUrl(data.youtube_url || "");
      setDescription(data.description || "");
    }
  };

  fetchMenu();
}, [editId]);

  const handleAddMenu = async () => {
    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop() || "jpg";
const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, imageFile);

      if (uploadError) {
  alert(`이미지 업로드 실패 😢\n${uploadError.message}`);
  console.log(uploadError);
  return;
}

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    let error;

const payload = {
  name,
  category,
  ingredients,
  youtube_url: youtubeUrl,
  description,
  ...(imageUrl ? { image_url: imageUrl } : {}),
};

if (editId) {
  const result = await supabase
    .from("menus")
    .update(payload)
    .eq("id", Number(editId))
    .select();

  console.log("수정 결과:", result);

  error = result.error;
} else {
  const result = await supabase
    .from("menus")
    .insert([
      {
        ...payload,
        image_url: imageUrl,
      },
    ])
    .select();

  console.log("등록 결과:", result);

  error = result.error;
}

 if (error) {
  alert("저장 실패 😢");
  console.log(error);
} else {
  alert(editId ? "메뉴 수정 완료 🍽" : "메뉴 등록 완료 🍽");   
      setName("");
      setCategory("");
      setIngredients("");
      setYoutubeUrl("");
      setDescription("");
      setImageFile(null);
    }
  };

  return (
    <main style={pageStyle}>

      <Link
  href={editId ? `/menu/${editId}` : "/menu"}
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
    marginBottom: "18px",
  }}
>
  ← 돌아가기
</Link>


      <p
  style={{
    margin: 0,
    color: "#f28c00",
    fontWeight: "bold",
    fontSize: "14px",
  }}
>
  새로운 메뉴 등록
</p>

<h1 style={titleStyle}>
  ➕ 메뉴 추가
</h1>

<p
  style={{
    marginTop: "8px",
    color: "#777",
  }}
>
  새로운 저녁 메뉴를 추가해보아요.
</p>

      <div style={cardStyle}>
        <p>음식 이름</p>
        <input placeholder="예: 김치찌개" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />

        <p style={{ marginTop: "20px" }}>카테고리</p>
        <input placeholder="한식 / 양식 / 면" style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)} />

        <p style={{ marginTop: "20px" }}>재료</p>
        <textarea placeholder="김치, 두부, 돼지고기" style={textareaStyle} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />

        <p style={{ marginTop: "20px" }}>음식 사진</p>
        <label
  style={{
    display: "block",
    marginTop: "10px",
    background: "#fafafa",
    border: "2px dashed #ddd",
    borderRadius: "18px",
    padding: "24px",
    textAlign: "center",
    cursor: "pointer",
  }}
>
  <input
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
      }
    }}
  />

  <div>
    <p
      style={{
        margin: 0,
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      📸 사진 선택하기
    </p>

    <p
      style={{
        marginTop: "8px",
        color: "#888",
        fontSize: "14px",
      }}
    >
      {imageFile
        ? imageFile.name
        : "클릭해서 음식 사진 업로드"}
    </p>
  </div>
</label>

        <p style={{ marginTop: "20px" }}>유튜브 링크</p>
        <input placeholder="https://youtube.com/..." style={inputStyle} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />

        <p style={{ marginTop: "20px" }}>설명</p>
        <textarea placeholder="맛 설명이나 메모" style={textareaStyle} value={description} onChange={(e) => setDescription(e.target.value)} />

        <button onClick={handleAddMenu} style={buttonStyle}>
          {editId ? "메뉴 수정하기" : "메뉴 등록하기"}
        </button>
      </div>
      <BottomNav />
    </main>
  );
}



const pageStyle = {
  padding: "16px",
  paddingBottom: "100px",
  maxWidth: "520px",
  width: "100%",
  boxSizing: "border-box" as const,
  margin: "0 auto",
  background: "linear-gradient(180deg, #fff3df 0%, #fffaf3 45%)",
  minHeight: "100vh",
  fontFamily: "sans-serif",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "900",
  margin: "6px 0 0",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "24px",
  marginTop: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  marginTop: "8px",
  fontSize: "16px",
  boxSizing: "border-box" as const,
};

const textareaStyle = {
  width: "100%",
  minHeight: "120px",
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  marginTop: "8px",
  fontSize: "16px",
  boxSizing: "border-box" as const,
  resize: "none" as const,
};

const buttonStyle = {
  marginTop: "30px",
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "orange",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
};

export default function AddPage() {
  return (
    <Suspense fallback={<div>불러오는 중...</div>}>
      <AddPageContent />
    </Suspense>
  );
}