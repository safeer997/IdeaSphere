import { useState } from 'react';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileTabs from '../../components/ProfileTabs';
import PostFeed from '../../components/PostFeed';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockUser = {
    username: "Safeer alam",
    avatar: "https://i.pravatar.cc/150?img=12",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    bio: "Full Stack Developer | Building IdeaSphere | JS & Privacy enthusiast",
    location: "Delhi, India",
    website: "https://ideasphere.app",
    isVerified: true,
    followersCount: 1204,
    followingCount: 540,
    postsCount: 105,
    createdAt: "2024-03-15T10:30:00.000Z"
  };

  const isOwnProfile = false;
  const userId = '123';

  // Mock data function (replace with real API later)
  const fetchProfileFeed = async (userId, activeTab) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockPosts = {
      posts: [
        {
          _id: '1',
          user: { _id: userId, username: 'safeer_dev', avatar: 'https://i.pravatar.cc/150?img=12', isVerified: true },
          content: '🚀 Just launched dark mode UI!',
          media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' }],
          likesCount: 156,
          repliesCount: 23,
          retweetsCount: 45,
          viewsCount: 1240,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          liked: false,
        }
      ],
      replies: [],
      media: [],
      likes: []
    };

    return mockPosts[activeTab] || [];
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <ProfileHeader user={mockUser} isOwnProfile={isOwnProfile} />
      <ProfileTabs onTabChange={handleTabChange} />
      <PostFeed 
        activeTab={activeTab}
        userId={userId}
        fetchFeedData={fetchProfileFeed}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ProfilePage;
