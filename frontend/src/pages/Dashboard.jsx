import { useEffect, useState } from 'react';

import api from '../api/axios';

import Navbar from '../components/Navbar';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import MonitoringCards from '../components/dashboard/MonitoringCharts';
import SchedulerCard from '../components/dashboard/SchedulerCard';
import RuleSection from '../components/dashboard/RuleSection';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import SegmentSection from '../components/dashboard/SegmentSecton';
import RecentJobsTable from '../components/dashboard/RecentJobsTable';
import DashboardFooter from '../components/dashboard/DashboardFooter';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [lastRefresh, setLastRefresh] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get('/dashboard/status');

      setDashboard(response.data);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    const initializeDashboard = async () => {
      await loadDashboard();
    };

    initializeDashboard();

    // Auto refresh every minute
    const timer = setInterval(() => {
      loadDashboard();
    }, 60000);

    // Refresh after manual reconciliation
    const handleReconciliationCompleted = () => {
      loadDashboard();
    };

    window.addEventListener('reconciliationCompleted', handleReconciliationCompleted);

    return () => {
      clearInterval(timer);

      window.removeEventListener('reconciliationCompleted', handleReconciliationCompleted);
    };
  }, []);

  if (loading || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <h2 className="text-xl font-bold text-[#232A78]">Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-8xl mx-auto p-4 md:p-6">
        {/* Header */}
        <DashboardHeader
          systemStatus={dashboard.systemStatus}
          latestRun={dashboard.latestRun}
          lastRefresh={lastRefresh}
        />

        {/* Deposit Summary */}
        <MonitoringCards deposits={dashboard.deposits} jobs={dashboard.jobs} />

        {/* Scheduler & Recent Jobs */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <SchedulerCard scheduler={dashboard.scheduler} />

          <RecentJobsTable jobs={dashboard.recentJobs} />
        </div>

        {/* Reconciliation Rules */}
        <RuleSection rules={dashboard.rules} />

        {/* Analytics */}
        <AnalyticsSection deposits={dashboard.deposits} segments={dashboard.segments} />

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
