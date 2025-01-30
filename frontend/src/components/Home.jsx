import { React, useEffect, useState } from 'react'
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const Home = () => {
  const [data, setData] = useState([]);
   const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [item, setItem] = useState([]);
   const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
useEffect(() => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    console.log("No token found. Redirecting to login...");
    window.location.href = "/signin"; // Redirect to login if no token
    return;
  }

  const tokenWithoutQuotes = token.replace(/^"|"$/g, ""); // Remove extra quotes if present

  fetch("/allposts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenWithoutQuotes}`,
    },
  })
    .then((res) => {
      if (res.status === 401) {
        console.log("Session expired. Redirecting to login...");
        localStorage.removeItem("jwt"); // Remove expired token
        window.location.href = "/signin"; // Redirect to login page
        return null;
      }
      return res.json();
    })
    .then((result) => {
      if (result && result.posts) {
        console.log(result.posts);
        setData(result.posts);
      }
    })
    .catch((err) => console.log("Fetch error: ", err));
}, []);

  const likePost = (id) => { 
    const token = localStorage.getItem("jwt");
    const tokenWithoutQuotes = token.replace(/^"|"$/g, "");
    // console.log("token without qutes"+ tokenWithoutQuotes);
    fetch('/like', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenWithoutQuotes}`  // Remove unnecessary JSON.stringify
      },
      body: JSON.stringify({
        postId: id
      })
    })
    .then(res => res.json())
      .then(result => {
        const newdata = data.map((post) => {
          if (post._id == result._id) {
            return result;

          } else {
            return post;
          }
          
        })
        setData(newdata);
      // console.log("Stored Token:", localStorage.getItem('jwt'));

      console.log("Response:", result);
    })
    .catch(err => console.log("Error in like post: " + err));
};

const unlikePost = (id) => { 
    const token = localStorage.getItem("jwt");
    const tokenWithoutQuotes = token.replace(/^"|"$/g, "");
    // console.log("token without qutes"+ tokenWithoutQuotes);
    fetch('/unlike', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenWithoutQuotes}`  // Remove unnecessary JSON.stringify
      },
      body: JSON.stringify({
        postId: id
      })
    })
    .then(res => res.json())
    .then(result => {
      const newdata = data.map((post) => {
          if (post._id == result._id) {
            return result;

          } else {
            return post;
          }
          
        })
        setData(newdata);
      console.log("Response:", result);
    })
    .catch(err => console.log("Error in like post: " + err));
  };

   const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
     setItem(posts);
    }
  };
  const makeComment = (text,id) => {
    const token = localStorage.getItem("jwt");
    const tokenWithoutQuotes = token.replace(/^"|"$/g, "");
    // console.log("token without qutes"+ tokenWithoutQuotes);
    fetch('/comment', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenWithoutQuotes}`  // Remove unnecessary JSON.stringify
      },
      body: JSON.stringify({
        text:text,
        postId: id
      })
    })
    .then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("Comment posted");
        console.log(result);
      })
    .catch(err => console.log("Error in like post: " + err));
    console.log(comment);
  }


    return (
    <div className="home">
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card">
            {/* card header */}
            <div className="card-header">
              <div className="card-pic">
                <img
                  
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt=""
                  
                />
              </div>
              
              <h5>
                {posts.postedBy ?
                <Link to={`/profile/${posts.postedBy._id}`}>
                  {posts.postedBy.userName}
                </Link>:"unknown"
                }

              </h5>
             
            </div>
            {/* card image */}
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>

            {/* card content */}
            <div className="card-content">
              {posts.likes.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}

              <p>{posts.likes.length} Likes</p>
              <p>{posts.body} </p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all comments
              </p>
            </div>

            {/* add Comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {/* show Comment */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              {/* card header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt=""
                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>

              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.postedBy.name}{" "}
                      </span>
                      <span className="commentText">{comment.comment}</span>
                    </p>
                  );
                })}
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
            <div
              style={{
                position: "relative",
                top:"500px",
              }}
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment close">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
export default Home;