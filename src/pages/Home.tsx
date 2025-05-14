import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { ShieldIcon } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = async (role: "player" | "admin") => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(role === "player" ? "/player" : "/admin");
    } catch {
      alert("Google ログインに失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-8 flex flex-col gap-6 items-center">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-700">
            Poker&nbsp;Totalizing&nbsp;System
          </h1>
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => handleLogin("player")}
          >
            <FaGoogle className="h-5 w-5" /> プレイヤーとしてログイン
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full gap-2"
            onClick={() => handleLogin("admin")}
          >
            <ShieldIcon className="h-5 w-5" /> 管理者としてログイン
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
