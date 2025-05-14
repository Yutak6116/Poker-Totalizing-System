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
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useProfile } from "../hooks/useProfile";

export default function EditProfileModal() {
  const [open, setOpen] = useState(false);
  const { name } = useProfile();
  const [newName, setNewName] = useState("");

  const handleSave = async () => {
    if (!newName.trim()) return;
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      displayName: newName.trim(),
    });
    setNewName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">プロフィール変更</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>表示名を変更</DialogTitle>
        </DialogHeader>

        {/* 現在の名前をプレースホルダに表示 */}
        <Input
          placeholder={name ?? "Anonymous"}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <Button onClick={handleSave}>保存</Button>
      </DialogContent>
    </Dialog>
  );
}
