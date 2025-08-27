import React from 'react';
import styles from './Signup.module.css';
import logo from '../assets/icons/logo.png';
import { useState } from 'react';

function Signup({ setSignupOptions, setIsLoggingIn ,setIsSigningUp }) {
  const [useEmail, setUseEmail] = useState(false);

  function handleUseEmailClick() {
    setUseEmail(!useEmail);
  }

  function handleAlreadyHaveAnAccount() {
    setSignupOptions(true);
    setIsLoggingIn(false);
    setIsSigningUp(false)
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo}>
          <img className={styles.logoImg} src={logo} alt='Logo' />
        </div>
        <div className={styles.form}>
          <h1>Create an account</h1>
          <div className={styles.inputbox}>
            <input type='text' placeholder='Name' />
            <input
              type='text'
              placeholder={useEmail ? 'Email' : 'Phone number'}
            />
          </div>
          <span className={styles.span} onClick={handleUseEmailClick}>
            {useEmail ? 'Use phone number' : 'Use email'}
          </span>
          <button>Next</button>
          <span className={styles.span} onClick={handleAlreadyHaveAnAccount}>
            Already have an account ?
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
