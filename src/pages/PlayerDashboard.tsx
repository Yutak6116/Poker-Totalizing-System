import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import JoinPlayerModal from "../components/JoinPlayerModal";
import GroupCard from "../components/GroupCard";
import { Heading } from "../components/ui/typography";

interface Group {
  id: string;
  name: string;
}

export default function PlayerDashboard() {
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
      where("playerUids", "array-contains", uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const list: Group[] = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
      }));
      setGroups(list);
    });
    return unsub;
  }, []);

  return (
    <main className="container mx-auto max-w-2xl py-10 space-y-8">
      <Heading level={2}>プレイヤーダッシュボード</Heading>

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
                to={`/player/group/${g.id}`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-4 mt-10">
        <JoinPlayerModal />
      </div>
    </main>
  );
}
