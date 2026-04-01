// src/components/shared/app-shell.tsx
import AppHeader from "./app-header";
import BottomNav from "./bottom-nav";
import { type Tables } from "@/types/database";

type Profile = Tables<'profiles'>;

export default function AppShell({ 
  children,
  profile 
}: { 
  children: React.ReactNode;
  profile: Profile | null;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader profile={profile} />
      <div className="flex flex-1">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
