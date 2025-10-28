import { useState } from 'react';
import styles from './PostCard.module.css';

const PostCard = ({ post, onLike, onReply, onRetweet }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    if (onLike) onLike(post._id, !liked);
  };

  const handleReply = () => {
    if (onReply) onReply(post._id);
  };

  const handleRetweet = () => {
    if (onRetweet) onRetweet(post._id);
  };

  // Format date
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
      {/* Post Header */}
      <div className={styles.postHeader}>
        <img src={post.user?.avatar} alt="avatar" className={styles.avatar} />
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

      {/* Post Content */}
      <p className={styles.content}>{post.content}</p>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className={styles.mediaContainer}>
          {post.media.map((media, index) => (
            <img
              key={index}
              src={media.url}
              alt="post-media"
              className={styles.postMedia}
            />
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className={styles.stats}>
        <span>{post.viewsCount || 0} Views</span>
        <span>{post.retweetsCount || 0} Retweets</span>
        <span>{post.repliesCount || 0} Replies</span>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.replyButton}`}
          onClick={handleReply}
          title="Reply"
        >
          <span className={styles.icon}>💬</span>
          <span className={styles.count}>{post.repliesCount || 0}</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.retweetButton}`}
          onClick={handleRetweet}
          title="Retweet"
        >
          <span className={styles.icon}>🔄</span>
          <span className={styles.count}>{post.retweetsCount || 0}</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.likeButton} ${
            liked ? styles.liked : ''
          }`}
          onClick={handleLike}
          title="Like"
        >
          <span className={styles.icon}>{liked ? '❤️' : '🤍'}</span>
          <span className={styles.count}>{likesCount}</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.shareButton}`}
          title="Share"
        >
          <span className={styles.icon}>📤</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
