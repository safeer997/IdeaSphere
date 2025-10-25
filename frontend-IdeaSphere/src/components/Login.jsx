import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logo from '../assets/icons/logo.png';
import { login } from '../features/authApi.js';

function Login({ setSignupOptions, setIsLoggingIn }) {
  const identifier = useRef('');
  const password = useRef('');
  const navigate = useNavigate(); 

  function handleSignupClick() {
    setIsLoggingIn(false);
    setSignupOptions(true);
  }

  function handleForgotClick() {
    // You can later implement forgot password flow here
  }

  async function handleLogin() {
    const identifierInput = identifier.current.value.trim();
    const passwordInput = password.current.value.trim();

    if (!identifierInput || !passwordInput) {
      console.log('Input fields cannot be empty');
      return;
    }

    try {
      const response = await login(identifierInput, passwordInput);
      console.log('response :', response);

      if (response.success) {
        console.log('✅ Login successful');
        navigate('/dashboard');
      } else {
        console.log('❌', response.message);
      }
    } catch (error) {
      console.error(
        '❌ Login failed:',
        error.response?.message || error.message
      );
    }
  }

  const handleGoogleLogin = () => {
    window.open('http://localhost:7000/api/v1/auth/google', '_self');
  };

  const handleGithubLogin = () => {
    window.open('http://localhost:7000/api/v1/auth/github', '_self');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formsection}>
        <img src={logo} alt='Logo' />
        <h1>Log in to IdeaSphere</h1>
        <div className={styles.logindiv}>
          <button onClick={handleGoogleLogin} className={styles.button}>
            Login with Google
          </button>
          <button onClick={handleGithubLogin} className={styles.button}>
            Login with Github
          </button>
        </div>
        <input
          ref={identifier}
          type='text'
          placeholder='Phone number or email'
        />
        <input ref={password} type='password' placeholder='Password' />
        <button onClick={handleLogin}>Log in</button>
      </div>

      <div className={styles.footer}>
        <span onClick={handleForgotClick}>Forgot password?</span>
        <span onClick={handleSignupClick}>Sign up to IdeaSphere</span>
      </div>
    </div>
  );
}

export default Login;
