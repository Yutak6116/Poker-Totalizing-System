import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

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
      <div className="flex flex-col gap-4">
        <Link to={`/admin/group/${gid}/ranking`}>
          <Button className="w-full" variant="outline">
            収支ランキング
          </Button>
        </Link>
        <Link to={`/admin/group/${gid}/history`}>
          <Button className="w-full" variant="outline">
            更新履歴を閲覧
          </Button>
        </Link>
        <Link to={`/admin/group/${gid}/settings`}>
          <Button className="w-full" variant="outline">
            グループ設定
          </Button>
        </Link>
      </div>
    </main>
  );
}
