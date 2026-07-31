// import { useEffect, useState } from 'react';

// import api from '../api/axios';

// import Navbar from '../components/Navbar';

// import DashboardHeader from '../components/dashboard/DashboardHeader';
// import MonitoringCards from '../components/dashboard/MonitoringCharts';
// import SchedulerCard from '../components/dashboard/SchedulerCard';
// import RuleSection from '../components/dashboard/RuleSection';
// // import AnalyticsSection from '../components/dashboard/AnalyticsSection';
// import SegmentSection from '../components/dashboard/SegmentSecton';
// import RecentJobsTable from '../components/dashboard/RecentJobsTable';
// import DashboardFooter from '../components/dashboard/DashboardFooter';

// const Dashboard = () => {
//   const [dashboard, setDashboard] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [lastRefresh, setLastRefresh] = useState(null);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       const response = await api.get('/dashboard/status');

//       setDashboard(response.data);
//       console.log(response.data);
//       setLastRefresh(new Date());
//     } catch (error) {
//       console.error('Dashboard loading error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Initial load
//     const initializeDashboard = async () => {
//       await loadDashboard();
//     };

//     initializeDashboard();

//     // Auto refresh every minute
//     // const timer = setInterval(() => {
//     //   loadDashboard();
//     // }, 60000);

//     // Refresh after manual reconciliation
//     // const handleReconciliationCompleted = () => {
//     //   loadDashboard();
//     // };

//     // window.addEventListener('reconciliationCompleted', handleReconciliationCompleted);

//     // return () => {
//     //   clearInterval(timer);

//     //   window.removeEventListener('reconciliationCompleted', handleReconciliationCompleted);
//     // };
//   }, []);

//   if (loading || !dashboard) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-100">
//         <h2 className="text-xl font-bold text-[#232A78]">Loading Dashboard...</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100">
//       <Navbar />

//       <main className="mx-auto max-w-[1900px] p-4 md:p-6">
//         {/* Header */}
//         <DashboardHeader
//           systemStatus={dashboard.systemStatus}
//           latestRun={dashboard.latestRun}
//           lastRefresh={lastRefresh}
//         />

//         {/* Deposit Summary */}
//         <MonitoringCards deposits={dashboard.deposits} jobs={dashboard.jobs} />

//         {/* Reconciliation Rules */}
//         <RuleSection rules={dashboard.rules} />

//         {/* Scheduler & Recent Jobs */}
//         <div className="mt-6 grid gap-6 xl:grid-cols-2">
//           <SchedulerCard scheduler={dashboard.scheduler} />

//           <RecentJobsTable jobs={dashboard.recentJobs} />
//         </div>

//         {/* Analytics */}
//         {/* <AnalyticsSection deposits={dashboard.deposits} segments={dashboard.segments} /> */}

//         {/* Segments */}
//         <SegmentSection segments={dashboard.segments} />

//         {/* Footer */}
//         <DashboardFooter
//           latestRun={dashboard.latestRun}
//           lastRefresh={lastRefresh}
//           jobs={dashboard.jobs}
//         />
//       </main>
//     </div>
//   );
// };

// export default Dashboard;




import { useEffect, useState } from "react";

import api from "../api/axios";

import Navbar from "../components/Navbar";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import MonitoringCards from "../components/dashboard/MonitoringCharts";
import SchedulerCard from "../components/dashboard/SchedulerCard";
import RuleSection from "../components/dashboard/RuleSection";
import SegmentSection from "../components/dashboard/SegmentSecton";
import RecentJobsTable from "../components/dashboard/RecentJobsTable";
import DashboardFooter from "../components/dashboard/DashboardFooter";

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

      console.log("Loading dashboard...");

      const response = await api.get("/dashboard/status");

      console.log("Dashboard data:", response.data);

      setDashboard(response.data);

      setLastRefresh(new Date());
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error,
      );
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
    let eventSource;

    // -----------------------------------------------------
    // Initial dashboard load
    // -----------------------------------------------------

    loadDashboard();

    // -----------------------------------------------------
    // SSE CONNECTION
    // -----------------------------------------------------

    console.log("Connecting to dashboard SSE...");

    eventSource = new EventSource(
      "http://localhost:7000/api/dashboardRefresh/events",
    );

    // -----------------------------------------------------
    // CONNECTED
    // -----------------------------------------------------

    eventSource.addEventListener(
      "connected",
      (event) => {
        console.log(
          "Dashboard SSE connected:",
          event.data,
        );
      },
    );

    // -----------------------------------------------------
    // RECONCILIATION COMPLETED
    // -----------------------------------------------------

    eventSource.addEventListener(
      "reconciliationCompleted",
      async (event) => {
        console.log(
          "Reconciliation completed event received:",
          event.data,
        );

        // Automatically reload dashboard
        await loadDashboard(true);
      },
    );

    // -----------------------------------------------------
    // RECONCILIATION FAILED
    // -----------------------------------------------------

    eventSource.addEventListener(
      "reconciliationFailed",
      async (event) => {
        console.log(
          "Reconciliation failed event received:",
          event.data,
        );

        // Reload dashboard so FAILED status appears
        await loadDashboard(true);
      },
    );

    // -----------------------------------------------------
    // GENERIC MESSAGE
    // -----------------------------------------------------

    eventSource.onmessage = (event) => {
      console.log(
        "Dashboard SSE message:",
        event.data,
      );
    };

    // -----------------------------------------------------
    // SSE ERROR
    // -----------------------------------------------------

    eventSource.onerror = (error) => {
      console.error(
        "Dashboard SSE connection error:",
        error,
      );
    };

    // -----------------------------------------------------
    // CLEANUP
    // -----------------------------------------------------

    return () => {
      console.log(
        "Closing dashboard SSE connection...",
      );

      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // =====================================================
  // RECONCILIATION STATUS
  // =====================================================

  const reconciliationStatus =
    dashboard.latestRun?.STATUS ||
    dashboard.latestRun?.status ||
    "NO RUN";

  // =====================================================
  // UI
  // =====================================================

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
        />

        {/* Deposit Summary */}

        <MonitoringCards
          deposits={dashboard.deposits}
          jobs={dashboard.jobs}
        />

        {/* Reconciliation Rules */}

        <RuleSection
          rules={dashboard.rules}
        />

        {/* Scheduler + Recent Jobs */}

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <SchedulerCard
            scheduler={dashboard.scheduler}
          />

          <RecentJobsTable
            jobs={dashboard.recentJobs}
          />
        </div>

        {/* Segments */}

        <SegmentSection
          segments={dashboard.segments}
        />

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