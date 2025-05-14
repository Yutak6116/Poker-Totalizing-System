import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import EditReportModal from "./EditReportModal";

interface Props {
  gid: string;
  id: string;
  date: string;
  buyInBB: number;
  endBB: number;
}

export default function ReportRow({ gid, id, date, buyInBB, endBB }: Props) {
  const diff = endBB - buyInBB;
  const diffClass = diff < 0 ? "text-red-600 font-semibold" : "font-semibold";
  const diffDisp = diff < 0 ? diff : `+${diff}`;

  const [openEdit, setOpenEdit] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleDelete = async () => {
    await deleteDoc(
      doc(db, "groups", gid, "players", auth.currentUser!.uid, "reports", id)
    );
    setOpenAlert(false);
  };

  return (
    <>
      {/* ---- テーブル行 ---- */}
      <tr className="border-b last:border-none">
        <td className="px-4 py-2 text-center">{date}</td>
        <td className="px-4 py-2 text-center">{buyInBB} BB</td>
        <td className="px-4 py-2 text-center">{endBB} BB</td>
        <td className={`px-4 py-2 text-center ${diffClass}`}>{diffDisp} BB</td>
        {/* ⋮ メニュー */}
        <td className="px-2 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpenEdit(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                編集
              </DropdownMenuItem>

              <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Trash2 className="mr-2 h-4 w-4" />
                    削除
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      この収支を削除しますか？
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      削除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* 編集モーダル */}
      <EditReportModal
        gid={gid}
        reportId={id}
        buyInBB={buyInBB}
        endBB={endBB}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
    </>
  );
}
