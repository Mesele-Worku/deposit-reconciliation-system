// import { useEffect, useState } from 'react';

// import { FaSearch, FaUserPlus, FaUsers, FaSyncAlt } from 'react-icons/fa';

// import api from '../../api/axios';

// import UserTable from '../../components/users/UserTable';

// import CreateUserModal from '../../components/users/CreateUserModal';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);

//   const [search, setSearch] = useState('');

//   const [loading, setLoading] = useState(false);

//   const [showCreate, setShowCreate] = useState(false);

//   const loadUsers = async () => {
//     try {
//       setLoading(true);

//       const response = await api.get(`/users?search=${search}`);

//       setUsers(response.data);
//     } catch (error) {
//       console.log(error);

//       alert(error.response?.data?.message || 'Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, [search]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
//       {/* HEADER */}

//       <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row">
//         <div>
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-[#232a78] p-3 text-white">
//               <FaUsers size={24} />
//             </div>

//             <div>
//               <h1 className="text-2xl font-bold text-[#232a78] sm:text-3xl">User Management</h1>

//               <p className="text-gray-500">Manage EDRMS system users and access roles</p>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={() => setShowCreate(true)}

//           className="flex items-center justify-center gap-2 rounded-xl bg-[#ff9710] px-5 py-3 font-bold text-white shadow hover:opacity-90"
//         >
//           <FaUserPlus />
//           Create User
//         </button>
//       </div>

//       {/* SEARCH AREA */}

//       <div className="mb-6 rounded-xl bg-white p-4 shadow">
//         <div className="flex flex-col gap-3 sm:flex-row">
//           <div className="flex flex-1 items-center gap-3 rounded-xl border px-4">
//             <FaSearch className="text-gray-400" />

//             <input
//               value={search}

//               onChange={(e) => setSearch(e.target.value)}

//               placeholder="Search username or full name..."

//               className="w-full p-3 outline-none"
//             />
//           </div>

//           <button
//             onClick={loadUsers}

//             className="flex items-center justify-center gap-2 rounded-xl bg-[#232a78] px-5 py-3 text-white"
//           >
//             <FaSyncAlt />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* USER TABLE */}

//       <div className="rounded-xl bg-white p-4 shadow">
//         {loading ? (
//           <div className="py-10 text-center text-gray-500">Loading users...</div>
//         ) : users.length === 0 ? (
//           <div className="py-10 text-center text-gray-500">No users found</div>
//         ) : (
//           <UserTable
//             users={users}

//             onEdit={(user) => console.log('Edit', user)}

//             onStatus={(user) => console.log('Status', user)}

//             onReset={(user) => console.log('Reset', user)}
//           />
//         )}
//       </div>

//       {/* CREATE USER MODAL */}

//       <CreateUserModal
//         open={showCreate}

//         onClose={() => setShowCreate(false)}

//         onSuccess={loadUsers}
//       />
//     </div>
//   );
// };

// export default UserManagement;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaUsers, FaSyncAlt } from 'react-icons/fa';

import api from '../../api/axios';

import UserTable from '../../components/users/UserTable';

import CreateUserModal from '../../components/users/CreateUserModal';

import EditUserModal from '../../components/users/EditUserModal';

import StatusModal from '../../components/users/StatusModel';

import ResetPasswordModal from '../../components/users/ResetPasswordModel';
import Navbar from '../../components/Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [showStatus, setShowStatus] = useState(false);

  const [statusUser, setStatusUser] = useState(null);

  const [showReset, setShowReset] = useState(false);

  const [resetUser, setResetUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/users?search=${search}`);

      setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F4F7FC]">
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#232a78] p-3 text-white">
              <FaUsers size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#232a78]">User Management</h1>

              <p className="text-gray-500">Manage EDRMS users and permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowCreate(true)}

              className="flex items-center justify-center gap-2 rounded-xl bg-[#ff9710] px-5 py-3 font-bold text-white"
            >
              <FaUserPlus />
              Create User
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow">
          <div className="flex gap-3">
            <div className="flex flex-1 items-center rounded-xl border px-3">
              <FaSearch className="text-gray-400" />

              <input
                value={search}

                onChange={(e) => setSearch(e.target.value)}

                placeholder="Search users..."

                className="w-full p-3 outline-none"
              />
            </div>

            <button
              onClick={loadUsers}

              className="rounded-xl bg-[#232a78] px-4 text-white"
            >
              <FaSyncAlt />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">Loading users...</div>
        ) : (
          <UserTable
            users={users}

            onEdit={(user) => {
              setSelectedUser(user);

              setShowEdit(true);
            }}

            onStatus={(user) => {
              setStatusUser(user);

              setShowStatus(true);
            }}

            onReset={(user) => {
              setResetUser(user);

              setShowReset(true);
            }}
          />
        )}

        <CreateUserModal
          open={showCreate}

          onClose={() => setShowCreate(false)}

          onSuccess={loadUsers}
        />

        <EditUserModal
          open={showEdit}

          user={selectedUser}

          onClose={() => setShowEdit(false)}

          onSuccess={loadUsers}
        />

        <StatusModal
          open={showStatus}

          user={statusUser}

          onClose={() => setShowStatus(false)}

          onSuccess={loadUsers}
        />

        <ResetPasswordModal
          open={showReset}

          user={resetUser}

          onClose={() => setShowReset(false)}

          onSuccess={loadUsers}
        />
      </div>
    </div>
  );
};

export default UserManagement;
