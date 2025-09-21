import React from 'react';
import styles from './Signup.module.css';
import logo from '../assets/icons/logo.png';
import { useState, useRef } from 'react';
import { signUp } from '../features/authApi.js';

function Signup({ setSignupOptions, setIsLoggingIn, setIsSigningUp }) {
  const [useEmail, setUseEmail] = useState(false);
  const identifier = useRef('');
  const password = useRef('');

  function handleUseEmailClick() {
    setUseEmail(!useEmail);
  }

  function handleAlreadyHaveAnAccount() {
    setSignupOptions(true);
    setIsLoggingIn(false);
    setIsSigningUp(false);
  }

  async function handleSignup() {
    const identifierInput = identifier.current.value;
    const passwordInput = password.current.value;

    if (!identifierInput || !passwordInput) {
      console.log('Input field can not be empty');
    }

    if (useEmail) {
      const email = identifierInput;
      const response = await signUp(email, '', passwordInput);
      console.log('res in signup by email :', response);
    } else {
      const phoneNumber = identifierInput;
      const response = await signUp('', phoneNumber, passwordInput);
      console.log('res in signup by phone :', response);
    }
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
            <input
              ref={identifier}
              type='text'
              placeholder={useEmail ? 'Email' : 'Phone number'}
            />
            <input ref={password} type='text' placeholder='password' />
          </div>
          <span className={styles.span} onClick={handleUseEmailClick}>
            {useEmail ? 'Use phone number' : 'Use email'}
          </span>
          <button onClick={handleSignup}>Sign up</button>
          <span className={styles.span} onClick={handleAlreadyHaveAnAccount}>
            Already have an account ?
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
