import React, { useState, useRef } from "react";

const PostForm = ({ postId, post, isEdit, onSubmit }) => {
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      content,
    };

    if (isEdit) {
      postData.id = post.id;
    }

    onSubmit(postData);

    setTitle("");
    setContent("");
  };

  const buttonRef = useRef(null);

  const formStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    label: {
      marginBottom: 5,
    },
    input: {
      marginBottom: 15,
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 5,
    },
    descriptionInput: {
      height: 100,
      resize: "none",
    },
    button: {
      backgroundColor: "#e0e8f0",
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      marginTop: 15,
    },
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h2>{isEdit ? "Edit post" : "Add post"}</h2>
      <label style={formStyles.label} htmlFor="title">
        Title:
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={formStyles.input}
      />
      <label style={formStyles.label} htmlFor="content">
        Content:
      </label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ ...formStyles.input, ...formStyles.contentInput }}
      />

      <button type="submit" ref={buttonRef} style={formStyles.button}>
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default PostForm;
