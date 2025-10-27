import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <img src={post.user?.avatar} alt="avatar" className={styles.avatar} />
        <strong>{post.user?.username}</strong>
      </div>
      <p>{post.content}</p>
      {post.media && post.media.length > 0 && (
        <img src={post.media[0].url} alt="media" className={styles.postMedia} />
      )}
    </div>
  );
};

export default PostCard;
