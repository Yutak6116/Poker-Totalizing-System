import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Heading } from "../components/ui/typography";
import { Button } from "../components/ui/button";
import { LogOutIcon } from "lucide-react";
import GroupCard from "../components/GroupCard";
import JoinGroupModal from "../components/JoinGroupModal";
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
    <div className="min-h-screen bg-slate-50/60 p-6">
      <div className="mx-auto max-w-5xl flex items-center justify-between mb-8">
        <Heading level={1}>管理者ダッシュボード</Heading>
        <Button variant="outline" size="icon" onClick={() => auth.signOut()}>
          <LogOutIcon className="h-5 w-5" />
        </Button>
      </div>

      <section className="space-y-4">
        <Heading level={2}>あなたのグループ</Heading>
        {groups.length === 0 && (
          <p className="text-slate-500">まだグループがありません。</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </section>

      <div className="flex gap-4 mt-10">
        <JoinGroupModal />
        <CreateGroupModal />
      </div>
    </div>
  );
}
