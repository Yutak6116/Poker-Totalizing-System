import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Loader2 } from "lucide-react";
import { FirebaseError } from "firebase/app";

export default function JoinAdminModal() {
  const [gid, setGid] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleJoin = async () => {
    if (gid.length !== 6 || adminPw.length !== 8) {
      alert("ID は 6 桁、管理者 PW は 8 桁で入力してください");
      return;
    }
    setLoading(true);
    try {
      const ref = doc(db, "groups", gid);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("グループが存在しません");

      const data = snap.data();
      if (data.adminPassword !== adminPw) {
        throw new Error("管理者パスワードが違います");
      }

      await updateDoc(ref, {
        adminUids: arrayUnion(auth.currentUser!.uid),
      });
      alert("管理者として参加しました");
      setGid("");
      setAdminPw("");
      setOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof FirebaseError
          ? err.message
          : err instanceof Error
          ? err.message
          : "不明なエラーが発生しました";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">既存グループに参加</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>既存グループに管理者参加</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="グループ ID (6 桁)"
          value={gid}
          onChange={(e) => setGid(e.target.value)}
          maxLength={6}
        />
        <Input
          placeholder="管理者パスワード (8 桁)"
          value={adminPw}
          onChange={(e) => setAdminPw(e.target.value)}
          type="password"
          maxLength={8}
        />
        <Button onClick={handleJoin} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          参加する
        </Button>
      </DialogContent>
    </Dialog>
  );
}
