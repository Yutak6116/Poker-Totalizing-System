import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Loader2 } from "lucide-react";

interface Props {
  gid: string;
  reportId: string;
  buyInBB: number;
  endBB: number;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function EditReportModal({
  gid,
  reportId,
  buyInBB,
  endBB,
  open,
  onOpenChange,
}: Props) {
  const [buyIn, setBuyIn] = useState(buyInBB.toString());
  const [end, setEnd] = useState(endBB.toString());
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const ref = doc(
      db,
      "groups",
      gid,
      "players",
      auth.currentUser!.uid,
      "reports",
      reportId
    );
    await updateDoc(ref, {
      buyInBB: Number(buyIn),
      endBB: Number(end),
    });
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>収支を編集</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buy‑in BB"
          value={buyIn}
          onChange={(e) => setBuyIn(e.target.value)}
          type="number"
        />
        <Input
          placeholder="End BB"
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
