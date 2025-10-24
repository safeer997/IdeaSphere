import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, performLogout } from '../../features/authSlice.js';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn, loading } = useSelector((state) => state.auth);

  console.log('user details : ', user);

  // Fetch current user on mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Redirect to landing page if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/');
    }
  }, [loading, isLoggedIn, navigate]);

  const handleLogout = () => {
    dispatch(performLogout());
    navigate('/');
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Welcome, {user?.username || user?.email}</h1>
      <p>This is your personal dashboard.</p>
      <button onClick={handleLogout} className={styles.button}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
