import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import EditProfileModal from "../components/EditProfileModal";
import ReportEarningsModal from "../components/ReportEarningsModal";
import { Heading } from "../components/ui/typography";
import { Button } from "../components/ui/button";

export default function PlayerGroupDetail() {
  const { gid } = useParams<{ gid: string }>();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState<string | null>(null);

  /* グループ名を取得 */
  useEffect(() => {
    if (!gid) return;
    (async () => {
      const snap = await getDoc(doc(db, "groups", gid));
      if (!snap.exists()) {
        alert("グループが見つかりません");
        navigate("/player");
        return;
      }
      setGroupName(snap.data().name as string);
    })();
  }, [gid]);

  if (!gid) return null;

  return (
    <main className="container mx-auto max-w-md py-10 space-y-6">
      {/* ----- タイトルをグループ名に ----- */}
      <Heading level={2}>
        {groupName ?? "読み込み中..."}{" "}
        <span className="text-sm">(ID: {gid})</span>
      </Heading>

      <div className="flex flex-col gap-4">
        <EditProfileModal />

        {/* Report モーダルに gid を渡す */}
        <ReportEarningsModal gid={gid} />

        <Link to={`/player/group/${gid}/reports`} className="w-full">
          <Button variant="outline" className="w-full">
            収支を確認する
          </Button>
        </Link>
      </div>
    </main>
  );
}
