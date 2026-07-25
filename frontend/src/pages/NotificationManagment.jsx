import { useEffect, useState } from 'react';

import notificationApi from '../api/notificationApi';

import Navbar from '../components/Navbar';

const NotificationManagement = () => {
  const [configs, setConfigs] = useState([]);

  const load = async () => {
    const data = await notificationApi.getConfig();

    setConfigs(data);
  };

  useEffect(() => {
    const init = async () => {
      await load();
    };

    init();
  }, []);

  const change = (index, e) => {
    const updated = [...configs];

    updated[index][e.target.name] = e.target.value;

    setConfigs(updated);
  };

  const save = async (item) => {
    try {
      await notificationApi.updateConfig({
        CONFIG_ID: item.CONFIG_ID,

        EMAIL_ENABLED: item.EMAIL_ENABLED,

        EMAIL_TO: item.EMAIL_TO,

        SUBJECT: item.SUBJECT,
      });

      alert('Notification updated successfully');
    } catch (error) {
      console.error('Notification update failed', error);

      alert('Notification update failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-[#232A78]">Notification Management</h1>

        {configs.map((item, index) => (
          <div key={item.CONFIG_ID} className="mb-5 rounded-xl bg-white p-5 shadow">
            <h2 className="mb-4 font-bold">{item.EVENT_TYPE}</h2>

            <label>Email Status</label>

            <select
              name="EMAIL_ENABLED"

              value={item.EMAIL_ENABLED}

              onChange={(e) => change(index, e)}

              className="mb-3 w-full border p-2"
            >
              <option>YES</option>

              <option>NO</option>
            </select>

            <label>Recipients</label>

            <input
              name="EMAIL_TO"

              value={item.EMAIL_TO}

              onChange={(e) => change(index, e)}

              className="mb-3 w-full border p-2"
            />

            <label>Subject</label>

            <input
              name="SUBJECT"

              value={item.SUBJECT}

              onChange={(e) => change(index, e)}

              className="mb-4 w-full border p-2"
            />

            <button
              onClick={() => save(item)}

              className="rounded bg-[#232A78] px-5 py-2 text-white"
            >
              Save
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default NotificationManagement;
