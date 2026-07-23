import { FaTimes, FaUserCheck, FaUserLock } from 'react-icons/fa';

import api from '../../api/axios';

const StatusModal = ({ open, onClose, user, onSuccess }) => {
  if (!open || !user) return null;

  const activate = user.STATUS === 'INACTIVE';

  const updateStatus = async () => {
    try {
      await api.put(
        `/users/${user.USER_ID}/status`,

        {
          status: activate ? 'ACTIVE' : 'INACTIVE',
        },
      );

      alert(activate ? 'User activated successfully' : 'User deactivated successfully');

      onSuccess();

      onClose();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#232a78]">
            {activate ? <FaUserCheck /> : <FaUserLock />}

            {activate ? 'Activate User' : 'Deactivate User'}
          </h2>

          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          Are you sure you want to
          <strong> {activate ? 'activate' : 'deactivate'}</strong>
          user:
          <br />
          <span className="font-bold text-[#232a78]">{user.USERNAME}</span>?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}

            className="flex-1 rounded-lg border p-3"
          >
            Cancel
          </button>

          <button
            onClick={updateStatus}

            className={`flex-1 rounded-lg p-3 font-bold text-white ${
              activate ? 'bg-green-600' : 'bg-red-600'
            } `}
          >
            {activate ? 'Activate' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
