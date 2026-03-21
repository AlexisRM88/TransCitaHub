"use client";

import { ShieldCheck, GraduationCap, Heart, User, Briefcase } from "lucide-react";

interface BottomNavProps {
  role: string | undefined;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ role, activeTab, setActiveTab }: BottomNavProps) {
  const isManagement = role === "Patrono" || role === "Negocio" || role === "Admin";

  return (
    <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-10 pt-4 px-8 z-50 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-center max-w-md mx-auto relative h-12">

        {isManagement ? (
          <button
            onClick={() => setActiveTab("gestion")}
            className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === "gestion" ? "text-primary scale-110" : "text-gray-400"}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${activeTab === "gestion" ? "bg-green-50" : ""}`}>
              <Briefcase size={26} strokeWidth={activeTab === "gestion" ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">
              {role === "Patrono" ? "Equipo" : "Gestión"}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab("comunidad")}
            className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === "comunidad" ? "text-primary scale-110" : "text-gray-400"}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${activeTab === "comunidad" ? "bg-green-50" : ""}`}>
              <ShieldCheck size={26} strokeWidth={activeTab === "comunidad" ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Beneficios</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("desarrollo")}
          className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === "desarrollo" ? "text-primary scale-110" : "text-gray-400"}`}
        >
          <div className={`p-2 rounded-2xl transition-all ${activeTab === "desarrollo" ? "bg-green-50" : ""}`}>
            <GraduationCap size={26} strokeWidth={activeTab === "desarrollo" ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Desarrollo</span>
        </button>

        <button
          onClick={() => setActiveTab(isManagement ? "comunidad" : "nosotros")}
          className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${
            activeTab === "nosotros" || (activeTab === "comunidad" && isManagement)
              ? "text-primary scale-110"
              : "text-gray-400"
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all ${
            activeTab === "nosotros" || (activeTab === "comunidad" && isManagement) ? "bg-green-50" : ""
          }`}>
            {isManagement ? (
              <ShieldCheck size={26} strokeWidth={activeTab === "comunidad" ? 2.5 : 2} />
            ) : (
              <Heart size={26} strokeWidth={activeTab === "nosotros" ? 2.5 : 2} />
            )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">
            {isManagement ? "Beneficios" : "Comunidad"}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === "perfil" ? "text-primary scale-110" : "text-gray-400"}`}
        >
          <div className={`p-2 rounded-2xl transition-all ${activeTab === "perfil" ? "bg-green-50" : ""}`}>
            <User size={26} strokeWidth={activeTab === "perfil" ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Perfil</span>
        </button>

      </div>
    </nav>
  );
}
