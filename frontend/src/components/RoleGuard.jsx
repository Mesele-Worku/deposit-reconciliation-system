import { useAuth } from '../context/authContext';

const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return null;
  }

  return children;
};

export default RoleGuard;
