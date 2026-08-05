// import { useState } from 'react';

// import { useNavigate } from 'react-router-dom';

// import { useAuth } from '../context/authContext';

// const Login = () => {
//   const { login } = useAuth();

//   const navigate = useNavigate();

//   const [username, setUsername] = useState('');

//   const [password, setPassword] = useState('');

//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const user = await login(username, password);

//       navigate('/dashboard');
//     } catch (error) {
//       setError('Invalid username or password');
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC] px-4">
//       <form
//         onSubmit={handleSubmit}

//         className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
//       >
//         <h1 className="mb-6 text-center text-2xl font-bold text-[#232A78]">EDRMS Login</h1>

//         {error && <p className="mb-3 text-red-500">{error}</p>}

//         <input
//           className="mb-3 w-full rounded-lg border p-3"

//           placeholder="Username"

//           value={username}

//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           className="mb-5 w-full rounded-lg border p-3"

//           type="password"

//           placeholder="Password"

//           value={password}

//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button className="w-full rounded-lg bg-[#232A78] py-3 font-bold text-white">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import logo from '../assets/logo.png'; // change path if needed

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-[#232A78] shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-8 py-5 text-center">
          <h1 className="text-center text-2xl font-bold tracking-wide text-white">
            Enterprise Deposit Reconciliation & Monitoring System
          </h1>

          <p className="mt-1 text-center text-sm text-slate-200">
            Secure Reconciliation • Monitoring • Reporting
          </p>
        </div>
      </header>

      {/* Login Section */}
      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          {/* Card Header */}
          <div className="rounded-t-2xl bg-[#232A78] px-8 py-8 text-center">
            <div>
              <img src={logo} alt="EDRMS Logo" className="mx-auto mb-4 h-20 w-20 object-contain" />

              <h2 className="text-2xl font-bold text-white">Awash Bank</h2>
            </div>
            <h2 className="text-lg font-bold text-white">Welcome Back</h2>

            <p className="mt-2 text-sm text-slate-200">
              Sign in to access the reconciliation dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#232A78] focus:ring-2 focus:ring-[#232A78]/20 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#232A78] focus:ring-2 focus:ring-[#232A78]/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#232A78] py-3 text-lg font-semibold text-white transition duration-200 hover:bg-[#1b215f]"
            >
              Sign In
            </button>

            <div className="mt-6 border-t pt-4 text-center text-sm text-slate-500">
              Enterprise Deposit Reconciliation & Monitoring System
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
