import { useState } from 'react';
import styles from './ProfileTabs.module.css';

const ProfileTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'replies', label: 'Replies' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Underline indicator that follows active tab */}
      <div 
        className={styles.activeIndicator}
        style={{ left: `${tabs.findIndex(t => t.id === activeTab) * 25}%` }}
      />
    </div>
  );
};

export default ProfileTabs;
