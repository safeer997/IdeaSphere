import { useState } from 'react';
import { likePost, unlikePost } from '../api/likeApi.js';
import styles from './PostCard.module.css';

const PostCard = ({ post, onLike, onReply, onRetweet }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState(null);

  const handleLike = async () => {
    if (isLiking) {
      return;
    }
    setIsLiking(true);
    setError(null);

    const previousLiked = liked;
    const previousCount = likesCount;

    const newLiked = !liked;
    const newCount = liked ? likesCount - 1 : likesCount + 1;

    // Optimistic update
    setLiked(newLiked);
    setLikesCount(newCount);

    try {
      const res = previousLiked
        ? await unlikePost(post._id)
        : await likePost(post._id);

      if (res.success) {
        console.log('Like/Unlike successful:', res.message);
        // Notify parent with postId, liked status, and new count
        if (onLike) onLike(post._id, newLiked, newCount);
      } else {
        // Revert on error
        setLiked(previousLiked);
        setLikesCount(previousCount);
        setError(res.message);
        console.error('Like error:', res.message);
      }
    } catch (err) {
      // Revert on error
      setLiked(previousLiked);
      setLikesCount(previousCount);
      setError('Something went wrong');
      console.error('Like request failed:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = () => {
    if (onReply) onReply(post._id);
  };

  const handleRetweet = () => {
    if (onRetweet) onRetweet(post._id);
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <img src={post.user?.avatar} alt='avatar' className={styles.avatar} />
        <div className={styles.userInfo}>
          <div className={styles.nameRow}>
            <strong className={styles.username}>{post.user?.username}</strong>
            {post.user?.isVerified && (
              <span className={styles.verified}>✔</span>
            )}
            <span className={styles.timestamp}>
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <p className={styles.content}>{post.content}</p>

      {post.media && post.media.length > 0 && (
        <div className={styles.mediaContainer}>
          {post.media.map((media, index) => (
            <img
              key={index}
              src={media.url}
              alt='post-media'
              className={styles.postMedia}
            />
          ))}
        </div>
      )}

      <div className={styles.stats}>
        <span>{post.viewsCount || 0} Views</span>
        <span>{post.retweetsCount || 0} Retweets</span>
        <span>{post.repliesCount || 0} Replies</span>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.replyButton}`}
          onClick={handleReply}
          disabled={isLiking}
          title='Reply'
        >
          <span className={styles.icon}>💬</span>
          <span className={styles.count}>{post.repliesCount || 0}</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.retweetButton}`}
          onClick={handleRetweet}
          disabled={isLiking}
          title='Retweet'
        >
          <span className={styles.icon}>🔄</span>
          <span className={styles.count}>{post.retweetsCount || 0}</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.likeButton} ${
            liked ? styles.liked : ''
          }`}
          onClick={handleLike}
          disabled={isLiking}
          title={liked ? 'Unlike' : 'Like'}
        >
          <span className={`${styles.icon} ${isLiking ? styles.spinning : ''}`}>
            {liked ? '❤️' : '🤍'}
          </span>
          <span className={styles.count}>{likesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
