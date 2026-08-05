const RecentJobsTable = ({ jobs }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-bold text-[#232A78]">Recent Jobs</h2>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-400 text-left text-gray-500">
            <th className="p-3">Job ID</th>

            <th className="p-3">Type</th>

            <th className="p-3">Run ID</th>

            <th className="p-3">Status</th>

            <th className="p-3">Start Time</th>
            <th className="p-3">End Time</th>
          </tr>
        </thead>

        <tbody>
          {jobs?.map((job) => (
            <tr key={job.JOB_ID} className="border-b border-b-gray-300">
              <td className="p-3">{job.JOB_ID}</td>

              <td className="p-3">{job.JOB_TYPE}</td>

              <td className="p-3">{job.RUN_ID || '-'}</td>

              <td className="p-3 font-bold">
                <span className={job.STATUS === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}>
                  {job.STATUS}
                </span>
              </td>

              <td className="p-0">{new Date(job.START_TIME).toLocaleString()}</td>
              <td className="p-0">{new Date(job.END_TIME).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {(!jobs || jobs.length === 0) && (
        <p className="py-5 text-center text-gray-500">No jobs found</p>
      )}
    </div>
  );
};

export default RecentJobsTable;
