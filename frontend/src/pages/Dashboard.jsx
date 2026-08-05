import { useEffect, useState } from 'react';

import api from '../api/axios';

import Navbar from '../components/Navbar';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import MonitoringCards from '../components/dashboard/MonitoringCharts';
import SchedulerCard from '../components/dashboard/SchedulerCard';
import RuleSection from '../components/dashboard/RuleSection';
import SegmentSection from '../components/dashboard/SegmentSecton';
import RecentJobsTable from '../components/dashboard/RecentJobsTable';
import DashboardFooter from '../components/dashboard/DashboardFooter';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [lastRefresh, setLastRefresh] = useState(null);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      console.log('Loading dashboard...');

      const response = await api.get('/dashboard/status');

      console.log('Dashboard data:', response.data);

      setDashboard(response.data);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // MANUAL REFRESH BUTTON
  // =====================================================

  const handleRefresh = async () => {
    await loadDashboard(true);
  };

  // =====================================================
  // INITIAL LOAD + SSE CONNECTION
  // =====================================================

  useEffect(() => {
    // let eventSource;

    // -----------------------------------------------------
    // Initial dashboard load
    // -----------------------------------------------------

    loadDashboard();

    // -----------------------------------------------------
    // SSE CONNECTION
    // -----------------------------------------------------

    // console.log('Connecting to dashboard SSE...');

    // eventSource = new EventSource('http://localhost:7000/api/dashboardRefresh/events');

    // -----------------------------------------------------
    // CONNECTED
    // -----------------------------------------------------

    // eventSource.addEventListener('connected', (event) => {
    //   console.log('Dashboard SSE connected:', event.data);
    // });

    // -----------------------------------------------------
    // RECONCILIATION COMPLETED
    // -----------------------------------------------------

    // eventSource.addEventListener('reconciliationCompleted', async (event) => {
    //   console.log('Reconciliation completed event received:', event.data);

    //   // Automatically reload dashboard
    //   await loadDashboard(true);
    // });

    // -----------------------------------------------------
    // RECONCILIATION FAILED
    // -----------------------------------------------------

    // eventSource.addEventListener('reconciliationFailed', async (event) => {
    //   console.log('Reconciliation failed event received:', event.data);

    //   // Reload dashboard so FAILED status appears
    //   await loadDashboard(true);
    // });

    // -----------------------------------------------------
    // GENERIC MESSAGE
    // -----------------------------------------------------

    // eventSource.onmessage = (event) => {
    //   console.log('Dashboard SSE message:', event.data);
    // };

    // -----------------------------------------------------
    // SSE ERROR
    // -----------------------------------------------------

    // eventSource.onerror = (error) => {
    //   console.error('Dashboard SSE connection error:', error);
    // };

    // -----------------------------------------------------
    // CLEANUP
    // -----------------------------------------------------

    // return () => {
    //   console.log('Closing dashboard SSE connection...');

    //   if (eventSource) {
    //     eventSource.close();
    //   }
    // };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  // if (loading || !dashboard) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <p>Loading Dashboard...</p>
  //     </div>
  //   );
  // }

  if (loading || !dashboard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

          {/* Loading Text */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700">Loading Dashboard</h2>

            <p className="mt-1 text-sm text-gray-500">
              Preparing reconciliation monitoring data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RECONCILIATION STATUS
  // =====================================================

  const reconciliationStatus =
    dashboard.latestRun?.STATUS || dashboard.latestRun?.status || 'NO RUN';

  // =====================================================
  // UI
  // =====================================================
  // const recentDeposit = dashboard.recentDeposits;
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-[1900px] p-4 md:p-6">
        {/* Header */}

        <DashboardHeader
          reconciliationStatus={reconciliationStatus}
          lastRefresh={lastRefresh}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          // runningJobs={runningJobs}
        />

        {/* Deposit Summary */}

        <MonitoringCards deposits={dashboard.deposits} jobs={dashboard.jobs} />

        {/* Reconciliation Rules */}

        <RuleSection rules={dashboard.rules} recentDeposit={dashboard.recentWarehouse} />

        {/* Scheduler + Recent Jobs */}

        <div className="grid-col-1 mt-6 grid gap-6 xl:grid-cols-[69%_30%]">
          <RecentJobsTable jobs={dashboard.recentJobs} />
          <SchedulerCard scheduler={dashboard.scheduler} />
        </div>

        {/* Segments */}

        <SegmentSection segments={dashboard.segments} />

        {/* Footer */}

        <DashboardFooter
          latestRun={dashboard.latestRun}
          lastRefresh={lastRefresh}
          jobs={dashboard.jobs}
        />
      </main>
    </div>
  );
};

export default Dashboard;
