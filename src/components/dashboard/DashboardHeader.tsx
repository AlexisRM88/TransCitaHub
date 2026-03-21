"use client";

import { Settings, User } from "lucide-react";

interface DashboardHeaderProps {
  user: { image?: string; name?: string } | null | undefined;
  profile: { fullName?: string; photoUrl?: string } | null | undefined;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

export function DashboardHeader({ user, profile, onProfileClick, onSettingsClick }: DashboardHeaderProps) {
  const displayName = (profile?.fullName || user?.name || "Compañero").split(" ")[0];
  const initials = (profile?.fullName || user?.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Priority: Convex Storage photo > auth provider photo
  const photoUrl = profile?.photoUrl || user?.image;

  return (
    <header className="flex items-center justify-between p-5 pb-4 bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onProfileClick}>
        <div className="relative">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="size-12 rounded-full border-2 border-primary object-cover" />
          ) : (
            <div className="size-12 rounded-full border-2 border-primary bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tight">{initials}</span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 leading-tight">Hola,</p>
          <h2 className="font-black text-gray-900 leading-tight hover:text-primary transition-colors">
            {displayName} 👋
          </h2>
        </div>
      </div>
      <button
        onClick={onSettingsClick}
        className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100"
      >
        <Settings size={22} strokeWidth={2.5} />
      </button>
    </header>
  );
}
