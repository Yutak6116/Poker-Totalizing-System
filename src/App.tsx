import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlayerDashboard from "./pages/PlayerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGroupDetail from "./pages/AdminGroupDetail";
import PlayerGroupDetail from "./pages/PlayerGroupDetail";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player" element={<PlayerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/group/:gid" element={<AdminGroupDetail />} />
      <Route path="/player/group/:gid" element={<PlayerGroupDetail />} />
      <Route path="/player/group/:gid/reports" element={<ReportsPage />} />
    </Routes>
  );
}
