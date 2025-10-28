import { useState, useEffect } from 'react';
import PostCard from './PostCard.jsx';
import styles from './PostFeed.module.css';

// Mock data - move outside component to avoid recreating on each render
const MOCK_POSTS = {
  posts: [
    {
      _id: '1',
      user: {
        _id: '123',
        username: 'safeer alam',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
      },
      content: '🚀 Just launched the new dark mode UI for IdeaSphere!',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        }
      ],
      likesCount: 156,
      repliesCount: 23,
      retweetsCount: 45,
      viewsCount: 1240,
      isReply: false,
      isRetweet: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      liked: false,
    },
    {
      _id: '2',
      user: {
        _id: '123',
        username: 'safeer alam',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
      },
      content: 'JavaScript tip: Always use const by default, let when you need to reassign, avoid var.',
      media: [],
      likesCount: 342,
      repliesCount: 67,
      retweetsCount: 123,
      viewsCount: 5430,
      isReply: false,
      isRetweet: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      liked: false,
    },
    {
      _id: '3',
      user: {
        _id: '123',
        username: 'safeer alam',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
      },
      content: 'Building in public is scary but rewarding. Shoutout to everyone sharing their journey! 🙌',
      media: [],
      likesCount: 89,
      repliesCount: 12,
      retweetsCount: 34,
      viewsCount: 890,
      isReply: false,
      isRetweet: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      liked: true,
    }
  ],
  replies: [
    {
      _id: '101',
      user: {
        _id: '123',
        username: 'safeer alam',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
      },
      content: 'Great article! Adding to my reading list.',
      media: [],
      likesCount: 24,
      repliesCount: 5,
      retweetsCount: 8,
      viewsCount: 240,
      isReply: true,
      parentPost: '999',
      isRetweet: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      liked: false,
    }
  ],
  media: [
    {
      _id: '201',
      user: {
        _id: '123',
        username: 'safeer alam',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
      },
      content: 'New design mockup for IdeaSphere',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        }
      ],
      likesCount: 156,
      repliesCount: 23,
      retweetsCount: 45,
      viewsCount: 1240,
      isReply: false,
      isRetweet: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      liked: false,
    }
  ],
  likes: [
    {
      _id: '301',
      user: {
        _id: 'other_user_id',
        username: 'another_user',
        avatar: 'https://i.pravatar.cc/150?img=5',
        isVerified: false,
      },
      content: 'React hooks are game-changing. Here\'s my complete guide...',
      media: [],
      likesCount: 523,
      repliesCount: 89,
      retweetsCount: 234,
      viewsCount: 5234,
      isReply: false,
      isRetweet: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      liked: true,
    }
  ]
};

const PostFeed = ({ 
  posts = [],
  loading = false,
  error = null,
  onRetry = null,
  activeTab = null,
  userId = null,
  fetchFeedData = null
}) => {
  const [feedPosts, setFeedPosts] = useState(posts);
  const [isLoading, setIsLoading] = useState(loading);
  const [hasError, setHasError] = useState(error);

  useEffect(() => {
    // If fetchFeedData function is provided (ProfilePage use case)
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get mock data based on active tab
      const data = MOCK_POSTS[activeTab] || [];
      setFeedPosts(data);
    } catch (err) {
      setHasError('Failed to load feed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State
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

  // Error State
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

  // Empty State
  if (!feedPosts || feedPosts.length === 0) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.emptyState}>
          <p>No {activeTab} yet</p>
          <span>When you post something, it will show up here.</span>
        </div>
      </div>
    );
  }

  // Render Posts
  return (
    <div className={styles.feed}>
      {feedPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={(postId, liked) => console.log('Like:', postId, liked)}
          onReply={(postId) => console.log('Reply:', postId)}
          onRetweet={(postId) => console.log('Retweet:', postId)}
        />
      ))}
    </div>
  );
};

export default PostFeed;
