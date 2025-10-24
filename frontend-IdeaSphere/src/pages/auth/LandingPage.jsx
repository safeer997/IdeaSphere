import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, performLogout } from '../../features/authSlice.js';
import { useNavigate } from 'react-router-dom';

import styles from './LandingPage.module.css';
import logo from '../../assets/icons/logo.png';
import image from '../../assets/images/image.png';
import Login from '../../components/Login.jsx';
import Signup from '../../components/Signup.jsx';

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupOptions, setSignupOptions] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogInClick = () => {
    setIsLoggingIn(true);
    setSignupOptions(false);
  };

  const handleSignupClick = () => {
    setIsSigningUp(true);
    setSignupOptions(false);
  };

  const handleGoogleSignup = () => {
    window.open('http://localhost:7000/api/v1/auth/google', '_self');
  };

  const handleGithubSignup = () => {
    window.open('http://localhost:7000/api/v1/auth/github', '_self');
  };



  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.imagepanel}>
        <img src={image} alt="Landing" />
      </div>

      {signupOptions && (
        <div className={styles.signuppanel}>
          <div className={styles.header}>
            <img src={logo} alt="Logo" />
            <h1>Your Thoughts, Your Space</h1>
            <h3>Join IdeaSphere today</h3>
          </div>
          <div className={styles.buttons}>
            <button onClick={handleGoogleSignup} className={styles.button}>
              Login with Google
            </button>
            <button onClick={handleGithubSignup} className={styles.button}>
              Login with Github
            </button>
            <button onClick={handleSignupClick} className={styles.button}>
              Sign up with phone or email
            </button>
          </div>
          <div className={styles.footer}>
            <p className={styles.paragraph}>
              Already have an account?
              <span onClick={handleLogInClick}> Log in</span>
            </p>
          </div>
        </div>
      )}

      {isLoggingIn && (
        <div className={styles.signuppanel}>
          <Login
            setSignupOptions={setSignupOptions}
            setIsLoggingIn={setIsLoggingIn}
          />
        </div>
      )}

      {isSigningUp && (
        <div className={styles.signuppanel}>
          <Signup
            setSignupOptions={setSignupOptions}
            setIsLoggingIn={setIsLoggingIn}
            setIsSigningUp={setIsSigningUp}
          />
        </div>
      )}
    </div>
  );
}

export default LandingPage;
