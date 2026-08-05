// import { Routes, Route } from 'react-router-dom';

// import Login from './pages/Login';

// import Dashboard from './pages/Dashboard';
// import UserManagement from './pages/users/UserManagment';
// import ProtectedRoute from './components/ProtectedRoute';

// import SchedulerManagement from './pages/SchedulerManagement';
// import NotificationManagement from './pages/NotificationManagment';
// function App() {
//   return (
//     <Routes>
//       <Route
//         path="/login"

//         element={<Login />}
//       />
//       <Route
//         path="/dashboard"

//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/users"

//         element={
//           <ProtectedRoute role="ADMIN">
//             <UserManagement />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="/admin/scheduler" element={<SchedulerManagement />} />
//       <Route path="/notifications" element={<NotificationManagement />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import UserManagement from './pages/users/UserManagment';

import ProtectedRoute from './components/ProtectedRoute';

import SchedulerManagement from './pages/SchedulerManagement';
import NotificationManagement from './pages/NotificationManagment';

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* User Management */}
      <Route
        path="/users"
        element={
          <ProtectedRoute role="ADMIN">
            <UserManagement />
          </ProtectedRoute>
        }
      />

      {/* Scheduler */}
      <Route
        path="/admin/scheduler"
        element={
          <ProtectedRoute role="ADMIN">
            <SchedulerManagement />
          </ProtectedRoute>
        }
      />

      {/* Notifications */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationManagement />
          </ProtectedRoute>
        }
      />

      {/* Any invalid URL */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
