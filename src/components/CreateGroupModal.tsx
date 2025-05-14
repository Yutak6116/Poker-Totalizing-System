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
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { PlusCircle } from "lucide-react";

export default function CreateGroupModal() {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    try {
      setLoading(true);
      await addDoc(collection(db, "groups"), {
        name: groupName.trim(),
        adminUids: [auth.currentUser!.uid],
        createdAt: serverTimestamp(),
      });
      setGroupName("");
      alert("グループを作成しました");
    } catch (e: unknown) {
      const msg = e instanceof FirebaseError ? e.message : "作成に失敗しました";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" /> 新規グループ作成
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader title="新規グループ作成" />
        <Input
          placeholder="グループ名を入力"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <DialogFooter>
          <Button disabled={loading} onClick={handleCreate}>
            {loading ? "作成中…" : "作成する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
