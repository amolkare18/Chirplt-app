import { React, useState,useEffect } from 'react'
import './Createpost.css';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Createpost = () => {
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState("")
   const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)
   const navigate = useNavigate()
  
  useEffect(() => {

    // saving post to mongodb
    if (url) {
      const token = localStorage.getItem('jwt');
      const tokenWithoutQuotes = token ? token.replace(/^"|"$/g, "") : "";

      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization":  `Bearer ${tokenWithoutQuotes}`
        },
        body: JSON.stringify({
          body,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            notifyA(data.error)
          } else {
            notifyB("Successfully Posted")
            navigate("/")
          }
        })
        .catch(err => console.log(err))
    }

  }, [url])

  const postDetails = () => {

    console.log(body, image)
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "insta-clone")
    data.append("cloud_name", "cantacloud2")
    fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json())
      .then(data => setUrl(data.url))
      .catch(err => console.log(err))


  }

    const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };
  return (
      <div className='createPost'>
          
          <div className='post-header'>
              <h4>create a new post</h4>
        <button id='post-btn' onClick={() => {
          postDetails();
              }}>share</button>
          </div>
          <div className='main-div'>
               <img
          id="output"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
        />
        <input type='file' accept="image/*" onChange={(event) => {
          setImage(event.target.files[0]);
                  loadfile(event);
              }}></input>
          </div>
         <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              alt=""
            />
          </div>
          <h5>Ramesh</h5>
        </div>
              <textarea
                  value={body} onChange={(e) => {
          setBody(e.target.value)
                  }}
                  type="text" placeholder="Write a caption...."></textarea>
      </div>
        
      </div>
  )
}

export default Createpost;