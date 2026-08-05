import { useState } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
  // FaUniversity,
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

  // =====================================================
  // RECONCILIATION STATUS
  // =====================================================
  const [reconStatus, setReconStatus] = useState(null);

  const closeMenu = () => {
    setOpen(false);
  };

  // =====================================================
  // RUN RECONCILIATION
  // =====================================================
  const runReconciliation = async () => {
    // Prevent multiple clicks while reconciliation is running
    if (reconStatus === 'RUNNING') {
      return;
    }

    try {
      // Show spinning icon
      setReconStatus('RUNNING');

      console.log('Starting reconciliation...');

      await api.post('/reconciliation/run');

      console.log('Reconciliation completed successfully.');

      // Stop spinning
      setReconStatus('SUCCESS');

      // Give the user a short indication of success
      // then reload the page to show the latest dashboard data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Reconciliation failed:', error);

      // Stop spinning and show failed state
      setReconStatus('FAILED');

      // Return to normal button after 3 seconds
      setTimeout(() => {
        setReconStatus(null);
      }, 3000);
    }
  };

  // =====================================================
  // RENDER RECONCILIATION ICON
  // =====================================================
  const renderReconciliationIcon = () => {
    if (reconStatus === 'RUNNING') {
      return <FaSyncAlt className="animate-spin" size={15} />;
    }

    if (reconStatus === 'SUCCESS') {
      return <FaSyncAlt size={15} />;
    }

    return <FaSyncAlt size={15} />;
  };

  return (
    <nav className="bg-[#1c225f] text-white shadow-md">
      {/* =====================================================
          NAVBAR MAIN
      ===================================================== */}

      <div className="mx-auto flex max-w-[1900px] items-center justify-between px-5 py-4">
        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link to="/dashboard" className="cursor-pointer">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EDRMS Logo" className="h-10 w-10 object-contain" />

            <div>
              <h1 className="text-xl font-bold">Awash Bank</h1>

              <p className="text-xs text-gray-200 sm:block">Nurturing like the River</p>
            </div>
          </div>
        </Link>
        {/* =====================================================
            DESKTOP MENU
        ===================================================== */}

        <div className="hidden items-center gap-6 lg:flex">
          {/* Dashboard */}

          <Link to="/dashboard" className="flex items-center gap-2 transition hover:text-[#ff9710]">
            <MdDashboard />
            Dashboard
          </Link>

          {/* =====================================================
              RUN RECONCILIATION
          ===================================================== */}

          {(user?.role === 'SUPERADMIN' || user?.role === 'SUPEROPERATOR') && (
            <button
              onClick={runReconciliation}
              disabled={reconStatus === 'RUNNING'}
              className={`flex items-center gap-2 transition ${
                reconStatus === 'RUNNING'
                  ? 'cursor-not-allowed text-gray-300'
                  : 'hover:text-[#ff9710]'
              }`}
            >
              {/* Spinning icon while running */}

              <span className="flex items-center justify-center">{renderReconciliationIcon()}</span>

              {/* Button text */}

              {reconStatus === 'RUNNING'
                ? 'Running...'
                : reconStatus === 'SUCCESS'
                  ? 'Completed'
                  : reconStatus === 'FAILED'
                    ? 'Failed'
                    : 'Run Reconciliation'}
            </button>
          )}

          {/* Users */}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link to="/users" className="flex items-center gap-2 transition hover:text-[#ff9710]">
              <FaUsers />
              Users
            </Link>
          )}

          {/* Notification */}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              to="/notifications"
              className="flex items-center gap-2 transition hover:text-[#ff9710]"
            >
              <FaEnvelope />
              Notification
            </Link>
          )}

          {/* Scheduler */}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              to="/admin/scheduler"
              className="flex items-center gap-2 transition hover:text-[#ff9710]"
            >
              <FaCalendarAlt />
              Shedule
            </Link>
          )}

          {/* =====================================================
              USER INFORMATION
          ===================================================== */}

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

        {/* =====================================================
            MOBILE BUTTON
        ===================================================== */}

        <button onClick={() => setOpen(!open)} className="text-white lg:hidden">
          {open ? <FaTimes size={25} /> : <FaBars size={25} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {open && (
        <div className="space-y-4 bg-[#1c225f] px-5 py-5 lg:hidden">
          {/* Dashboard */}

          <Link to="/dashboard" className="flex items-center gap-2 transition hover:text-[#ff9710]">
            <MdDashboard />
            Dashboard
          </Link>

          {/* =====================================================
              MOBILE RUN RECONCILIATION
          ===================================================== */}

          {(user?.role === 'SUPERADMIN' || user?.role === 'SUPEROPERATOR') && (
            <button
              onClick={() => {
                closeMenu();
                runReconciliation();
              }}
              disabled={reconStatus === 'RUNNING'}
              className={`flex items-center gap-2 ${
                reconStatus === 'RUNNING'
                  ? 'cursor-not-allowed text-gray-300'
                  : 'hover:text-[#ff9710]'
              }`}
            >
              {/* Spinning icon */}

              <span className="flex items-center justify-center">{renderReconciliationIcon()}</span>

              {reconStatus === 'RUNNING'
                ? 'Running...'
                : reconStatus === 'SUCCESS'
                  ? 'Completed'
                  : reconStatus === 'FAILED'
                    ? 'Failed'
                    : 'Run Reconciliation'}
            </button>
          )}

          {/* Scheduler Management */}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link
              onClick={closeMenu}
              to="/admin/scheduler"
              className="flex items-center gap-2 hover:text-[#ff9710]"
            >
              <FaCalendarAlt />
              Scheduler Management
            </Link>
          )}

          {/* Users */}

          {user?.role === 'ADMIN' && (
            <Link
              onClick={closeMenu}
              to="/users"
              className="flex items-center gap-2 hover:text-[#ff9710]"
            >
              <FaUsers />
              User Management
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              onClick={closeMenu}
              to="/notifications"
              className="flex items-center gap-2 hover:text-[#ff9710]"
            >
              <FaEnvelope />
              Notification
            </Link>
          )}

          {/* =====================================================
              USER INFORMATION
          ===================================================== */}

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
