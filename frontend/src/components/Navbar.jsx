// import { useState } from 'react';

// import { Link } from 'react-router-dom';

// import { FaBell, FaUserCircle, FaBars, FaTimes, FaUniversity } from 'react-icons/fa';

// import { useAuth } from '../context/authContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   const [open, setOpen] = useState(false);

//   const closeMenu = () => {
//     setOpen(false);
//   };

//   return (
//     <nav className="bg-[#232A78] text-white shadow-lg">
//       <div className="mx-auto flex max-w-full items-center justify-between px-4 py-4">
//         {/* LOGO */}

//         <div className="flex items-center gap-3">
//           <div className="rounded-lg bg-white p-2 text-[#232A78]">
//             <FaUniversity size={22} />
//           </div>

//           <div>
//             <h1 className="text-xl font-bold">EDRMS</h1>

//             <p className="hidden text-xs text-gray-200 sm:block">
//               Enterprise Deposit Reconciliation
//             </p>
//           </div>
//         </div>

//         {/* DESKTOP MENU */}

//         <div className="hidden items-center gap-6 lg:flex">
//           <Link
//             to="/dashboard"

//             className="transition hover:text-[#ff9710]"
//           >
//             Dashboard
//           </Link>

//           {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
//             <Link
//               to="/reconciliation/run"

//               className="transition hover:text-[#ff9710]"
//             >
//               Run Reconciliation
//             </Link>
//           )}

//           {user?.role === 'ADMIN' && (
//             <Link
//               to="/users"

//               className="transition hover:text-[#ff9710]"
//             >
//               User Management
//             </Link>
//           )}

//           <div className="flex items-center gap-3 border-l border-white/30 pl-5">
//             <FaBell />

//             <FaUserCircle size={28} />

//             <div className="text-sm">
//               <p className="font-semibold">{user?.name}</p>

//               <p className="text-xs text-gray-200">{user?.role}</p>
//             </div>

//             <button
//               onClick={logout}

//               className="rounded-lg bg-[#ff9710] px-4 py-2 font-semibold hover:opacity-90"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* MOBILE BUTTON */}

//         <button
//           onClick={() => setOpen(!open)}

//           className="text-white lg:hidden"
//         >
//           {open ? <FaTimes size={25} /> : <FaBars size={25} />}
//         </button>
//       </div>

//       {/* MOBILE MENU */}

//       {open && (
//         <div className="space-y-4 bg-[#1c225f] px-5 py-5 lg:hidden">
//           <Link
//             onClick={closeMenu}

//             to="/dashboard"

//             className="block hover:text-[#ff9710]"
//           >
//             Dashboard
//           </Link>

//           {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
//             <Link
//               onClick={closeMenu}

//               to="/reconciliation/run"

//               className="block hover:text-[#ff9710]"
//             >
//               Run Reconciliation
//             </Link>
//           )}

//           {user?.role === 'ADMIN' && (
//             <Link
//               onClick={closeMenu}

//               to="/users"

//               className="block hover:text-[#ff9710]"
//             >
//               User Management
//             </Link>
//           )}

//           <div className="flex items-center justify-between border-t border-white/20 pt-4">
//             <div className="flex items-center gap-3">
//               <FaUserCircle size={30} />

//               <div>
//                 <p className="font-bold">{user?.name}</p>

//                 <p className="text-xs">{user?.role}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => {
//                 logout();

//                 closeMenu();
//               }}

//               className="rounded-lg bg-[#ff9710] px-4 py-2 font-semibold"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaUniversity,
  FaSyncAlt,
  FaUsers,
  FaEnvelope,
  FaCalendarAlt,
} from 'react-icons/fa';

import { useAuth } from '../context/authContext';

import api from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const [reconStatus, setReconStatus] = useState(null);

  const closeMenu = () => {
    setOpen(false);
  };

  const runReconciliation = async () => {
    try {
      setReconStatus('RUNNING');

      await api.post('/reconciliation/run');

      setReconStatus('SUCCESS');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Reconciliation failed', error);

      setReconStatus('FAILED');

      setTimeout(() => {
        setReconStatus(null);
      }, 3000);
    }
  };

  return (
    <nav className="bg-[#232A78] text-white shadow-lg">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-4">
        {/* LOGO */}
        {/* <img
          src={logo}
          alt="EDRMS Logo"
          className="h-12 w-12 rounded-lg bg-white object-contain p-1"
        /> */}
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
            <button
              onClick={runReconciliation}

              className="flex items-center gap-2 transition hover:text-[#ff9710]"
            >
              <FaSyncAlt />
              Run Reconciliation
            </button>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              to="/users"

              className="flex items-center gap-2 transition hover:text-[#ff9710]"
            >
              <FaUsers />
              Users
            </Link>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              to="/notifications"

              className="flex items-center gap-2 transition hover:text-[#ff9710]"
            >
              <FaEnvelope />
              Notification
            </Link>
          )}
          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              to="/admin/scheduler"

              className="flex items-center gap-2 transition hover:text-[#ff9710]"
            >
              <FaCalendarAlt />
              Shedule
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
            <button
              onClick={() => {
                closeMenu();

                runReconciliation();
              }}

              className="flex items-center gap-2 hover:text-[#ff9710]"
            >
              <FaSyncAlt />
              Run Reconciliationn
            </button>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <button
              onClick={() => {
                closeMenu();

                runReconciliation();
              }}

              className="flex items-center gap-2 hover:text-[#ff9710]"
            >
              <FaSyncAlt />
              Scheduler Management
            </button>
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

      {/* RECONCILIATION OVERLAY */}

      {reconStatus && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div className="rounded-xl bg-white p-8 text-center text-gray-800 shadow-2xl">
            {reconStatus === 'RUNNING' && (
              <>
                <FaSyncAlt
                  className="mx-auto mb-5 animate-spin text-[#232A78]"

                  size={45}
                />

                <h2 className="text-xl font-bold">Running Reconciliation</h2>

                <p className="mt-3 text-gray-600">Please wait...</p>
              </>
            )}

            {reconStatus === 'SUCCESS' && (
              <>
                <h2 className="text-xl font-bold text-green-600">✓ Completed Successfully</h2>
              </>
            )}

            {reconStatus === 'FAILED' && (
              <>
                <h2 className="text-xl font-bold text-red-600">✕ Reconciliation Failed</h2>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
