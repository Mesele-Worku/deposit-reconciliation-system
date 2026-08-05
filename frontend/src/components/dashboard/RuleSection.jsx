import RuleCard from '../cards/RuleCard';
import RecentDepositSummary from './RecentDepositSummary';

const RuleSection = ({ rules, recentDeposit }) => {
  const ruleData = rules || {};
  console.log(recentDeposit);
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-[#232A78]">Reconciliation Rules</h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <RuleCard rule={ruleData.rule1} />

        <RuleCard rule={ruleData.rule2} />

        <RuleCard rule={ruleData.rule3} />
      </div>

      {ruleData.summary && (
        <div className="grid-col-1 mt-7 grid gap-6 xl:grid-cols-[30%_69%]">
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow">
            <h3 className="text-xl font-bold text-[#232A78]">Rule Summary</h3>

            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-300 px-10 py-16">
                <p className="text-sm text-gray-500">Total</p>

                <p className="text-3xl font-bold">{ruleData.summary.total}</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-green-700 px-10 py-16">
                <p className="text-sm text-green-600">Passed</p>

                <p className="text-3xl font-bold text-green-600">{ruleData.summary.passed}</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-700 px-10 py-16">
                <p className="text-sm text-red-600">Failed</p>

                <p className="text-3xl font-bold text-red-600">{ruleData.summary.failed}</p>
              </div>
            </div>
          </div>
          <RecentDepositSummary recentDeposit={recentDeposit} />
        </div>
      )}
    </section>
  );
};

export default RuleSection;
