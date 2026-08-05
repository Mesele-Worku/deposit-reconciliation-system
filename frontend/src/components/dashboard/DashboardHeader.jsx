import {
  FaCheckCircle,
  FaClock,
  FaSyncAlt,
  FaTimesCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

const DashboardHeader = ({
  reconciliationStatus,
  lastRefresh,
  onRefresh,
  refreshing,
  runningJobs,
}) => {
  // =====================================================
  // STATUS CONFIGURATION
  // =====================================================

  const getStatusConfig = () => {
    const status = String(reconciliationStatus || '').toUpperCase();

    switch (status) {
      case 'COMPLETED':
      case 'SUCCESS':
        return {
          label: 'COMPLETED',
          icon: <FaCheckCircle />,
          className: 'bg-green-100 text-green-700',
        };

      case 'RUNNING':
        return {
          label: 'RUNNING',
          icon: <FaSyncAlt className="animate-spin" />,
          className: 'bg-blue-100 text-blue-700',
        };

      case 'FAILED':
        return {
          label: 'FAILED',
          icon: <FaTimesCircle />,
          className: 'bg-red-100 text-red-700',
        };

      case 'PENDING':
        return {
          label: 'PENDING',
          icon: <FaExclamationCircle />,
          className: 'bg-yellow-100 text-yellow-700',
        };

      default:
        return {
          label: 'NO RUN',
          icon: <FaExclamationCircle />,
          className: 'bg-gray-100 text-gray-700',
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div className="mb-6">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center">
        {/* =================================================
            TITLE
        ================================================= */}

        <div>
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Enterprise Deposit Reconciliation Monitoring
          </h1>

          <p className="mt-1 text-center text-sm text-gray-500 md:text-left">
            A Central Data Reconcilation, Validation and Monitoring Platform
          </p>
        </div>

        {/* =================================================
            STATUS + REFRESH
        ================================================= */}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Reconciliation Status */}

          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold ${status.className}`}
          >
            {status.icon}
            <span>{status.label}</span>
          </div>

          {/* Last Refresh */}

          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700">
            <FaClock />

            <span>{lastRefresh ? lastRefresh.toLocaleTimeString() : '--:--:--'}</span>
          </div>

          {/* Refresh Button */}

          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
