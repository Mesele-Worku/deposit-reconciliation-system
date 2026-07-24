import { FaCheckCircle, FaClock } from "react-icons/fa";

const DashboardHeader = ({ systemStatus, lastRefresh }) => {
    return (
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#232A78] lg:text-3xl">
                        Enterprise Deposit Reconciliation Monitoring
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Enterprise Deposit Reconciliation & Monitoring System (EDRMS)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 font-semibold text-green-700">
                        <FaCheckCircle />
                        {systemStatus}
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm">
                        <FaClock />

                        {lastRefresh
                            ? lastRefresh.toLocaleTimeString()
                            : "--:--:--"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;