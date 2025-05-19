import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Heading } from "../components/ui/typography";
// import { Button } from "../components/ui/button";
// import { LogOutIcon } from "lucide-react";
import GroupCard from "../components/GroupCard";
import JoinAdminModal from "../components/JoinAdminModal";
import CreateGroupModal from "../components/CreateGroupModal";

interface Group {
  id: string;
  name: string;
  createdBy: string;
}

export default function AdminDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) navigate("/");
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(
      collection(db, "groups"),
      where("adminUids", "array-contains", uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setGroups(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          createdBy: d.data().createdBy,
        }))
      );
    });
    return unsub;
  }, []);

  return (
    <main className="container mx-auto max-w-2xl py-10 space-y-8">
      <Heading level={2}>管理者ダッシュボード</Heading>

      {/* 自分が所属するグループ */}
      <section>
        <Heading level={3} className="mb-3">
          グループ一覧
        </Heading>
        {groups.length === 0 ? (
          <p className="text-muted-foreground">まだ参加していません。</p>
        ) : (
          <div className="grid gap-4">
            {groups.map((g) => (
              <GroupCard
                key={g.id}
                id={g.id}
                name={g.name}
                to={`/admin/group/${g.id}`}
                role={g.createdBy === auth.currentUser!.uid ? "owner" : "admin"}
              />
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-4 mt-10">
        <JoinAdminModal />
        <CreateGroupModal />
      </div>
    </main>
  );
}
