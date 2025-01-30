import React, { useState, useEffect, useRef } from "react";

export default function ProfilePic({ changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  // Posting image to Cloudinary
  const postDetails = async () => {
    if (!image) return;

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud2");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/cantacloud2/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const result = await res.json();
      console.log("Uploaded Image URL:", result.url);
      setUrl(result.url);
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
    }
  };

  // Saving image to MongoDB
  const postPic = async () => {
    if (!url) return;
    const token = localStorage.getItem("jwt");
    const tokenWithoutQuotes = token.replace(/^"|"$/g, "");
    try {
      const res = await fetch("/uploadProfilePic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
        body: JSON.stringify({ pic: url }),
      });
      const data = await res.json();
      console.log("Backend Response:", data);
      changeprofile(); // Update parent state
    } catch (err) {
      console.error("MongoDB Upload Error:", err);
    }
  };

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image]);

  useEffect(() => {
    if (url) {
      console.log("Sending URL to backend:", url);
      postPic();
    }
  }, [url]);

  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={() => hiddenFileInput.current.click()}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className="upload-btn" style={{ color: "#ED4956" }}>
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeprofile}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
