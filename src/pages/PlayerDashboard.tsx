import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

/**
 * プレイヤー用ダッシュボード
 */
export default function PlayerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // 認証されていなければ HOME へリダイレクト
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/");
      setUser(u);
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">プレイヤーダッシュボード 🎉</h2>
      {user && <p>ようこそ, {user.displayName ?? "Anonymous"} さん!</p>}
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-md border shadow"
      >
        ログアウト
      </button>
    </main>
  );
}
