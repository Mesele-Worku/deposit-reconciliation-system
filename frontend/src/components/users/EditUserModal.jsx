import { useEffect, useState } from 'react';
import { FaTimes, FaEdit } from 'react-icons/fa';

import api from '../../api/axios';

const EditUserModal = ({ open, onClose, user, onSuccess }) => {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.USERNAME,

        fullName: user.FULL_NAME,

        role: user.ROLE,
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(
        `/users/${user.USER_ID}`,

        {
          fullName: form.fullName,

          role: form.role,
        },
      );

      alert('User updated successfully');

      onSuccess();

      onClose();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#232a78]">
            <FaEdit />
            Edit User
          </h2>

          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}

          className="space-y-4 p-5"
        >
          <div>
            <label className="text-sm font-semibold text-gray-600">Username</label>

            <input
              value={form.username}

              disabled

              className="w-full rounded-lg border bg-gray-100 p-3"
            />

            <p className="mt-1 text-xs text-gray-400">Username cannot be changed</p>
          </div>

          <div>
            <label className="text-sm font-semibold">Full Name</label>

            <input
              name="fullName"

              value={form.fullName}

              onChange={handleChange}

              className="w-full rounded-lg border p-3"

              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Role</label>

            <select
              name="role"

              value={form.role}

              onChange={handleChange}

              className="w-full rounded-lg border p-3"
            >
              <option value="ADMIN">ADMIN</option>

              <option value="OPERATOR">OPERATOR</option>

              <option value="VIEWER">VIEWER</option>
            </select>
          </div>

          <button
            disabled={loading}

            className="w-full rounded-lg bg-[#232a78] p-3 font-bold text-white"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
