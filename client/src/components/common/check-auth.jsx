import { Navigate, useLocation } from 'react-router-dom';

const CheckAuth = ({ isAuthenticted, user, children }) => {
  const location = useLocation();

  // If not authenticated, and trying to access a protected route
  if (
    !isAuthenticted &&
    !(location.pathname.includes('/login') || location.pathname.includes('/register'))
  ) {
    return <Navigate to="/auth/login" replace />;
  }

  // If already authenticated and visiting login/register
  if (
    isAuthenticted &&
    (location.pathname.includes('/login') || location.pathname.includes('/register'))
  ) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Prevent normal users from accessing admin routes
  if (isAuthenticted && user?.role !== 'admin' && location.pathname.includes('/admin')) {
    return <Navigate to="/unauth-page" replace />;
  }

  return <>{children}</>;
};

export default CheckAuth;
