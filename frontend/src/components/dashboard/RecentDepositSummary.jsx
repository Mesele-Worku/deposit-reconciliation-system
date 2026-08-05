const RecentDepositSummary = ({ recentDeposit }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-bold text-[#232A78]">Recent Warehouse Data</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-400 text-left text-gray-500">
            <th className="p-3">Business Date</th>

            <th className="p-3">Total Deposit</th>
            <th className="p-3">Total Retail</th>
            <th className="p-3">Total Segmentation</th>

            <th className="p-3">Total Conventional</th>

            <th className="p-3">Total IFB</th>
          </tr>
        </thead>

        <tbody>
          {recentDeposit?.map((recent) => (
            <tr key={recent.BUSINESS_DATE} className="border-b border-b-gray-300">
              <td className="p-3">{new Date(recent.BUSINESS_DATE).toLocaleString()}</td>
              <td className="p-3">{recent.TOTAL_DEPOSIT}</td>

              <td className="p-3">{recent.RETAIL_TOTAL_DEPOSIT}</td>

              <td className="p-3">{recent.SEGMENT_TOTAL_DEPOSIT || '-'}</td>

              <td className="p-3">{recent.TOTAL_CONVENTIONAL}</td>
              <td className="p-0">{recent.TOTAL_IFB}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {(!recentDeposit || recentDeposit.length === 0) && (
        <p className="py-5 text-center text-gray-500">No Data found</p>
      )}
    </div>
  );
};

export default RecentDepositSummary;
