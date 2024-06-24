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
import { app } from "../firebase";
import PostForm from "../postForm/PostForm";
import "./postList.css";
import Modal from "../modal/Modal";

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

  return (
    <div className="container">
      <h2>Posts</h2>
      <button
        className="button addButton"
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
        <table className="table">
          <thead>
            <tr>
              <th className="tableHeader">Image</th>
              <th className="tableHeader">Title</th>
              <th className="tableHeader">Content</th>
              <th className="tableHeader">Actions</th>
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
                <td className="tableData">{post.title}</td>
                <td className="tableData">{post.content}</td>
                <td className="tableData">
                  <div className="actions">
                    <button
                      className="button editButton"
                      onClick={() => handleEditPost(post.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="button deleteButton"
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
