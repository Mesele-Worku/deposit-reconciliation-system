import { useState } from 'react';
import { FaTimes, FaUserPlus } from 'react-icons/fa';
import api from '../../api/axios';

const CreateUserModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'VIEWER',
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

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

      await api.post('/users', form);

      alert('User created successfully');

      onSuccess();

      onClose();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || 'Failed to create user');
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
            <FaUserPlus />
            Create New User
          </h2>

          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <input
            name="username"

            value={form.username}

            onChange={handleChange}

            placeholder="Username"

            className="w-full rounded-lg border p-3"
          />

          <input
            name="fullName"

            value={form.fullName}

            onChange={handleChange}

            placeholder="Full Name"

            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"

            name="password"

            value={form.password}

            onChange={handleChange}

            placeholder="Password"

            className="w-full rounded-lg border p-3"
          />

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

          <button
            disabled={loading}

            className="w-full rounded-lg bg-[#232a78] p-3 font-bold text-white hover:bg-[#1c225f]"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
