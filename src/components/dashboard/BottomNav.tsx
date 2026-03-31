"use client";

import { ShieldCheck, GraduationCap, Heart, User, Briefcase, Tag } from "lucide-react";

interface BottomNavProps {
  role: string | undefined;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_CLASSES =
  "fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-10 pt-4 px-8 z-50 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] lg:sticky lg:top-0 lg:w-64 lg:h-screen lg:shrink-0 lg:rounded-none lg:border-t-0 lg:border-r lg:pb-0 lg:pt-6 lg:px-3 lg:shadow-none lg:bg-white lg:order-first";

const INNER_CLASSES =
  "flex justify-between items-center max-w-md mx-auto relative lg:flex-col lg:items-stretch lg:gap-1 lg:max-w-none lg:mx-0";

function NavButton({
  label,
  icon,
  active,
  onClick,
  dataTour,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  dataTour?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-tour={dataTour}
      className={`flex flex-col items-center gap-1 transition-all flex-1 min-w-0 overflow-hidden lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:rounded-xl lg:flex-none lg:overflow-visible ${active ? "text-primary scale-110 lg:scale-100 lg:bg-green-50" : "text-gray-400 lg:hover:bg-gray-50"}`}
    >
      <div className={`p-1.5 rounded-2xl transition-all lg:p-0 ${active ? "bg-green-50 lg:bg-transparent" : ""}`}>
        {icon}
      </div>
      <span className="text-micro-label truncate w-full text-center lg:text-sm lg:tracking-normal lg:font-bold lg:normal-case lg:truncate-none lg:w-auto">{label}</span>
    </button>
  );
}

function SidebarBrand() {
  return (
    <div className="hidden lg:flex items-center gap-3 px-4 pb-6 mb-4 border-b border-gray-100">
      <div className="size-10 bg-primary rounded-xl flex items-center justify-center">
        <ShieldCheck size={20} className="text-white" />
      </div>
      <span className="font-black text-gray-900 text-lg">TransCita Hub</span>
    </div>
  );
}

export function BottomNav({ role, activeTab, setActiveTab }: BottomNavProps) {
  // ── Negocio: Gestión | Ofertas | Perfil ──────────────────────────────────
  if (role === "Negocio") {
    return (
      <nav className={NAV_CLASSES}>
        <SidebarBrand />
        <div className={INNER_CLASSES}>
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
            dataTour="nav-perfil"
          />
        </div>
      </nav>
    );
  }

  // ── Patrono / Admin: Gestión | Desarrollo | Beneficios | Perfil ──────────
  if (role === "Patrono" || role === "Admin") {
    return (
      <nav className={NAV_CLASSES}>
        <SidebarBrand />
        <div className={INNER_CLASSES}>
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
            dataTour="nav-beneficios"
          />
          <NavButton
            label="Perfil"
            icon={<User size={26} strokeWidth={activeTab === "perfil" ? 2.5 : 2} />}
            active={activeTab === "perfil"}
            onClick={() => setActiveTab("perfil")}
            dataTour="nav-perfil"
          />
        </div>
      </nav>
    );
  }

  // ── RSP (default): Beneficios | Desarrollo | Comunidad | Perfil ──────────
  return (
    <nav className={NAV_CLASSES}>
      <SidebarBrand />
      <div className={INNER_CLASSES}>
        <NavButton
          label="Beneficios"
          icon={<ShieldCheck size={26} strokeWidth={activeTab === "comunidad" ? 2.5 : 2} />}
          active={activeTab === "comunidad"}
          onClick={() => setActiveTab("comunidad")}
          dataTour="nav-beneficios"
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
          dataTour="nav-perfil"
        />
      </div>
    </nav>
  );
}
