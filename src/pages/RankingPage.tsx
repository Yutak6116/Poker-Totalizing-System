import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Heading } from "../components/ui/typography";

interface Row {
  uid: string;
  name: string;
  totalDiff: number;
}

export default function RankingPage() {
  const { gid } = useParams<{ gid: string }>();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      if (!gid) return;
      const playersCol = collection(db, "groups", gid, "players");
      const playersSnap = await getDocs(playersCol);

      const result: Row[] = [];
      for (const playerDoc of playersSnap.docs) {
        const uid = playerDoc.id;
        const name = playerDoc.data().displayName ?? "Unknown";
        const reportsCol = collection(
          db,
          "groups",
          gid,
          "players",
          uid,
          "reports"
        );
        const reportsSnap = await getDocs(reportsCol);
        const totalDiff = reportsSnap.docs.reduce(
          (sum, d) => sum + (d.data().endBB - d.data().buyInBB),
          0
        );
        result.push({ uid, name, totalDiff });
      }
      // diff 降順でソート
      result.sort((a, b) => b.totalDiff - a.totalDiff);
      setRows(result);
    })();
  }, [gid]);

  return (
    <main className="container mx-auto max-w-lg py-8 space-y-6">
      <Heading level={2}>収支ランキング</Heading>
      <table className="w-full text-sm">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-4 py-2">順位</th>
            <th className="px-4 py-2">プレイヤー</th>
            <th className="px-4 py-2">総Diff</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.uid} className="border-b last:border-none">
              <td className="px-4 py-2 text-center">{idx + 1}</td>
              <td className="px-4 py-2">{r.name}</td>
              <td
                className={`px-4 py-2 text-right ${
                  r.totalDiff < 0 ? "text-red-600" : ""
                }`}
              >
                {r.totalDiff >= 0 ? "+" : ""}
                {r.totalDiff} BB
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
