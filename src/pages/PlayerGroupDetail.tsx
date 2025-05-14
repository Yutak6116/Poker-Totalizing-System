import { useParams, Link } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import ReportEarningsModal from "../components/ReportEarningsModal";
import { Heading } from "../components/ui/typography";
import { Button } from "../components/ui/button";

export default function PlayerGroupDetail() {
  const { gid } = useParams();

  return (
    <main className="container mx-auto max-w-md py-10 space-y-6">
      <Heading level={2}>グループ詳細 (ID: {gid})</Heading>

      <div className="flex flex-col gap-4">
        <EditProfileModal />
        {/* gid を渡してレポート保存先を指定 */}
        <ReportEarningsModal gid={gid!} />

        <Link to={`/player/group/${gid}/reports`} className="w-full">
          <Button variant="outline" className="w-full">
            収支を確認する
          </Button>
        </Link>
      </div>
    </main>
  );
}
