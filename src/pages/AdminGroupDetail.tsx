import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function AdminGroupDetail() {
  const { gid } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");

  // 簡易ロード（詳細機能は別途）
  useEffect(() => {
    const fetch = async () => {
      if (!gid) return;
      const ref = doc(db, "groups", gid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        alert("グループが存在しません");
        navigate("/admin");
        return;
      }
      const data = snap.data();
      if (!data.adminUids?.includes(auth.currentUser?.uid)) {
        alert("管理権限がありません");
        navigate("/admin");
        return;
      }
      setName(data.name);
    };
    fetch();
  }, [gid]);

  return (
    <main className="container mx-auto max-w-2xl py-10">
      <h1 className="mb-6 text-3xl font-bold">{name} ― 詳細管理</h1>
      {/* ここにセッション管理・ランキングなど実装予定 */}
      <p className="text-slate-600">（機能追加予定）</p>
    </main>
  );
}
