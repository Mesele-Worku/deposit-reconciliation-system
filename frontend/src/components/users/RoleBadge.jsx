const RoleBadge = ({ role }) => {
  const styles = {
    ADMIN: 'bg-purple-100 text-purple-700',

    OPERATOR: 'bg-orange-100 text-orange-700',

    VIEWER: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[role]} `}>{role}</span>
  );
};

export default RoleBadge;
