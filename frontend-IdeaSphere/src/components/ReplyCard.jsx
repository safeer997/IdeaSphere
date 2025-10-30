import { useState } from 'react';
import { likePost, unlikePost } from '../api/likeApi.js';
import styles from './ReplyCard.module.css';

const ReplyCard = ({ reply, originalPostUsername }) => {
  const [liked, setLiked] = useState(reply.liked || false);
  const [likesCount, setLikesCount] = useState(reply.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState(null);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    setError(null);

    const previousLiked = liked;
    const previousCount = likesCount;
    
    const newLiked = !liked;
    const newCount = liked ? likesCount - 1 : likesCount + 1;

    setLiked(newLiked);
    setLikesCount(newCount);

    try {
      const res = previousLiked ? await unlikePost(reply._id) : await likePost(reply._id);

      if (!res.success) {
        setLiked(previousLiked);
        setLikesCount(previousCount);
        setError(res.message);
      }
    } catch (err) {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      setError('Something went wrong');
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const replyDate = new Date(date);
    const diffMs = now - replyDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return replyDate.toLocaleDateString();
  };

  return (
    <div className={styles.replyCard}>
      {/* Reply Header */}
      <div className={styles.replyHeader}>
        <img 
          src={reply.user?.avatar} 
          alt="avatar" 
          className={styles.avatar} 
        />
        <div className={styles.replyMeta}>
          <div className={styles.nameRow}>
            <strong className={styles.username}>
              {reply.user?.username}
            </strong>
            {reply.user?.isVerified && (
              <span className={styles.verified}>✔</span>
            )}
            <span className={styles.timestamp}>
              {formatDate(reply.createdAt)}
            </span>
          </div>
          <p className={styles.replyingTo}>
            Replying to <strong>@{originalPostUsername}</strong>
          </p>
        </div>
      </div>

      {/* Reply Content */}
      <p className={styles.content}>{reply.content}</p>

      {/* Reply Media */}
      {reply.media && reply.media.length > 0 && (
        <div className={styles.mediaContainer}>
          {reply.media.map((media, index) => (
            <img
              key={index}
              src={media.url}
              alt="reply-media"
              className={styles.media}
            />
          ))}
        </div>
      )}

      {/* Reply Actions */}
      <div className={styles.replyActions}>
        <button
          className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
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

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ReplyCard;
