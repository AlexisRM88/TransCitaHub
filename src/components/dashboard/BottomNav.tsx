"use client";

import { ShieldCheck, GraduationCap, Heart, User, Briefcase, Tag } from "lucide-react";

interface BottomNavProps {
  role: string | undefined;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? "text-primary scale-110" : "text-gray-400"}`}
    >
      <div className={`p-2 rounded-2xl transition-all ${active ? "bg-green-50" : ""}`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

export function BottomNav({ role, activeTab, setActiveTab }: BottomNavProps) {
  // ── Negocio: Gestión | Ofertas | Perfil ──────────────────────────────────
  if (role === "Negocio") {
    return (
      <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-10 pt-4 px-8 z-50 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between items-center max-w-md mx-auto relative h-12">
          <NavButton
            label="Gestión"
            icon={<Briefcase size={26} strokeWidth={activeTab === "gestion" ? 2.5 : 2} />}
            active={activeTab === "gestion"}
            onClick={() => setActiveTab("gestion")}
          />
          <NavButton
            label="Ofertas"
            icon={<Tag size={26} strokeWidth={activeTab === "ofertas" ? 2.5 : 2} />}
            active={activeTab === "ofertas"}
            onClick={() => setActiveTab("ofertas")}
          />
          <NavButton
            label="Perfil"
            icon={<User size={26} strokeWidth={activeTab === "perfil" ? 2.5 : 2} />}
            active={activeTab === "perfil"}
            onClick={() => setActiveTab("perfil")}
          />
        </div>
      </nav>
    );
  }

  // ── Patrono / Admin: Gestión | Desarrollo | Beneficios | Perfil ──────────
  if (role === "Patrono" || role === "Admin") {
    return (
      <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-10 pt-4 px-8 z-50 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between items-center max-w-md mx-auto relative h-12">
          <NavButton
            label={role === "Patrono" ? "Equipo" : "Gestión"}
            icon={<Briefcase size={26} strokeWidth={activeTab === "gestion" ? 2.5 : 2} />}
            active={activeTab === "gestion"}
            onClick={() => setActiveTab("gestion")}
          />
          <NavButton
            label="Desarrollo"
            icon={<GraduationCap size={26} strokeWidth={activeTab === "desarrollo" ? 2.5 : 2} />}
            active={activeTab === "desarrollo"}
            onClick={() => setActiveTab("desarrollo")}
          />
          <NavButton
            label="Beneficios"
            icon={<ShieldCheck size={26} strokeWidth={activeTab === "comunidad" ? 2.5 : 2} />}
            active={activeTab === "comunidad"}
            onClick={() => setActiveTab("comunidad")}
          />
          <NavButton
            label="Perfil"
            icon={<User size={26} strokeWidth={activeTab === "perfil" ? 2.5 : 2} />}
            active={activeTab === "perfil"}
            onClick={() => setActiveTab("perfil")}
          />
        </div>
      </nav>
    );
  }

  // ── RSP (default): Beneficios | Desarrollo | Comunidad | Perfil ──────────
  return (
    <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-10 pt-4 px-8 z-50 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-center max-w-md mx-auto relative h-12">
        <NavButton
          label="Beneficios"
          icon={<ShieldCheck size={26} strokeWidth={activeTab === "comunidad" ? 2.5 : 2} />}
          active={activeTab === "comunidad"}
          onClick={() => setActiveTab("comunidad")}
        />
        <NavButton
          label="Desarrollo"
          icon={<GraduationCap size={26} strokeWidth={activeTab === "desarrollo" ? 2.5 : 2} />}
          active={activeTab === "desarrollo"}
          onClick={() => setActiveTab("desarrollo")}
        />
        <NavButton
          label="Comunidad"
          icon={<Heart size={26} strokeWidth={activeTab === "nosotros" ? 2.5 : 2} />}
          active={activeTab === "nosotros"}
          onClick={() => setActiveTab("nosotros")}
        />
        <NavButton
          label="Perfil"
          icon={<User size={26} strokeWidth={activeTab === "perfil" ? 2.5 : 2} />}
          active={activeTab === "perfil"}
          onClick={() => setActiveTab("perfil")}
        />
      </div>
    </nav>
  );
}
