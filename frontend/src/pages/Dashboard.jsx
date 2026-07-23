// import { useEffect, useState } from 'react';

// import { FaUniversity, FaDatabase, FaWallet, FaLayerGroup, FaSyncAlt } from 'react-icons/fa';

// import api from '../api/axios';

// // Layout
// import Navbar from '../components/layouts/Navbar';

// // Cards
// import SummaryCard from '../components/cards/SummaryCard';
// import RuleCard from '../components/cards/RuleCard';
// import SegmentCard from '../components/cards/SegmentCard';

// // Charts
// import DepositPieChart from '../components/charts/DespositPieChart';
// import DepositTrendChart from '../components/charts/DepositTrendChart';
// // import Navbar from '../components/Navbar';
// const Dashboard = () => {
//   const [data, setData] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [lastRefresh, setLastRefresh] = useState(null);

//   const loadData = async () => {
//     try {
//       setLoading(true);

//       const response = await api.get('/reconciliation/status');

//       setData(response.data);

//       setLastRefresh(new Date());
//     } catch (error) {
//       console.error('Dashboard Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();

//     const interval = setInterval(loadData, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   if (loading || !data) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC]">
//         <div className="rounded-xl bg-white p-8 text-center shadow">
//           <FaSyncAlt className="mx-auto mb-4 animate-spin text-[#232A78]" size={30} />

//           <p className="font-semibold">Loading Monitoring Data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F4F7FC]">
//       <Navbar />

//       <div className="p-4 sm:p-6 lg:p-8">
//         {/* HEADER */}

//         <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row">
//           <div>
//             <h1 className="text-3xl font-bold text-[#232A78]">Deposit Monitoring Dashboard</h1>

//             <p className="mt-2 text-gray-500">
//               Enterprise Deposit Reconciliation & Monitoring System
//             </p>
//           </div>

//           <div className="flex items-center gap-3 rounded-xl bg-green-100 px-5 py-3 font-semibold text-green-700">
//             <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
//             MONITORING ACTIVE
//           </div>
//         </div>

//         {/* SUMMARY CARDS */}

//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
//           <SummaryCard
//             title="Core Banking Deposit"

//             value={data.coreDeposit}

//             icon={<FaUniversity size={30} />}

//             color="#232A78"
//           />

//           <SummaryCard
//             title="Warehouse Deposit"

//             value={data.warehouseDeposit}

//             icon={<FaDatabase size={30} />}

//             color="#FF9710"
//           />

//           <SummaryCard
//             title="Retail Deposit"

//             value={data.retailDeposit}

//             icon={<FaWallet size={30} />}

//             color="#22C55E"
//           />

//           <SummaryCard
//             title="Segmentation Deposit"

//             value={data.segmentationDeposit}

//             icon={<FaLayerGroup size={30} />}

//             color="#6366F1"
//           />
//         </div>

//         {/* RULE STATUS */}

//         <div className="mt-8">
//           <h2 className="mb-5 text-xl font-bold text-[#232A78]">Reconciliation Rules</h2>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             <RuleCard rule={data.rule1} />

//             <RuleCard rule={data.rule2} />

//             <RuleCard rule={data.rule3} />
//           </div>
//         </div>

//         {/* CHARTS */}

//         <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
//           <DepositPieChart segments={data.segments} />

//           <DepositTrendChart />
//         </div>

//         {/* SEGMENTS */}

//         <div className="mt-8">
//           <h2 className="mb-5 text-xl font-bold text-[#232A78]">Deposit Segments</h2>

//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//             {Object.entries(data.segments || {}).map(([name, value]) => (
//               <SegmentCard
//                 key={name}

//                 name={name}

//                 value={value}
//               />
//             ))}
//           </div>
//         </div>

//         {/* FOOTER */}

//         <div className="mt-8 rounded-xl bg-white p-5 text-sm text-gray-500 shadow">
//           <p>
//             Last Database Update:
//             <span className="ml-2 font-semibold text-gray-700">
//               {new Date(data.timestamp).toLocaleString()}
//             </span>
//           </p>

//           <p className="mt-2">
//             Dashboard Refresh:
//             <span className="ml-2 font-semibold text-[#232A78]">
//               {lastRefresh ? lastRefresh.toLocaleTimeString() : '-'}
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from 'react';

import {
  FaUniversity,
  FaDatabase,
  FaWallet,
  FaLayerGroup,
  FaSyncAlt,
  FaCheckCircle,
} from 'react-icons/fa';

import api from '../api/axios';

// Layout
// import Navbar from '../components/layouts/Navbar';
import Navbar from '../components/Navbar';
// Components
import SummaryCard from '../components/cards/SummaryCard';
import RuleCard from '../components/cards/RuleCard';
import SegmentCard from '../components/cards/SegmentCard';

// Charts
import DepositPieChart from '../components/charts/DespositPieChart';
import DepositTrendChart from '../components/charts/DepositTrendChart';

const Dashboard = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await api.get('/reconciliation/status');

      setData(response.data);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Dashboard API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   loadData();

  //   const timer = setInterval(loadData, 30000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  useEffect(() => {
    loadData();

    const timer = setInterval(loadData, 30000);

    const refreshDashboard = () => {
      loadData();
    };

    window.addEventListener('reconciliationCompleted', refreshDashboard);

    return () => {
      clearInterval(timer);

      window.removeEventListener('reconciliationCompleted', refreshDashboard);
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
          <FaSyncAlt
            className="mx-auto mb-4 animate-spin text-[#232A78]"

            size={35}
          />

          <p className="font-semibold text-gray-700">Loading Monitoring Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F4F7FC]">
      <Navbar />

      <div className="px-3 py-4 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center">
            <h1 className="text-xl font-bold break-words text-[#232A78] sm:text-2xl lg:text-3xl">
              EDRMS Deposit Monitoring Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enterprise Deposit Reconciliation & Monitoring System
            </p>
          </div>

          {/* LIVE INDICATOR */}

          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-100 px-4 py-3 text-sm font-semibold text-green-700 sm:w-fit">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            MONITORING ACTIVE
          </div>
        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Core Banking Deposit"

            value={data.coreDeposit}

            icon={<FaUniversity />}

            color="#232A78"
          />

          <SummaryCard
            title="Warehouse Deposit"

            value={data.warehouseDeposit}

            icon={<FaDatabase />}

            color="#FF9710"
          />

          <SummaryCard
            title="Retail Deposit"

            value={data.retailDeposit}

            icon={<FaWallet />}

            color="#16A34A"
          />

          <SummaryCard
            title="Segmentation Deposit"

            value={data.segmentationDeposit}

            icon={<FaLayerGroup />}

            color="#6366F1"
          />
        </div>

        {/* RULE MONITORING */}

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-[#232A78] sm:text-xl">
            Reconciliation Status
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RuleCard rule={data.rule1} />

            <RuleCard rule={data.rule2} />

            <RuleCard rule={data.rule3} />
          </div>
        </section>

        {/* CHART SECTION */}

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-[#232A78] sm:text-xl">Deposit Analytics</h2>

          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
            <div className="w-full rounded-xl bg-white p-3 shadow sm:p-5">
              <DepositPieChart segments={data.segments || {}} />
            </div>

            <div className="w-full rounded-xl bg-white p-3 shadow sm:p-5">
              <DepositTrendChart />
            </div>
          </div>
        </section>

        {/* SEGMENT CARDS */}

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-[#232A78] sm:text-xl">Segment Breakdown</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {Object.entries(data.segments || {}).map(([name, value]) => (
              <SegmentCard
                key={name}

                name={name}

                value={value}
              />
            ))}
          </div>
        </section>

        {/* FOOTER */}

        <section className="mt-8 rounded-xl bg-white p-4 text-sm text-gray-600 shadow sm:p-5">
          <div className="flex flex-col gap-2">
            <p>
              Database Update:
              <span className="ml-2 font-semibold text-[#232A78]">
                {new Date(data.timestamp).toLocaleString()}
              </span>
            </p>

            <p>
              Dashboard Refresh:
              <span className="ml-2 font-semibold text-[#232A78]">
                {lastRefresh ? lastRefresh.toLocaleTimeString() : '-'}
              </span>
            </p>

            <div className="flex items-center gap-3 font-semibold text-green-600">
              <FaCheckCircle />
              System Healthy
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
