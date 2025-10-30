import { useState } from 'react';
import { createReply } from '../api/replyApi.js';
import styles from './ReplyForm.module.css';

const ReplyForm = ({ postId, onReplyCreated, onCancel, hideCancel = false }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await createReply(postId, content, media);
      if (res.success) {
        onReplyCreated(res.data);
        setContent('');
        setMedia(null);
        setError(null);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to create reply');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.replyForm} ${styles.slideIn}`}>
      <textarea
        placeholder="What's your reply?"
        maxLength={280}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
        required
        disabled={loading}
      />

      <div className={styles.controls}>
        <input
          type="file"
          accept="image/*,video/*,gif/*"
          onChange={(e) => setMedia(e.target.files[0])}
          id="reply-media-input"
          disabled={loading}
        />
        <label htmlFor="reply-media-input" className={styles.mediaLabel}>
          📷
        </label>
        {media && <span className={styles.mediaName}>{media.name}</span>}
      </div>

      <div className={styles.buttonGroup}>
        {!hideCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !content.trim()}
        >
          {loading ? 'Replying...' : 'Reply'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default ReplyForm;
