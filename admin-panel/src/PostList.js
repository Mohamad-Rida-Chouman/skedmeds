import React, { useState, useEffect } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebase"; // Import Firebase instance
import PostForm from "./PostForm"; // Import your PostForm component
import Modal from "./Modal"; // Import your Modal component

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [editPostId, setEditPostId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const db = getFirestore(app); // Get Firestore instance

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
      setIsLoading(false); // Set loading state to false after data arrives
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe on unmount
  }, [db]);

  const handleDeletePost = async (id) => {
    const postDocRef = doc(collection(db, "posts"), id);
    try {
      await deleteDoc(postDocRef);
      console.log("Post deleted");
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = (id) => {
    setEditPostId(id); // Set editPostId when edit button is clicked
  };

  const handleAddPost = async (post) => {
    try {
      await addDoc(collection(db, "posts"), post);
      console.log("Post added");
      setEditPostId(null); // Clear edit state after successful addition
      setIsAddModalOpen(false); // Close add modal after successful addition
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleUpdatePost = async (post) => {
    if (!post.id) {
      console.error("Error: Missing post ID for update");
      return; // Exit the function if postId is missing
    }
    const postDocRef = doc(collection(db, "posts"), post.id);
    try {
      await updateDoc(postDocRef, post);
      console.log("Post updated");
      setEditPostId(null); // Clear edit state after successful update
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#f0f8ff", // Light blue background
      padding: 20,
      borderRadius: 5,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    },
    button: {
      backgroundColor: "#e0e8f0", // Light gray button background
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      margin: 5,
    },
    addButton: {
      backgroundColor: "#a5d6a7", // Light green button for adding
      color: "#fff", // White text
      marginBottom: 15,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      padding: 10,
      backgroundColor: "#e0e8f0", // Light gray header background
      fontWeight: "bold",
    },
    tableData: {
      padding: 10,
      border: "1px solid #ddd",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
    },
    editButton: {
      backgroundColor: "#ffc107", // Light orange button for editing
      color: "#fff", // White text
    },
    deleteButton: {
      backgroundColor: "#dc3545", // Light red button for deleting
      color: "#fff", // White text
    },
  };

  return (
    <div style={styles.container}>
      <h2>Posts</h2>
      <button
        style={{ ...styles.button, ...styles.addButton }}
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Post
      </button>
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <PostForm onSubmit={handleAddPost} /> {/* Pass PostForm */}
        </Modal>
      )}

      {editPostId && ( // Check if editPostId has a value (edit button clicked)
        <Modal onClose={() => setEditPostId(null)}>
          {" "}
          {/* Close modal on close */}
          <PostForm
            isEdit={true} // Set isEdit prop to true for edit functionality
            postId={editPostId}
            post={posts.find((post) => post.id === editPostId)} // Find Post to edit
            onSubmit={handleUpdatePost} // Pass handleUpdatePost for editing
          />
        </Modal>
      )}
      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              {/* Adjust headers based on your post data model */}
              <th style={styles.tableHeader}>Title</th>
              <th style={styles.tableHeader}>Content</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                {/* Render post data in table cells */}
                <td style={styles.tableData}>{post.title}</td>
                <td style={styles.tableData}>{post.content}</td>{" "}
                {/* Show excerpt */}
                {/* Render post data in table cells */}
                <td style={styles.tableData}>
                  <div style={styles.actions}>
                    <button
                      style={{ ...styles.button, ...styles.editButton }}
                      onClick={() => handleEditPost(post.id)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.deleteButton }}
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PostList;
