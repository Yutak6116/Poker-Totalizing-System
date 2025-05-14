import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export function useProfile() {
  const [name, setName] = useState<string | null>(null);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "users", uid);

    // 初回ログイン時: ドキュメントが無ければ Google displayName を保存
    (async () => {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          displayName: auth.currentUser?.displayName ?? "Anonymous",
          createdAt: serverTimestamp(),
        });
      }
    })();

    // リアルタイム監視
    const unsub = onSnapshot(ref, (snap) => {
      setName((snap.data()?.displayName as string) ?? "Anonymous");
    });
    return unsub;
  }, [uid]);

  return { name };
}
