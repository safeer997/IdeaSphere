import react from 'react';
import styles from './LandingPage.module.css';
import logo from '../../assets/icons/logo.png';
import image from '../../assets/images/image.png';
import Login from '../../components/Login.jsx';
import Signup from '../../components/Signup.jsx';
import { useState } from 'react';

function LandingPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupOptions, setSignupOptions] = useState(true);

  function handleLogInClick() {
    setIsLoggingIn(true);
    setSignupOptions(false);
  }
  function handleSignupClick() {
    setIsSigningUp(true);
    setSignupOptions(false);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.imagepanel}>
          <img src={image}></img>
        </div>
        {signupOptions && (
          <div className={styles.signuppanel}>
            <div className={styles.header}>
              <img src={logo}></img>
              <h1>Your Thoughts, Your Space</h1>
              <h3>Join IdeaSphere today</h3>
            </div>
            <div className={styles.buttons}>
              <button className={styles.button}>Sign up with Google</button>
              <button className={styles.button}>Sign up with Github</button>
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
    </>
  );
}

export default LandingPage;
