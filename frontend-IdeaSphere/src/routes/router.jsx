import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/auth/LandingPage.jsx';
import Signup from '../components/Signup.jsx';
import Login from '../components/Login.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
]);

export default router;
