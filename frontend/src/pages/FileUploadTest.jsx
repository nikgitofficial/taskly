// StudentUpload.jsx
import React, { useState } from "react";
import axios from "axios";

const StudentUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const token = localStorage.getItem("token"); // or your auth context

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // field name MUST match `upload.single("file")`
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("date", date);

    try {
      const res = await axios.post("http://localhost:5000/api/student-entry", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT manually set Content-Type
        },
      });

      console.log("✅ Upload successful", res.data);
      alert("Upload successful!");
    } catch (error) {
      console.error("❌ Upload failed", error.response?.data || error.message);
      alert("Upload failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default StudentUpload;
