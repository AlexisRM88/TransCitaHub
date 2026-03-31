"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Map, Moon, Zap } from "lucide-react";

interface ProfileCardModalProps {
  user: { image?: string; name?: string; email?: string; _id?: string } | null | undefined;
  profile: { fullName?: string; base?: string; photoUrl?: string } | null | undefined;
  role: string | undefined;
  onClose: () => void;
}

function usePRClock() {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function ProfileCardModal({ user, profile, role, onClose }: ProfileCardModalProps) {
  const now = usePRClock();

  const initials = (profile?.fullName?.trim() || user?.name?.trim() || user?.email?.split("@")[0] || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const idSuffix = String(user?._id || "").slice(-4).toUpperCase();
  const roleLabel = role === "Admin" ? "ADMIN" : role?.toUpperCase() ?? "RSP";

  // Priority: Convex Storage photo > auth provider photo
  const photoUrl = profile?.photoUrl || user?.image;

  const prDate = now.toLocaleDateString("es-PR", {
    timeZone: "America/Puerto_Rico",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prTime = now.toLocaleTimeString("es-PR", {
    timeZone: "America/Puerto_Rico",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div data-tour="carnet-modal" className="w-full max-w-[340px] max-h-[90vh] bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border-8 border-white animate-in zoom-in-95 duration-500 flex flex-col">

        {/* Header */}
        <div className="bg-primary p-6 py-4 text-white text-center flex-shrink-0">
          <h4 className="text-micro-label opacity-80 mb-1">Puerto Rico</h4>
          <h3 className="text-sm font-black uppercase tracking-widest leading-tight">
            Representante de Servicio al Pasajero
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 pt-4 flex-1 flex flex-col items-center overflow-y-auto custom-scrollbar pb-24">

          {/* Photo */}
          <div className="size-32 rounded-2xl bg-gray-100 mb-4 overflow-hidden border-4 border-gray-50 flex-shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-600">
                <span className="text-white font-black text-4xl tracking-tight">{initials}</span>
              </div>
            )}
          </div>

          {/* Name + role */}
          <div className="text-center w-full space-y-1 mb-4">
            <p className="text-micro-label text-primary">Colaborador TransCita</p>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {profile?.fullName?.trim() || user?.name?.trim() || user?.email?.split("@")[0] || "Colaborador"}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="bg-green-50 text-primary text-caption font-black px-3 py-1 rounded-full border border-green-100">
                BASE {(profile?.base || "San Juan").toUpperCase()}
              </span>
              <span className="bg-gray-50 text-gray-600 text-caption font-black px-3 py-1 rounded-full border border-gray-100">
                {roleLabel}-{idSuffix}
              </span>
            </div>
          </div>

          {/* Puerto Rico Live Clock */}
          <div className="w-full bg-gray-950 rounded-2xl px-5 py-4 mb-6 text-center">
            <p className="text-micro-label text-primary mb-1">
              Hora Oficial · Puerto Rico (AST)
            </p>
            <p className="text-3xl font-black text-white tabular-nums tracking-tight leading-none">
              {prTime}
            </p>
            <p className="text-caption font-medium text-gray-600 mt-1 capitalize">
              {prDate}
            </p>
          </div>

          {/* Achievements */}
          <div className="w-full space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 transition-all hover:bg-green-50">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Map size={20} />
              </div>
              <div className="flex-1">
                <p className="text-micro-label text-gray-600 leading-none mb-1">Meta Alcanzada</p>
                <p className="text-sm font-black text-gray-900 leading-tight">100 Tramos Completados</p>
              </div>
              <BadgeCheck className="text-primary" size={20} fill="currentColor" fillOpacity={0.1} />
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 transition-all hover:bg-blue-50">
              <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Moon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-micro-label text-gray-600 leading-none mb-1">Especialista</p>
                <p className="text-sm font-black text-gray-900 leading-tight">Guerrero Nocturno</p>
              </div>
              <BadgeCheck className="text-blue-500" size={20} fill="currentColor" fillOpacity={0.1} />
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 transition-all hover:bg-orange-50">
              <div className="size-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                <Zap size={20} />
              </div>
              <div className="flex-1">
                <p className="text-micro-label text-gray-600 leading-none mb-1">Próximo Nivel</p>
                <p className="text-sm font-black text-gray-900 leading-tight">50 Turnos Perfectos</p>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-orange-100 flex items-center justify-center text-caption font-black text-orange-500">
                80%
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all pointer-events-auto"
          >
            Cerrar Identificación
          </button>
        </div>

      </div>
    </div>
  );
}
