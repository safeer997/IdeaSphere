import { useState, useEffect } from 'react';
import PostCard from './PostCard.jsx';
import { getUserLikes } from '../api/likeApi.js';
import { getUserPosts } from '../api/userApi.js';
import styles from './PostFeed.module.css';

const PostFeed = ({ 
  posts = [],
  loading = false,
  error = null,
  onRetry = null,
  activeTab = null,
  userId = null,
  fetchFeedData = null,
  onPostsUpdate = null
}) => {
  const [feedPosts, setFeedPosts] = useState(posts);
  const [isLoading, setIsLoading] = useState(loading);
  const [hasError, setHasError] = useState(error);

  useEffect(() => {
    // If fetchFeedData function is provided (ProfilePage use case with tabs)
    if (fetchFeedData && userId && activeTab) {
      loadData();
    } else {
      // Otherwise, use passed posts directly (Dashboard use case)
      setFeedPosts(posts);
      setIsLoading(false);
    }
  }, [activeTab, userId, fetchFeedData, posts]);

  const loadData = async () => {
    setIsLoading(true);
    setHasError(null);
    try {
      let res;

      if (activeTab === 'posts') {
        res = await getUserPosts(userId, 1, 20);
      } else if (activeTab === 'replies') {
        res = await getUserPosts(userId, 1, 20);
      } else if (activeTab === 'media') {
        res = await getUserPosts(userId, 1, 20);
      } else if (activeTab === 'likes') {
        res = await getUserLikes(userId, 1, 20);
      }

      if (res.success) {
        setFeedPosts(res.data);
      } else {
        setHasError(res.message || 'Failed to load feed');
      }
    } catch (err) {
      setHasError('Failed to load feed');
      console.error('Feed load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostLikeUpdate = (postId, liked, newCount) => {
    // Update local state
    setFeedPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId 
          ? { ...post, liked, likesCount: newCount }
          : post
      )
    );

    // Notify parent component if callback exists
    if (onPostsUpdate) {
      onPostsUpdate(postId, liked, newCount);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.errorState}>
          <p>{hasError}</p>
          <button 
            onClick={onRetry || loadData} 
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!feedPosts || feedPosts.length === 0) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.emptyState}>
          <p>No {activeTab || 'posts'} yet</p>
          <span>When you post something, it will show up here.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feed}>
      {feedPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={handlePostLikeUpdate}
          onReply={(postId) => console.log('Reply:', postId)}
          onRetweet={(postId) => console.log('Retweet:', postId)}
        />
      ))}
    </div>
  );
};

export default PostFeed;
