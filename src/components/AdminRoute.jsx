import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.roles.includes('admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};
