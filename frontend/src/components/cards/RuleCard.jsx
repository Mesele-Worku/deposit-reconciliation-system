const RuleCard = ({ rule }) => {
  const statusColor =
    rule.status === 'PASS'
      ? 'border-green-500'
      : rule.status === 'FAIL'
        ? 'border-red-500'
        : 'border-yellow-400';

  return (
    <div className={`rounded-xl border-l-4 bg-white p-4 shadow sm:p-5 ${statusColor} w-full`}>
      <h3 className="text-sm font-bold break-words sm:text-base">{rule.name}</h3>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Difference</p>

          <p className="text-sm font-bold sm:text-lg">{rule.difference.toLocaleString()}</p>
        </div>

        <span className="text-sm font-bold">{rule.status}</span>
      </div>
    </div>
  );
};

export default RuleCard;
