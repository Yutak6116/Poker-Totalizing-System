import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { randomNumeric } from "../lib/id";
import { Check, Loader2 } from "lucide-react";
import { FirebaseError } from "firebase/app";

export default function CreateGroupModal() {
  const [groupName, setGroupName] = useState("");
  const [created, setCreated] = useState<{
    id: string;
    playerPw: string;
    adminPw: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    setLoading(true);

    try {
      let gid = "";
      // 衝突する可能性は低いが、念のため最大 5 回試行
      for (let i = 0; i < 5; i++) {
        gid = randomNumeric(6);
        const ref = doc(db, "groups", gid);
        const exists = (await getDoc(ref)).exists();
        if (!exists) {
          const playerPw = randomNumeric(6);
          const adminPw = randomNumeric(8);

          await setDoc(ref, {
            groupId: gid,
            name: groupName.trim(),
            createdBy: auth.currentUser!.uid,
            playerPassword: playerPw,
            adminPassword: adminPw,
            adminUids: [auth.currentUser!.uid],
            playerUids: [],
            createdAt: serverTimestamp(),
          });
          // 成功したら情報を保存してループ終了
          setCreated({ id: gid, playerPw, adminPw });
          setGroupName("");
          return;
        }
      }
      throw new Error(
        "ID 生成に連続で失敗しました。時間をおいて再試行してください。"
      );
    } catch (err: unknown) {
      const msg =
        err instanceof FirebaseError
          ? err.message
          : err instanceof Error
          ? err.message
          : "不明なエラーが発生しました";
      alert(`作成に失敗: ${msg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">新規グループを作成</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規グループ作成</DialogTitle>
        </DialogHeader>

        {created ? (
          <div className="space-y-3">
            <p className="text-sm">
              <Check className="inline mr-1" />
              グループが作成されました！
            </p>
            <div className="rounded-md border p-3 text-sm bg-slate-50">
              <p>
                <strong>ID&nbsp;&nbsp;:</strong> {created.id}
              </p>
              <p>
                <strong>プレイヤーPW:</strong> {created.playerPw}
              </p>
              <p>
                <strong>管理者PW&nbsp;:</strong> {created.adminPw}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              ※必ずメモして参加者に共有してください
            </p>
          </div>
        ) : (
          <>
            <Input
              placeholder="グループ名"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Button onClick={handleCreate} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              作成する
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
