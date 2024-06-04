import React, { useState, useRef } from "react";

const PostForm = ({ postId, post, isEdit, onSubmit }) => {
  const [title, setTitle] = useState(post ? post.title : ""); // Pre-fill for edit
  const [content, setContent] = useState(post ? post.content : ""); // Pre-fill for edit
  // const buttonRef = useRef(null); // Reference for button hover effect

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      content,
    };

    if (isEdit) {
      postData.id = post.id; // Include id for update
    }

    onSubmit(postData); // Call onSubmit with updated data

    // Clear form after submission (optional)
    setTitle("");
    setContent("");
  };

  const buttonRef = useRef(null); // Reference for button hover effect

  const formStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Center elements horizontally
      justifyContent: "center", // Center elements vertically (within modal)
      padding: 20,
    },
    label: {
      marginBottom: 5, // Add some margin below labels
    },
    input: {
      marginBottom: 15, // Add some margin below inputs
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 5,
    },
    descriptionInput: {
      height: 100, // Adjust height as needed
      resize: "none", // Prevent textarea resizing
    },
    button: {
      backgroundColor: "#e0e8f0", // Light gray button background
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      marginTop: 15, // Add margin above button
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
