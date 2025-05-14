import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { isValid, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";

interface Props {
  gid: string;
}

export default function ReportEarningsModal({ gid }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!isValid(parseISO(date))) {
      alert("日付を YYYY-MM-DD で入力してください");
      return;
    }
    setLoading(true);
    try {
      const col = collection(
        db,
        "groups",
        gid,
        "players",
        auth.currentUser!.uid,
        "reports"
      );
      await addDoc(col, {
        date,
        buyInBB: Number(buyIn),
        endBB: Number(end),
        updatedAt: serverTimestamp(),
      });
      alert("収支を報告しました");
      setDate("");
      setBuyIn("");
      setEnd("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">収支報告</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>収支を報告</DialogTitle>
        </DialogHeader>

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          placeholder="バイイン (BB)"
          value={buyIn}
          onChange={(e) => setBuyIn(e.target.value)}
          type="number"
        />
        <Input
          placeholder="終了時スタック (BB)"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          type="number"
        />

        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          保存
        </Button>
      </DialogContent>
    </Dialog>
  );
}
