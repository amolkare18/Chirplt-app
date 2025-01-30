import React, { useState, useEffect } from "react";
import "./Profile.css";
import ProfilePic from "./ProfilePic";

const Profile = () => {
  const [pic, setPic] = useState([]);
  const [changePic, setChangePic] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  // Retrieve token safely
  const token = localStorage.getItem("jwt")?.replace(/^"|"$/g, "");

  // Toggle profile picture change
  const changeprofile = () => {
    setChangePic(!changePic);
  };

  // Update user profile after image upload
  const updateUserProfile = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user"));
    if (updatedUser) {
      setUser(updatedUser); // Update the user state with the new profile picture
    }
  };

  useEffect(() => {
    if (!token) return;

    fetch("/myposts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Fetched data:", result);
        if (result.myposts && Array.isArray(result.myposts)) {
          setPic(result.myposts);
        } else {
          console.error("myposts is not an array:", result);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [token]);

  useEffect(() => {
    console.log("Updated pic state:", pic);
  }, [pic]);

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
          <img
            onClick={changeprofile}
            src={user.photo || picLink} // Use user photo or default image
            alt="Profile"
            className="clickable-img"
          />
        </div>
        <div className="profile-data">
          <h1>{user.name || "User"}</h1>
          <div className="profile-info">
            <p>{pic.length} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>

      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />

      <div className="gallery">
        {pic.length > 0 ? (
          pic.map((pics) =>
            pics.photo ? (
              <img key={pics._id} src={pics.photo} alt="Post" className="item" />
            ) : null
          )
        ) : (
          <p>No posts available</p>
        )}
      </div>

      {changePic && <ProfilePic changeprofile={changeprofile} updateUserProfile={updateUserProfile} />}
    </div>
  );
};

export default Profile;
