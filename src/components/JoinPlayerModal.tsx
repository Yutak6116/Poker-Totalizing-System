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
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { Loader2 } from "lucide-react";

export default function JoinPlayerModal() {
  const [gid, setGid] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleJoin = async () => {
    if (gid.length !== 6 || pw.length !== 6) {
      alert("ID とプレイヤーPW は 6桁です");
      return;
    }
    setLoading(true);
    try {
      const ref = doc(db, "groups", gid);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("グループが存在しません");

      const data = snap.data();
      if (data.playerPassword !== pw)
        throw new Error("プレイヤーパスワードが違います");

      await updateDoc(ref, {
        playerUids: arrayUnion(auth.currentUser!.uid),
      });
      const playerDoc = doc(
        db,
        "groups",
        gid.trim(),
        "players",
        auth.currentUser!.uid
      );
      if (!(await getDoc(playerDoc)).exists()) {
        await setDoc(playerDoc, {
          displayName: auth.currentUser!.displayName ?? "Anonymous",
        });
      }
      alert("グループに参加しました！");
      setGid("");
      setPw("");
      setOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof FirebaseError
          ? err.message
          : err instanceof Error
          ? err.message
          : "不明なエラー";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">グループに参加</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プレイヤー参加</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="グループID (6桁)"
          value={gid}
          onChange={(e) => setGid(e.target.value)}
          maxLength={6}
        />
        <Input
          placeholder="プレイヤーPW (6桁)"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          type="password"
          maxLength={6}
        />
        <Button onClick={handleJoin} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          参加する
        </Button>
      </DialogContent>
    </Dialog>
  );
}
