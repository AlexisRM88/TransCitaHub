"use client";

import { Award, ShieldCheck, Star, Zap } from "lucide-react";
import { EmployeeDocuments } from "@/components/EmployeeDocuments";

interface PerfilTabProps {
  user: { image?: string } | null | undefined;
  userId: string;
  onViewCarnet: () => void;
}

export function PerfilTab({ user, userId, onViewCarnet }: PerfilTabProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-5 space-y-6">
      <header className="mb-4">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Mi Progreso</h2>
        <p className="text-sm text-gray-500 font-medium tracking-tight">Logros y estadísticas de RSP.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm border-b-4 border-b-primary flex flex-col items-center">
        <div className="size-16 relative mb-4">
          {user?.image ? (
            <img src={user.image} alt="Profile" className="size-full rounded-2xl object-cover" />
          ) : (
            <div className="size-full rounded-2xl bg-gray-100" />
          )}
          <div className="absolute -top-2 -right-2 bg-primary text-white size-8 rounded-full border-4 border-white flex items-center justify-center">
            <Star size={12} fill="currentColor" />
          </div>
        </div>
        <h3 className="text-lg font-black text-gray-900">Nivel 14</h3>
        <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden border border-gray-50">
          <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(0,143,57,0.3)]" />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">650 / 1000 XP para Nivel 15</p>
      </div>

      <EmployeeDocuments clerkId={userId} />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:scale-105 active:scale-95">
          <Award className="text-primary mb-3" size={24} />
          <p className="text-2xl font-black text-gray-900 leading-tight">12</p>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Insignias</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:scale-105 active:scale-95">
          <Zap className="text-orange-500 mb-3" size={24} />
          <p className="text-2xl font-black text-gray-900 leading-tight">4.9</p>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Calificación</p>
        </div>
      </div>

      <div className="bg-gray-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <ShieldCheck size={120} />
        </div>
        <div className="relative z-10">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Resumen de Carrera</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-white/10 pb-2">
              <span className="text-xs text-gray-400 font-medium">Servicios Realizados</span>
              <span className="text-xl font-black">1,240</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/10 pb-2">
              <span className="text-xs text-gray-400 font-medium">Antigüedad</span>
              <span className="text-xl font-black">2.5 Años</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onViewCarnet}
        className="w-full p-5 bg-primary text-gray-900 rounded-3xl font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
      >
        Ver carnet Digital
      </button>
    </div>
  );
}
