import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { FirebaseError } from "firebase/app";

export default function JoinGroupModal() {
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!groupId.trim()) return;
    try {
      setLoading(true);
      const ref = doc(db, "groups", groupId.trim());
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("グループが存在しません");
      await updateDoc(ref, { adminUids: arrayUnion(auth.currentUser!.uid) });
      setGroupId("");
      alert("参加しました");
    } catch (e: unknown) {
      const msg = e instanceof FirebaseError ? e.message : "参加に失敗しました";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">既存グループに参加</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader title="既存グループに管理者参加" />
        <Input
          placeholder="グループIDを入力"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <DialogFooter>
          <Button disabled={loading} onClick={handleJoin}>
            {loading ? "参加中…" : "参加する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
