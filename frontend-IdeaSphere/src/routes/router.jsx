import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/auth/LandingPage.jsx';
import Signup from '../pages/auth/Signup.jsx';
import Login from '../pages/auth/Login.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
  {
    path: 'login',
    element: <Login />,
  },
]);

export default router;
