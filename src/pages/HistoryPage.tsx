import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import { Heading } from "../components/ui/typography";

interface Log {
  id: string;
  date: string;
  player: string;
  diff: number;
  updatedAt: Date;
}

export default function HistoryPage() {
  const { gid } = useParams<{ gid: string }>();
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    (async () => {
      if (!gid) return;

      const list: Log[] = [];

      // 1) players 一覧
      const playersSnap = await getDocs(
        collection(db, "groups", gid, "players")
      );
      for (const player of playersSnap.docs) {
        const uid = player.id;
        const name = player.data().displayName ?? uid.slice(0, 6);

        // 2) 各プレイヤーの reports
        const reportsSnap = await getDocs(
          collection(db, "groups", gid, "players", uid, "reports")
        );
        reportsSnap.forEach((r) => {
          const d = r.data();
          list.push({
            id: r.id,
            date: d.date,
            player: name,
            diff: d.endBB - d.buyInBB,
            updatedAt: d.updatedAt?.toDate?.() ?? new Date(0),
          });
        });
      }

      // 3) updatedAt 降順で並べる
      list.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      setLogs(list);
    })();
  }, [gid]);

  return (
    <main className="container mx-auto max-w-lg py-8 space-y-6">
      <Heading level={2}>更新履歴</Heading>

      {logs.length === 0 ? (
        <p className="text-muted-foreground">履歴がありません。</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-2">日時</th>
              <th className="px-4 py-2">日付</th>
              <th className="px-4 py-2">プレイヤー</th>
              <th className="px-4 py-2">Diff</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b last:border-none">
                <td className="px-4 py-2">
                  {format(l.updatedAt, "yyyy-MM-dd HH:mm")}
                </td>
                <td className="px-4 py-2 text-center">{l.date}</td>
                <td className="px-4 py-2">{l.player}</td>
                <td
                  className={`px-4 py-2 text-right ${
                    l.diff < 0 ? "text-red-600" : ""
                  }`}
                >
                  {l.diff >= 0 ? "+" : ""}
                  {l.diff} BB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
