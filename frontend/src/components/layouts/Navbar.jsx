import { FaUniversity, FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="bg-[#232A78] px-4 py-4 text-white shadow-lg sm:px-6">
      <div className="flex items-center justify-between">
        {/* Logo Section */}

        <div className="flex items-center gap-3">
          <FaUniversity size={28} className="text-[#FF9710]" />

          <div>
            <h1 className="text-sm font-bold sm:text-xl">EDRMS</h1>

            <p className="hidden text-xs text-gray-300 sm:block">Deposit Reconciliation System</p>
          </div>
        </div>

        {/* Right Section */}

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 rounded-full bg-green-600/20 px-3 py-1 text-xs sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            LIVE
          </div>

          <FaBell className="hidden sm:block" />

          <FaUserCircle size={25} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
