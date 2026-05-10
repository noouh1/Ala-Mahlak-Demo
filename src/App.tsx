import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import TripMonitoring from './pages/TripMonitoring';
import Alerts from './pages/Alerts';
import AssignDrivers from './pages/AssignDrivers';
import Support from './pages/Support';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="trips" element={<TripMonitoring />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="assign" element={<AssignDrivers />} />
        <Route path="support" element={<Support />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
