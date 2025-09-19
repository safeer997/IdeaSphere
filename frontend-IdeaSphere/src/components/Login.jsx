import react from 'react';
import styles from './Login.module.css';
import logo from '../assets/icons/logo.png';

function Login({ setSignupOptions, setIsLoggingIn }) {
  function handleSignupClick() {
    setIsLoggingIn(false);
    setSignupOptions(true);
  }
  function handleForgotClick() {}

  function handleLogin(){
    
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.formsection}>
          <img src={logo}></img>
          <h1>Log in to IdeaSphere</h1>
          <input type='text' placeholder='Phone number, email address'></input>
          <input type='text' placeholder='Password'></input>
          <button onClick={handleLogin}>Log in</button>
        </div>
        <div className={styles.footer}>
          <span onClick={handleForgotClick}>Forgot password ?</span>
          <span onClick={handleSignupClick}>Sign up to IdeaSphere</span>
        </div>
      </div>
    </>
  );
}

export default Login;
