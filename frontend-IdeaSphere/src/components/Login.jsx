import react, { useRef } from 'react';
import styles from './Login.module.css';
import logo from '../assets/icons/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/authApi.js';

function Login({ setSignupOptions, setIsLoggingIn }) {
  const identifier = useRef('');
  const password = useRef('');

  function handleSignupClick() {
    setIsLoggingIn(false);
    setSignupOptions(true);
  }
  function handleForgotClick() {}

  async function handleLogin() {
    const identifierInput = identifier.current.value;
    const passwordInput = password.current.value;
    if (!identifierInput || !passwordInput) {
      console.log('Input field can not be empty');
    }
    const response = await login(identifierInput, passwordInput);
    console.log('res in login :', response);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.formsection}>
          <img src={logo}></img>
          <h1>Log in to IdeaSphere</h1>
          <input
            ref={identifier}
            type='text'
            placeholder='Phone number, email address'
          ></input>
          <input ref={password} type='text' placeholder='Password'></input>
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
