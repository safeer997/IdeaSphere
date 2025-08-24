import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/auth/LandingPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  
]);

export default router;
