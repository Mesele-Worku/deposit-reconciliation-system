import { useState } from 'react';

import { FaTimes, FaLock } from 'react-icons/fa';

import api from '../../api/axios';

const ResetPasswordModal = ({ open, onClose, user, onSuccess }) => {
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  if (!open || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');

      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/users/${user.USER_ID}/reset-password`,

        {
          password,
        },
      );

      alert('Password reset successfully');

      onSuccess();

      onClose();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#232a78]">
            <FaLock />
            Reset Password
          </h2>

          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}

          className="space-y-4 p-5"
        >
          <p className="text-gray-600">Reset password for:</p>

          <p className="font-bold text-[#232a78]">{user.USERNAME}</p>

          <input
            type="password"

            placeholder="New Password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            required

            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"

            placeholder="Confirm Password"

            value={confirmPassword}

            onChange={(e) => setConfirmPassword(e.target.value)}

            required

            className="w-full rounded-lg border p-3"
          />

          <button
            disabled={loading}

            className="w-full rounded-lg bg-[#ff9710] p-3 font-bold text-white"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
