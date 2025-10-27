import PostCard from './PostCard.jsx';
import styles from './PostFeed.module.css';

const PostFeed = ({ posts }) => {
  if (!posts || posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className={styles.feed}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
