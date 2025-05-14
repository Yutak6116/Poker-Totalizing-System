import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroupCard({ id, name }: { id: string; name: string }) {
  return (
    <Link to={`/admin/group/${id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold text-lg">{name}</h3>
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500">ID: {id}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
