import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import UserManagement from './pages/users/UserManagment';
import ProtectedRoute from './components/ProtectedRoute';
import RunReconciliation from './pages/reconciliation/RunReconciliation';
import SchedulerManagement from './pages/SchedulerManagement';
import NotificationManagement from './pages/NotificationManagment';
function App() {
  return (
    <Routes>
      <Route
        path="/login"

        element={<Login />}
      />
      <Route
        path="/dashboard"

        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"

        element={
          <ProtectedRoute role="ADMIN">
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reconciliation/run"

        element={
          <ProtectedRoute role="ADMIN">
            <RunReconciliation />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/scheduler" element={<SchedulerManagement />} />
      <Route path="/notifications" element={<NotificationManagement />} />
    </Routes>
  );
}

export default App;
