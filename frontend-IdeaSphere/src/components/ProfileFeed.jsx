import { useState, useEffect } from 'react';
import PostFeed from './PostFeed';
import styles from './ProfileFeed.module.css';

const ProfileFeed = ({ activeTab, userId }) => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data matching your Post schema structure
  const mockPosts = {
    posts: [
      {
        _id: '1',
        user: {
          _id: userId,
          username: 'safeer_dev',
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
          _id: userId,
          username: 'safeer_dev',
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
          _id: userId,
          username: 'safeer_dev',
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
          _id: userId,
          username: 'safeer_dev',
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
        parentPost: '999', // Reference to original post
        isRetweet: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        liked: false,
      }
    ],
    media: [
      {
        _id: '201',
        user: {
          _id: userId,
          username: 'safeer_dev',
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

  useEffect(() => {
    loadFeedData();
  }, [activeTab, userId]);

  const loadFeedData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // TODO: Replace with actual API calls based on activeTab
      // Example API calls to implement:
      // 
      // if (activeTab === 'posts') {
      //   const res = await fetch(`/api/users/${userId}/posts`);
      //   const data = await res.json();
      //   setFeedData(data.data);
      // } else if (activeTab === 'replies') {
      //   const res = await fetch(`/api/users/${userId}/posts?type=replies`);
      //   const data = await res.json();
      //   setFeedData(data.data);
      // } else if (activeTab === 'media') {
      //   const res = await fetch(`/api/users/${userId}/posts?hasMedia=true`);
      //   const data = await res.json();
      //   setFeedData(data.data);
      // } else if (activeTab === 'likes') {
      //   const res = await fetch(`/api/users/${userId}/likes`);
      //   const data = await res.json();
      //   setFeedData(data.data);
      // }

      // For now, use mock data
      setFeedData(mockPosts[activeTab] || []);
    } catch (err) {
      setError('Failed to load feed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={loadFeedData} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (feedData.length === 0) {
    return (
      <div className={styles.feedContainer}>
        <div className={styles.emptyState}>
          <p>No {activeTab} yet</p>
          <span>When you post or like something, it will show up here.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <PostFeed posts={feedData} />
    </div>
  );
};

export default ProfileFeed;
