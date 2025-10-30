import { useState } from 'react';
import { likePost, unlikePost } from '../api/likeApi.js';
import { getPostReplies } from '../api/replyApi.js';
import ReplyForm from './ReplyForm.jsx';
import ReplyCard from './ReplyCard.jsx';
import styles from './PostCard.module.css';

const PostCard = ({ post, onLike, onReply, onRetweet }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [repliesCount, setRepliesCount] = useState(post.repliesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState(null);
  
  // Replies section
  const [showRepliesSection, setShowRepliesSection] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

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
      const res = previousLiked ? await unlikePost(post._id) : await likePost(post._id);

      if (res.success) {
        if (onLike) onLike(post._id, newLiked, newCount);
      } else {
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

  const toggleRepliesSection = async () => {
    console.log('toggleRepliesSection called, current state:', showRepliesSection);
    
    if (showRepliesSection) {
      // Close the section
      console.log('Closing replies section');
      setShowRepliesSection(false);
    } else {
      // Open the section
      console.log('Opening replies section');
      setShowRepliesSection(true);
      
      // Load replies if not already loaded
      if (!repliesLoaded) {
        console.log('Loading replies for post:', post._id);
        setLoadingReplies(true);
        try {
          const res = await getPostReplies(post._id, 1, 100);
          console.log('Replies response:', res);
          
          if (res.success) {
            console.log('Raw replies data:', res.data);
            console.log('Replies count:', res.data.length);
            
            // Sort replies by newest first
            const sortedReplies = res.data.sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            console.log('Sorted replies:', sortedReplies);
            console.log('Setting replies state with:', sortedReplies.length, 'items');
            
            setReplies(sortedReplies);
            setRepliesLoaded(true);
          } else {
            console.error('Failed to fetch replies:', res.message);
          }
        } catch (err) {
          console.error('Failed to load replies:', err);
        } finally {
          setLoadingReplies(false);
        }
      } else {
        console.log('Replies already loaded, count:', replies.length);
      }
    }
  };

  const handleReplyCreated = (newReply) => {
    console.log('New reply created:', newReply);
    setReplies([newReply, ...replies]);
    setRepliesCount(repliesCount + 1);
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

  console.log('PostCard render - showRepliesSection:', showRepliesSection, 'replies:', replies.length, 'loading:', loadingReplies);

  return (
    <div className={styles.postContainer}>
      {/* Main Post */}
      <div className={styles.postCard}>
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

        <p className={styles.content}>{post.content}</p>

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

        <div className={styles.stats}>
          <span>{post.viewsCount || 0} Views</span>
          <span>{post.retweetsCount || 0} Retweets</span>
          <span 
            className={styles.repliesLink} 
            onClick={toggleRepliesSection}
          >
            {repliesCount || 0} {repliesCount === 1 ? 'Reply' : 'Replies'}
          </span>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${styles.replyButton} ${
              showRepliesSection ? styles.active : ''
            }`}
            onClick={toggleRepliesSection}
            disabled={isLiking}
            title="Reply"
          >
            <span className={styles.icon}>💬</span>
            <span className={styles.count}>{repliesCount || 0}</span>
          </button>

          <button
            className={`${styles.actionButton} ${styles.retweetButton}`}
            onClick={handleRetweet}
            disabled={isLiking}
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
            disabled={isLiking}
            title={liked ? 'Unlike' : 'Like'}
          >
            <span className={`${styles.icon} ${isLiking ? styles.spinning : ''}`}>
              {liked ? '❤️' : '🤍'}
            </span>
            <span className={styles.count}>{likesCount}</span>
          </button>

          <button
            className={`${styles.actionButton} ${styles.shareButton}`}
            disabled={isLiking}
            title="Share"
          >
            <span className={styles.icon}>📤</span>
          </button>
        </div>
      </div>

      {/* Replies Section - Reply Form FIRST, then Replies */}
      {showRepliesSection && (
        <div className={styles.repliesContainer}>
          {/* Reply Form */}
          <div className={styles.replyFormSection}>
            <ReplyForm
              postId={post._id}
              onReplyCreated={handleReplyCreated}
              onCancel={() => setShowRepliesSection(false)}
              hideCancel={true}
            />
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Replies List */}
          <div className={styles.repliesListContainer}>
            {loadingReplies ? (
              <div className={styles.loadingReplies}>
                <div className={styles.spinner}></div>
                <p>Loading replies...</p>
              </div>
            ) : replies && replies.length > 0 ? (
              <div className={styles.repliesList}>
                {replies.map((reply) => {
                  console.log('Rendering reply:', reply._id, reply.content);
                  return (
                    <div key={reply._id} className={styles.replyItem}>
                      <ReplyCard
                        reply={reply}
                        originalPostUsername={post.user?.username}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noReplies}>
                <p>No replies yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
