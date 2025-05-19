import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  name: string;
  role?: "owner" | "admin";
  to: string;
}

export default function GroupCard({ id, name, role, to }: Props) {
  return (
    <Link
      to={to}
      className="block rounded-lg border p-4 shadow hover:bg-slate-50"
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold text-lg">{name}</h3>
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500">ID: {id}</p>
          {role && (
            <span
              className={
                role === "owner"
                  ? "rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                  : "rounded-full bg-slate-300 px-3 py-1 text-xs font-medium text-slate-800"
              }
            >
              {role === "owner" ? "Owner" : "Admin"}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
