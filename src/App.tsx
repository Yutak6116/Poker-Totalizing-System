import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlayerDashboard from "./pages/PlayerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGroupDetail from "./pages/AdminGroupDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player" element={<PlayerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/group/:gid" element={<AdminGroupDetail />} />
    </Routes>
  );
}
