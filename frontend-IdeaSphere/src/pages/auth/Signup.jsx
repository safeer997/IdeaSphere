import React from 'react';
import styles from './Signup.module.css';
import logo from '../../assets/icons/logo.png';
import { useState } from 'react';

function Signup() {
  const [useEmail, setUseEmail] = useState(false);

  function handleUseEmailClick() {
    setUseEmail(!useEmail);
  }
  return (
    <div className={styles.container}>
      <div className={styles.card}>
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
          <p className={styles.paragraph} onClick={handleUseEmailClick}>
            {useEmail ? 'Use phone number' : 'Use email'}
          </p>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
