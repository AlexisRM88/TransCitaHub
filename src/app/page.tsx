"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { ProfileCardModal } from "@/components/dashboard/ProfileCardModal";
import { BeneficiosTab } from "@/components/dashboard/BeneficiosTab";
import { PerfilTab } from "@/components/dashboard/PerfilTab";
import { SocialWallTab } from "@/components/dashboard/SocialWallTab";
import { NegocioOfertasTab } from "@/components/dashboard/NegocioOfertasTab";

// Heavy tabs loaded on demand
const GestionTab = lazy(() => import("@/components/dashboard/GestionTab"));
const DesarrolloTab = lazy(() => import("@/components/dashboard/DesarrolloTab"));

function TabSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
    </div>
  );
}

export default function Home() {
  const { signOut } = useAuthActions();
  const currentData = useQuery(api.users.current);

  const isLoaded = currentData !== undefined;
  const user = currentData?.user;
  const profile = currentData?.profile;
  const userId = user?._id;
  const role = profile?.role;

  const [activeTab, setActiveTab] = useState("comunidad");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userPueblo, setUserPueblo] = useState("San Juan");
  const [profileProvisioned, setProfileProvisioned] = useState(false);

  const updateRole = useMutation(api.users.updateRole);
  const ensureProfile = useMutation(api.users.ensureProfile);
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (isLoaded && user && !profile && !profileProvisioned) {
      ensureProfile().then(() => setProfileProvisioned(true));
    }
  }, [isLoaded, user, profile, profileProvisioned, ensureProfile]);

  useEffect(() => {
    if (role === "Negocio") {
      setActiveTab("gestion");
    } else if (role === "Patrono" || role === "Admin") {
      setActiveTab("gestion");
    } else {
      setActiveTab("comunidad");
    }
  }, [role]);

  useEffect(() => {
    if (userId && user) {
      syncUser({
        userId: userId,
        email: user.email || "",
        fullName: user.name || "",
      }).catch((err) => console.error("Sync error:", err));
    }
  }, [userId, user, syncUser]);

  // --- Loading state ---
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  const userEmail = user?.email || "";
  const isTranscitaEmail = userEmail.endsWith("@transcita.com");
  const isWebmaster = userEmail === "cabuyacreativa@gmail.com";
  const hasAccess = isTranscitaEmail || isWebmaster;

  // --- Unauthenticated ---
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 text-white font-sans">
        <div className="max-w-md w-full p-8 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-6">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            TransCita Hub
          </h1>
          <p className="text-gray-400 text-center mb-8 font-medium">
            Plataforma Exclusiva para RSP y Personal Autorizado
          </p>
          <Link href="/sign-in" className="w-full">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(34,197,94,0.2)] flex justify-center min-h-[48px] items-center text-lg">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- Unauthorized domain ---
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-950 text-white text-center font-sans">
        <ShieldCheck size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-gray-400">Su cuenta ({userEmail}) no pertenece al dominio @transcita.com.</p>
        <p className="text-gray-500 mt-2 text-sm">Contacte a Cabuya Creativa o soporte técnico.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-28 font-sans">

      {isSettingsOpen && (
        <SettingsModal
          user={user}
          role={role}
          userId={userId}
          userPueblo={userPueblo}
          onPuebloChange={setUserPueblo}
          onUpdateRole={async (r) => {
            await updateRole({ userId: userId!, role: r as any });
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
          onSignOut={() => void signOut()}
        />
      )}

      {isProfileOpen && (
        <ProfileCardModal
          user={user}
          profile={profile}
          role={role}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      <DashboardHeader
        user={user}
        profile={profile}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main className="pt-2">
        {activeTab === "gestion" && (role === "Patrono" || role === "Negocio" || role === "Admin") && userId && (
          <Suspense fallback={<TabSpinner />}>
            <GestionTab role={role!} userId={userId} />
          </Suspense>
        )}

        {/* Tab exclusivo Negocio: gestión de ofertas */}
        {activeTab === "ofertas" && role === "Negocio" && userId && (
          <NegocioOfertasTab userId={userId} />
        )}

        {activeTab === "comunidad" && userId && (
          <BeneficiosTab userId={userId} />
        )}

        {/* Desarrollo solo visible para Patrono, Admin y RSP — nunca para Negocio */}
        {activeTab === "desarrollo" && role !== "Negocio" && (
          <Suspense fallback={<TabSpinner />}>
            <DesarrolloTab />
          </Suspense>
        )}

        {activeTab === "perfil" && userId && (
          <PerfilTab
            user={user}
            userId={userId}
            onViewCarnet={() => setIsProfileOpen(true)}
          />
        )}

        {activeTab === "nosotros" && (
          <SocialWallTab />
        )}
      </main>

      <BottomNav role={role} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
