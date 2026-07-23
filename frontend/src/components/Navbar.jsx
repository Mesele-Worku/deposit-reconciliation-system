// import { Link } from 'react-router-dom';
// import { FaUniversity, FaBell, FaUserCircle } from 'react-icons/fa';
// import { useAuth } from '../context/authContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="flex flex-col gap-3 bg-[#232A78] px-4 py-10 text-white sm:flex-row sm:items-center sm:justify-between">
//       {/* Logo */}

//       <div className="text-xl font-bold">EDRMS</div>

//       {/* Menu */}

//       <div className="flex flex-wrap items-center gap-4">
//         {/* All authenticated users */}
//         <Link to="/dashboard">Dashboard</Link>
//         {/* ADMIN + OPERATOR */}

//         {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
//           <Link to="/reconciliation/run">Run Reconciliation</Link>
//         )}

//         {/* ADMIN ONLY */}

//         {user?.role === 'ADMIN' && <Link to="/users">User Management</Link>}
//         <p>Wel Come {user?.name}</p>
//         <FaUserCircle size={25} />
//         <button
//           onClick={logout}

//           className="rounded-lg bg-[#ff9710] px-3 py-1 font-semibold"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from 'react';

import { Link } from 'react-router-dom';

import { FaBell, FaUserCircle, FaBars, FaTimes, FaUniversity } from 'react-icons/fa';

import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="bg-[#232A78] text-white shadow-lg">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-4">
        {/* LOGO */}

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2 text-[#232A78]">
            <FaUniversity size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold">EDRMS</h1>

            <p className="hidden text-xs text-gray-200 sm:block">
              Enterprise Deposit Reconciliation
            </p>
          </div>
        </div>

        {/* DESKTOP MENU */}

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            to="/dashboard"

            className="transition hover:text-[#ff9710]"
          >
            Dashboard
          </Link>

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              to="/reconciliation/run"

              className="transition hover:text-[#ff9710]"
            >
              Run Reconciliation
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link
              to="/users"

              className="transition hover:text-[#ff9710]"
            >
              User Management
            </Link>
          )}

          <div className="flex items-center gap-3 border-l border-white/30 pl-5">
            <FaBell />

            <FaUserCircle size={28} />

            <div className="text-sm">
              <p className="font-semibold">{user?.name}</p>

              <p className="text-xs text-gray-200">{user?.role}</p>
            </div>

            <button
              onClick={logout}

              className="rounded-lg bg-[#ff9710] px-4 py-2 font-semibold hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MOBILE BUTTON */}

        <button
          onClick={() => setOpen(!open)}

          className="text-white lg:hidden"
        >
          {open ? <FaTimes size={25} /> : <FaBars size={25} />}
        </button>
      </div>

      {/* MOBILE MENU */}

      {open && (
        <div className="space-y-4 bg-[#1c225f] px-5 py-5 lg:hidden">
          <Link
            onClick={closeMenu}

            to="/dashboard"

            className="block hover:text-[#ff9710]"
          >
            Dashboard
          </Link>

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              onClick={closeMenu}

              to="/reconciliation/run"

              className="block hover:text-[#ff9710]"
            >
              Run Reconciliation
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link
              onClick={closeMenu}

              to="/users"

              className="block hover:text-[#ff9710]"
            >
              User Management
            </Link>
          )}

          <div className="flex items-center justify-between border-t border-white/20 pt-4">
            <div className="flex items-center gap-3">
              <FaUserCircle size={30} />

              <div>
                <p className="font-bold">{user?.name}</p>

                <p className="text-xs">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();

                closeMenu();
              }}

              className="rounded-lg bg-[#ff9710] px-4 py-2 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
