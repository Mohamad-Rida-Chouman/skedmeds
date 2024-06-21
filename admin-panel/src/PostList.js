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
import { app } from "./firebase";
import PostForm from "./PostForm";
import Modal from "./Modal";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editPostId, setEditPostId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [postImages, setPostImages] = useState({});

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        imageUrl: doc.data().imageUrl || "", // Set default empty string for imageUrl
      }));
      setPosts(postData);
      setIsLoading(false);

      // Update medicineImages state with image URLs
      const newPostImages = {};
      postData.forEach((post) => {
        newPostImages[post.id] = post.imageUrl;
      });
      setPostImages(newPostImages);
    });

    return () => unsubscribe();
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
    setEditPostId(id);
  };

  const handleAddPost = async (post) => {
    try {
      await addDoc(collection(db, "posts"), post);
      console.log("Post added");
      setEditPostId(null);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleUpdatePost = async (post) => {
    if (!post.id) {
      console.error("Error: Missing post ID for update");
      return;
    }
    const postDocRef = doc(collection(db, "posts"), post.id);
    try {
      await updateDoc(postDocRef, post);
      console.log("Post updated");
      setEditPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#f0f8ff",
      padding: 20,
      borderRadius: 5,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    },
    button: {
      backgroundColor: "#e0e8f0",
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      margin: 5,
    },
    addButton: {
      backgroundColor: "#a5d6a7",
      color: "#fff",
      marginBottom: 15,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      padding: 10,
      backgroundColor: "#e0e8f0",
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
      backgroundColor: "#ffc107",
      color: "#fff",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
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
          <PostForm onSubmit={handleAddPost} />
        </Modal>
      )}

      {editPostId && (
        <Modal onClose={() => setEditPostId(null)}>
          <PostForm
            isEdit={true}
            postId={editPostId}
            post={posts.find((post) => post.id === editPostId)}
            onSubmit={handleUpdatePost}
          />
        </Modal>
      )}
      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Image</th>
              <th style={styles.tableHeader}>Title</th>
              <th style={styles.tableHeader}>Content</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="tableData">
                  {postImages[post.id] && (
                    <div className="tableDataImage">
                      <img src={postImages[post.id]} alt={post.name} />
                    </div>
                  )}
                </td>
                <td style={styles.tableData}>{post.title}</td>
                <td style={styles.tableData}>{post.content}</td>
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
