"use client";

import { PatronoEvaluation } from "@/components/PatronoEvaluation";
import { BusinessDashboard } from "@/components/BusinessDashboard";
import { AdminPanel } from "@/components/admin/AdminPanel";

interface GestionTabProps {
  role: string;
  userId: string;
  onPreviewRole?: (role: string | null) => void;
}

export default function GestionTab({ role, userId, onPreviewRole }: GestionTabProps) {
  if (role === "Admin") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-5">
        <AdminPanel onPreviewRole={onPreviewRole} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-5">
      <header className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 mb-1">
          {role === "Patrono" ? "Mi Equipo" : "Mi Negocio"}
        </h2>
        <p className="text-sm text-gray-500 font-medium tracking-tight">Panel de control exclusivo.</p>
      </header>

      <div className="mb-8">
        {role === "Patrono" && (
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-green-50">
            <PatronoEvaluation userId={userId} />
          </div>
        )}
        {role === "Negocio" && (
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-green-50">
            <BusinessDashboard userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
}
