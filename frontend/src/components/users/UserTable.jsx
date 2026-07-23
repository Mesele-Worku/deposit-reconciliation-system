import { FaEdit, FaLock, FaUnlock } from 'react-icons/fa';

import RoleBadge from './RoleBadge';

import StatusBadge from './StatusBadge';

const UserTable = ({ users, onEdit, onStatus, onReset }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl">
      <table className="w-full min-w-[850px] table-fixed bg-white">
        <thead className="bg-[#232a78] text-white">
          <tr>
            <th className="text-sm- w-[20%] p-4 text-left font-semibold">Username</th>

            <th className="w-[25%] p-4 text-left text-sm font-semibold">Full Name</th>

            <th className="w-[15%] p-4 text-center text-sm font-semibold">Role</th>

            <th className="w-[15%] p-4 text-center text-sm font-semibold">Status</th>

            <th className="w-[15%] p-4 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.USER_ID}

              className="border-b border-gray-300 transition hover:bg-gray-50"
            >
              <td
                className="truncate p-4 font-medium whitespace-nowrap text-gray-700"

                title={user.USERNAME}
              >
                {user.USERNAME}
              </td>

              <td
                className="truncate p-4 whitespace-nowrap text-gray-700"

                title={user.FULL_NAME}
              >
                {user.FULL_NAME}
              </td>

              <td className="p-4 text-center">
                <RoleBadge role={user.ROLE} />
              </td>

              <td className="p-4 text-center">
                <StatusBadge status={user.STATUS} />
              </td>

              <td className="p-4">
                <div className="flex items-center justify-center gap-10">
                  <button
                    onClick={() => onEdit(user)}

                    className="text-blue-600 transition hover:scale-110"

                    title="Edit User"
                  >
                    <FaEdit size={18} />
                  </button>

                  <button
                    onClick={() => onReset(user)}

                    className="text-orange-500 transition hover:scale-110"

                    title="Reset Password"
                  >
                    <FaLock size={18} />
                  </button>

                  <button
                    onClick={() => onStatus(user)}

                    className="text-green-600 transition hover:scale-110"

                    title="Change Status"
                  >
                    {user.STATUS === 'ACTIVE' ? <FaUnlock size={18} /> : <FaLock size={18} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
