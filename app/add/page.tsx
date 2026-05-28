"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function AddPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddMenu = async () => {
    let imageUrl = "";

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("이미지 업로드 실패 😢");
        return;
      }

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("menus").insert([
      {
        name,
        category,
        ingredients,
        youtube_url: youtubeUrl,
        description,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      alert("저장 실패 😢");
      console.log(error);
    } else {
      alert("메뉴 등록 완료 🍽");
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
      <h1 style={titleStyle}>➕ 메뉴 추가</h1>

      <div style={cardStyle}>
        <p>음식 이름</p>
        <input placeholder="예: 김치찌개" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />

        <p style={{ marginTop: "20px" }}>카테고리</p>
        <input placeholder="한식 / 양식 / 면" style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)} />

        <p style={{ marginTop: "20px" }}>재료</p>
        <textarea placeholder="김치, 두부, 돼지고기" style={textareaStyle} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />

        <p style={{ marginTop: "20px" }}>음식 사진</p>
        <input type="file" accept="image/*" onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
          }
        }} />

        <p style={{ marginTop: "20px" }}>유튜브 링크</p>
        <input placeholder="https://youtube.com/..." style={inputStyle} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />

        <p style={{ marginTop: "20px" }}>설명</p>
        <textarea placeholder="맛 설명이나 메모" style={textareaStyle} value={description} onChange={(e) => setDescription(e.target.value)} />

        <button onClick={handleAddMenu} style={buttonStyle}>
          메뉴 등록하기
        </button>
      </div>
    </main>
  );
}

const pageStyle = {
  padding: "20px",
  maxWidth: "430px",
  margin: "0 auto",
  background: "#fffaf3",
  minHeight: "100vh",
  fontFamily: "sans-serif",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
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