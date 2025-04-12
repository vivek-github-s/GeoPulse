import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactElement; // 👈 precise typing
}

const PrivateRoute = ({ children }: PrivateRouteProps): React.ReactElement | null => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
