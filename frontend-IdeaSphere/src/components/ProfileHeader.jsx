import styles from './ProfileHeader.module.css';

const ProfileHeader = ({ user, isOwnProfile }) => {
  return (
    <div className={styles.profileHeader}>
      {/* Cover Image Section */}
      <div className={styles.coverContainer}>
        <img 
          src={user.coverImage || '/default-cover.jpg'} 
          alt="Cover" 
          className={styles.coverImage} 
        />
        {/* Avatar overlapping cover */}
        <img
          src={user.avatar || '/default-avatar.jpg'}
          alt={user.username}
          className={styles.avatar}
        />
      </div>

      {/* User Info Section */}
      <div className={styles.infoSection}>
        {/* Name and Verified Badge */}
        <div className={styles.nameRow}>
          <h1 className={styles.name}>{user.username}</h1>
          {user.isVerified && (
            <span className={styles.verified} title="Verified">✔</span>
          )}
        </div>

        {/* Bio */}
        {user.bio && <p className={styles.bio}>{user.bio}</p>}

        {/* Meta Info: Location, Website, Join Date */}
        <div className={styles.meta}>
          {user.location && (
            <span className={styles.metaItem}>
              📍 {user.location}
            </span>
          )}
          {user.website && (
            <span className={styles.metaItem}>
              🔗 <a href={user.website} target="_blank" rel="noopener noreferrer">
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </span>
          )}
          {user.createdAt && (
            <span className={styles.metaItem}>
              📅 Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Stats: Followers, Following, Posts */}
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <strong>{user.followingCount}</strong> Following
          </span>
          <span className={styles.statItem}>
            <strong>{user.followersCount}</strong> Followers
          </span>
          <span className={styles.statItem}>
            <strong>{user.postsCount}</strong> Posts
          </span>
        </div>

        {/* Action Button: Follow or Edit Profile */}
        <div className={styles.actions}>
          {isOwnProfile ? (
            <button className={styles.editButton}>Edit Profile</button>
          ) : (
            <button className={styles.followButton}>Follow</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
