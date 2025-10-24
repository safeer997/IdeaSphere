import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/auth/LandingPage.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;
