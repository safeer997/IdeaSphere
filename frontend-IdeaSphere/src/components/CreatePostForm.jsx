import { useState } from 'react';
import { createPost as createPostApi } from '../api/postApi.js';
import styles from './CreatePostForm.module.css';

const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await createPostApi(content, media);
    if (res.success) {
      onPostCreated(res.data); // notify parent to prepend post
      setContent('');
      setMedia(null);
      setError(null);
    } else {
      setError(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.postForm}>
      <textarea
        placeholder="What's happening?"
        maxLength={280}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type='file'
        accept='image/*,video/*,gif/*'
        onChange={(e) => setMedia(e.target.files[0])}
      />
      <button type='submit'>Post</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default CreatePostForm;
