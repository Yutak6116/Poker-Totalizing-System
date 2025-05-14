// src/pages/ReportsPage.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { formatISO } from "date-fns";
import { Button } from "../components/ui/button";
import ReportRow from "../components/ReportRow";

interface Report {
  id: string;
  date: string;
  buyInBB: number;
  endBB: number;
}

export default function ReportsPage() {
  const { gid } = useParams();
  const uid = auth.currentUser!.uid;

  /* 画面切替 state: "calendar" | "list" */
  const [view, setView] = useState<"calendar" | "list">("calendar");

  /* カレンダー関連 */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reportsByDate, setReportsByDate] = useState<Report[]>([]);

  /* 一覧関連 */
  const [allReports, setAllReports] = useState<Report[]>([]);
  const totalDiff = allReports.reduce(
    (sum, r) => sum + (r.endBB - r.buyInBB),
    0
  );

  /* -------- カレンダー用 listener -------- */
  useEffect(() => {
    if (!gid) return;
    const col = collection(db, "groups", gid, "players", uid, "reports");
    const q = query(
      col,
      where("date", "==", formatISO(selectedDate, { representation: "date" }))
    );
    const unsub = onSnapshot(q, (snap) =>
      setReportsByDate(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Report, "id">),
        }))
      )
    );
    return unsub;
  }, [selectedDate, gid]);

  /* -------- 一覧用 listener -------- */
  useEffect(() => {
    if (!gid) return;
    const col = collection(db, "groups", gid, "players", uid, "reports");
    const q = query(col, orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) =>
      setAllReports(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Report, "id">),
        }))
      )
    );
    return unsub;
  }, [gid]);

  /* -------- ヘルパー: Diff 表示色 -------- */
  const formatDiff = (d: number) =>
    d < 0 ? (
      <span className="text-red-600 font-semibold">{d} BB</span>
    ) : (
      <span className="font-semibold">+{d} BB</span>
    );

  return (
    <main className="container mx-auto max-w-3xl py-8 space-y-6">
      {/* ===== 1. 切替タブ ===== */}
      <div className="flex gap-2">
        <Button
          variant={view === "calendar" ? "default" : "outline"}
          onClick={() => setView("calendar")}
        >
          収支カレンダー
        </Button>
        <Button
          variant={view === "list" ? "default" : "outline"}
          onClick={() => setView("list")}
        >
          収支一覧
        </Button>
      </div>

      {/* ===== 2. カレンダー表示 ===== */}
      {view === "calendar" && (
        <>
          <Calendar
            value={selectedDate}
            onChange={(val) => setSelectedDate(val as Date)}
          />
          <h3 className="text-xl font-semibold">
            {formatISO(selectedDate, { representation: "date" })} の収支
          </h3>

          {reportsByDate.length === 0 ? (
            <p className="text-muted-foreground">報告がありません。</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2">日付</th>
                  <th className="px-4 py-2">Buy-in</th>
                  <th className="px-4 py-2">End</th>
                  <th className="px-4 py-2">Diff</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {reportsByDate.map((r) => (
                  <ReportRow
                    key={r.id}
                    gid={gid!}
                    id={r.id}
                    date={r.date}
                    buyInBB={r.buyInBB}
                    endBB={r.endBB}
                  />
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ===== 3. 一覧表示 ===== */}
      {view === "list" && (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-4 py-2">日付</th>
                <th className="px-4 py-2">Buy-in</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Diff</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {allReports.map((r) => (
                <ReportRow
                  key={r.id}
                  gid={gid!}
                  id={r.id}
                  date={r.date}
                  buyInBB={r.buyInBB}
                  endBB={r.endBB}
                />
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
