const RuleCard = ({ rule }) => {
  if (!rule) {
    return null;
  }

  const statusColor =
    rule.status === 'PASS'
      ? 'border-green-500'
      : rule.status === 'FAIL'
        ? 'border-red-500'
        : 'border-yellow-400';

  const statusText =
    rule.status === 'PASS'
      ? 'text-green-600'
      : rule.status === 'FAIL'
        ? 'text-red-600'
        : 'text-yellow-600';

  return (
    <div className={`rounded-xl border-l-4 bg-white p-5 shadow ${statusColor} `}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-gray-700">{rule.name}</h3>

        <span className={`text-sm font-bold ${statusText} `}>{rule.status}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-8">
        <div className="text-center">
          <p className="text-sm text-gray-500">Expected</p>

          <p className="text-sm font-bold md:text-xl">{rule.expected?.toLocaleString() || '-'}</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Actual</p>

          <p className="text-sm font-bold md:text-xl">{rule.actual?.toLocaleString() || '-'}</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Difference</p>

          <p className={`font-bold ${rule.difference === 0 ? 'text-green-600' : 'text-red-600'} `}>
            {rule.difference?.toLocaleString() || 0}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">Result</p>

          <p className={`font-bold ${statusText} `}>{rule.status}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-600">
        {rule.message || 'No message'}
      </div>
    </div>
  );
};

export default RuleCard;
