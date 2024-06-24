import React, { useState, useRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import { app } from "../firebase";

const PostForm = ({ postId, post, isEdit, onSubmit }) => {
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [image, setImage] = useState(null);

  const handleChangeImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      content,
    };

    if (isEdit) {
      postData.id = post.id;
    }

    if (image) {
      const storageRef = ref(getStorage(app), `posts/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      postData.imageUrl = imageUrl;
    }

    onSubmit(postData);

    setTitle("");
    setContent("");
    setImage(null);
  };

  const buttonRef = useRef(null);

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>{isEdit ? "Edit post" : "Add post"}</h2>
      <label className="label" htmlFor="title">
        Title:
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="input"
      />
      <label className="label" htmlFor="content">
        Content:
      </label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="input contentInput"
      />
      <label className="label" htmlFor="image">
        Image:
      </label>
      <input
        type="file"
        id="image"
        onChange={handleChangeImage}
        className="input"
      />

      <button type="submit" ref={buttonRef} className="button">
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default PostForm;
