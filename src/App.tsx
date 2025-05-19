import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlayerDashboard from "./pages/PlayerDashboard";
import PlayerGroupDetail from "./pages/PlayerGroupDetail";
import ReportsPage from "./pages/ReportsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGroupDetail from "./pages/AdminGroupDetail";
import RankingPage from "./pages/RankingPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player" element={<PlayerDashboard />} />
      <Route path="/player/group/:gid" element={<PlayerGroupDetail />} />
      <Route path="/player/group/:gid/reports" element={<ReportsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/group/:gid" element={<AdminGroupDetail />} />
      <Route path="/admin/group/:gid/ranking" element={<RankingPage />} />
      <Route path="/admin/group/:gid/history" element={<HistoryPage />} />
      {/* 404 Not Found */}
    </Routes>
  );
}
