import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/authContext';

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(username, password);

      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC] px-4">
      <form
        onSubmit={handleSubmit}

        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-[#232A78]">EDRMS Login</h1>

        {error && <p className="mb-3 text-red-500">{error}</p>}

        <input
          className="mb-3 w-full rounded-lg border p-3"

          placeholder="Username"

          value={username}

          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="mb-5 w-full rounded-lg border p-3"

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-lg bg-[#232A78] py-3 font-bold text-white">Login</button>
      </form>
    </div>
  );
};

export default Login;
