import react from 'react';
import styles from './LandingPage.module.css';
import logo from '../../assets/icons/logo.png';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/images/image.png';

function LandingPage() {
  const navigate = useNavigate();
  function handleLogInClick() {
    console.log('Login Button Clicked ');
    navigate('/login');
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.imagepanel}>
          <img src={image}></img>
        </div>
        <div className={styles.signuppanel}>
          <div className={styles.header}>
            <img src={logo}></img>
            <h1>Your Thoughts, Your Space</h1>
            <h3>Join IdeaSphere today</h3>
          </div>
          <div className={styles.buttons}>
            <button className={styles.button}>Sign up with Google</button>
            <button className={styles.button}>Sign up with Github</button>
            <button className={styles.button}>
              Sign up with pjhone or email
            </button>
          </div>
          <div className={styles.footer}>
            <p className={styles.paragraph}>
              Already have an account?
              <span onClick={handleLogInClick}> Log in</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
