import { useState } from 'react';

import api from '../../api/axios';

import { FaPlay } from 'react-icons/fa';

const RunReconciliation = () => {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    try {
      setLoading(true);

      await api.post('/reconciliation/run');

      alert('Reconciliation completed successfully');

      window.location.href = '/dashboard';
    } catch (error) {
      alert('Reconciliation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={run}

      disabled={loading}

      className="flex items-center gap-2 rounded-xl bg-[#ff9710] px-5 py-3 font-bold text-white"
    >
      <FaPlay />

      {loading ? 'Running...' : 'Run Reconciliation'}
    </button>
  );
};

export default RunReconciliation;
