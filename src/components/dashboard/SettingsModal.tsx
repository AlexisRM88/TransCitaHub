"use client";

import { ShieldCheck, LogOut, User, HelpCircle } from "lucide-react";

interface SettingsModalProps {
  user: { image?: string; name?: string; email?: string } | null | undefined;
  role: string | undefined;
  userId: string | undefined;
  userPueblo: string;
  onPuebloChange: (pueblo: string) => void;
  onUpdateRole: (role: string) => void;
  onClose: () => void;
  onSignOut: () => void;
  onStartTour?: () => void;
}

const PUEBLOS = ["San Juan", "Bayamón", "Carolina", "Mayagüez", "Ponce", "Caguas", "Guaynabo"];
const ROLES = ["Admin", "Patrono", "Negocio", "RSP"] as const;

export function SettingsModal({
  user,
  role,
  userId,
  userPueblo,
  onPuebloChange,
  onUpdateRole,
  onClose,
  onSignOut,
  onStartTour,
}: SettingsModalProps) {
  const isDevUser = user?.email === "cabuyacreativa@gmail.com";

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8 text-center">
          <div className="size-20 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden border-4 border-gray-50">
            {user?.image ? (
              <img src={user.image} alt="Profile" className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center text-gray-300">
                <User size={32} />
              </div>
            )}
          </div>
          <h3 className="text-xl font-black text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-500 font-medium mb-8">{user?.email}</p>

          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-2xl text-left">
              <p className="text-micro-label text-gray-600 mb-1">
                Pueblo de Residencia
              </p>
              <select
                value={userPueblo}
                onChange={(e) => onPuebloChange(e.target.value)}
                className="w-full bg-transparent font-bold text-gray-900 focus:outline-none"
              >
                {PUEBLOS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="h-px bg-gray-100 my-4" />

            {onStartTour && (
              <button
                onClick={onStartTour}
                className="w-full p-4 bg-primary/10 text-primary rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
              >
                <HelpCircle size={18} />
                Recorrido Guiado
              </button>
            )}

            {isDevUser && (
              <div className="p-4 bg-green-50 rounded-2xl text-left border border-green-100 mb-4 focus-within:ring-2 ring-primary/20 transition-all">
                <p className="text-micro-label text-primary mb-2 flex items-center gap-2">
                  <ShieldCheck size={12} />
                  Dev Role Switcher
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => onUpdateRole(r)}
                      className={`px-3 py-2 rounded-xl text-caption font-black uppercase tracking-tight transition-all border ${
                        role === r
                          ? "bg-primary text-gray-900 border-primary shadow-sm"
                          : "bg-white text-gray-400 border-gray-100 hover:border-primary/30"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <p className="text-caption text-primary/60 font-medium mt-2 leading-none">
                  Note: Use this to test different dashboard views.
                </p>
              </div>
            )}

            <button
              onClick={onSignOut}
              className="w-full p-4 bg-red-50 text-red-500 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>

            <button
              onClick={onClose}
              className="w-full p-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-gray-200"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
