import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, performLogout } from '../../features/authSlice.js';
import { getPosts } from '../../api/postApi.js';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../../components/CreatePostForm.jsx';
import PostFeed from '../../components/PostFeed.jsx';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    loading: authLoading,
  } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchUser());
    loadPosts();
  }, [dispatch]);

  const loadPosts = async () => {
    setLoading(true);
    const res = await getPosts();
    // console.log("data fetched by get posts: ", res);
    if (res.success) {
      setPosts(res.data);
      setError(null);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isLoggedIn) navigate('/');
  }, [authLoading, isLoggedIn, navigate]);

  const handleLogout = () => {
    dispatch(performLogout());
    navigate('/');
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Handle like updates from PostFeed
  const handlePostsUpdate = (postId, liked, newCount) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { ...post, liked, likesCount: newCount }
          : post
      )
    );
  };

  if (authLoading || loading)
    return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Welcome, {user?.username || user?.email}</h1>
      <button onClick={handleLogout} className={styles.button}>
        Logout
      </button>

      <CreatePostForm onPostCreated={handlePostCreated} />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <PostFeed 
        posts={posts} 
        onPostsUpdate={handlePostsUpdate} 
      />
    </div>
  );
};

export default Dashboard;
