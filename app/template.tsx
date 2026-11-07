import { Suspense, type ReactNode } from "react";
import { ApplyPublicSettings } from "@/contexts/user-config";
import { getAppSettings } from "@/services/settings";
import { connection } from "next/server";

export default function Template({ children }: { children: ReactNode }) {
  return <><Suspense fallback={null}><Settings /></Suspense>{children}</>;
}

async function Settings() {
  await connection();
  return <ApplyPublicSettings settings={await getAppSettings()} />;
}
