
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

export default function RequireAuth({ allowedRole }) {
  const { user } = useAuth();
  console.log(user)
  console.log(allowedRole)
  // allowedRole = user.role;
  const location = useLocation();

  if (!user) {
    // User is not logged in → redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== allowedRole) {
    // User is logged in but does not have permission → redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
    // alert("Not router")
  }

  // User is allowed → show the requested route
  return <Outlet />;
}