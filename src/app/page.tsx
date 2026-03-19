"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ShieldCheck,
  Settings,
  UserCircle,
  LogOut,
  CheckCircle,
  GraduationCap,
  Moon,
  MessageCircle,
  Share2,
  User,
  Star,
  Map,
  BadgeCheck,
  Zap,
  Heart,
  Briefcase
} from "lucide-react";
import { LMSPortal } from "@/components/LMSPortal";
import { CouponTimer } from "@/components/CouponTimer";
import { PatronoEvaluation } from "@/components/PatronoEvaluation";
import { BusinessDashboard } from "@/components/BusinessDashboard";
import { EmployeeDocuments } from "@/components/EmployeeDocuments";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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

  const updateRole = useMutation(api.users.updateRole);

  // Accordion state for benefits
  const [expandedBenefitId, setExpandedBenefitId] = useState<string | null>(null);
  const [activeRedeemingId, setActiveRedeemingId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Set the default tab based on the user's role once loaded
  useEffect(() => {
    if (role === "Patrono" || role === "Negocio" || role === "Admin") {
      setActiveTab("gestion");
    } else {
      setActiveTab("comunidad");
    }
  }, [role]);

  // User details state
  const [userPueblo, setUserPueblo] = useState<string>("San Juan");

  // Benefits data mapped to CouponTimer's BenefitItem interface
  const dbBenefits = useQuery(api.benefits.getBenefitsWithStatus, userId ? { clerkId: userId } : "skip");

  const [benefitsList, setBenefitsList] = useState<any[]>([]);

  // Social Wall Data
  const [wallPosts, setWallPosts] = useState([
    {
      id: 1,
      author: "TransCita",
      content: "¡Bienvenidos a nuestro nuevo Hub de Colaboradores! 🚀 Aquí estaremos compartiendo noticias y momentos especiales del equipo.",
      likes: 24,
      liked: false,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
      time: "2h"
    },
    {
      id: 2,
      author: "Recursos Humanos",
      content: "Celebrando el cumpleaños de nuestro compañero del mes. ¡Felicidades! 🎉",
      likes: 15,
      liked: true,
      image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000&auto=format&fit=crop",
      time: "5h"
    },
    {
      id: 3,
      author: "Operaciones",
      content: "Gran jornada hoy en el área Metro. Gracias a todos por su compromiso con el servicio al paciente. 🚑",
      likes: 31,
      liked: false,
      image: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?q=80&w=1000&auto=format&fit=crop",
      time: "1d"
    }
  ]);

  const handleLike = (id: number) => {
    setWallPosts(prev => prev.map(post => {
      if (post.id === id) {
        return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  // Metadata for benefits that aren't in the DB yet
  const benefitsMeta: Record<string, any> = {
    "Friend's Cafe PR": {
      id: "friendscafe",
      emoji: "☕",
      distance: "0.8 km",
      rating: "4.9",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
    },
    "Shell Puerto Rico": {
      id: "shellgas",
      emoji: "⛽",
      distance: "2.4 km",
      rating: "4.7",
      imageUrl: "https://images.unsplash.com/photo-1545147986-a9d6f210df77?q=80&w=1000&auto=format&fit=crop"
    },
    "Snap Fitness PR": {
      id: "snapfitness",
      emoji: "🏋️",
      distance: "3.1 km",
      rating: "4.8",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"
    },
    "El Mesón": {
      id: "elmeson",
      emoji: "🥪",
      distance: "1.2 km",
      rating: "4.9",
      imageUrl: "/elmeson.png"
    }
  };

  useEffect(() => {
    if (dbBenefits) {
      const mapped = dbBenefits.map(b => {
        const meta = benefitsMeta[b.merchantName] || {};
        return {
          id: b._id,
          title: b.merchantName,
          subtitle: b.offerLabel,
          emoji: meta.emoji || "🎁",
          distance: meta.distance || "N/A",
          rating: meta.rating || "5.0",
          category: b.category,
          imageUrl: meta.imageUrl || "https://images.unsplash.com/photo-1506784983877-455b4fedfd40",
          usesLeft: b.usesLeft ?? (b.status === "used" && b.isSingleUse ? 0 : 1),
          isSingleUse: b.isSingleUse || (b.maxUses ? b.maxUses === 1 : false)
        };
      });
      setBenefitsList(mapped);
    }
  }, [dbBenefits]);

  const redeemBenefit = useMutation(api.benefits.redeemBenefit);
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (userId && user) {
      syncUser({
        clerkId: userId,
        email: user.email || "",
        fullName: user.name || ""
      }).catch(err => console.error("Sync error:", err));
    }
  }, [userId, user, syncUser]);

  const handleConfirmRedeem = async (benefitId: string) => {
    // Sync with DB
    if (userId) {
      try {
        await redeemBenefit({ clerkId: userId, benefitId: benefitId });
      } catch (err) {
        console.error("DB Redemption error:", err);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const userEmail = user?.email || "";
  const isTranscitaEmail = userEmail.endsWith("@transcita.com");
  const isWebmaster = userEmail === "cabuyacreativa@gmail.com";
  const hasAccess = isTranscitaEmail || isWebmaster;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 text-white font-sans">
        <div className="max-w-md w-full p-8 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-6">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">TransCita Hub</h1>
          <p className="text-gray-400 text-center mb-8 font-medium">Plataforma Exclusiva para RSP y Personal Autorizado</p>
          <Link href="/sign-in" className="w-full">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(34,197,94,0.2)] flex justify-center min-h-[48px] items-center text-lg">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (userId && !hasAccess) {
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

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsSettingsOpen(false)} />
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 text-center">
              <div className="size-20 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden border-4 border-gray-50">
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center text-gray-300"><User size={32} /></div>
                )}
              </div>
              <h3 className="text-xl font-black text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-8">{user?.email}</p>

              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-2xl text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pueblo de Residencia</p>
                  <select
                    value={userPueblo}
                    onChange={(e) => setUserPueblo(e.target.value)}
                    className="w-full bg-transparent font-bold text-gray-900 focus:outline-none"
                  >
                    {["San Juan", "Bayamón", "Carolina", "Mayagüez", "Ponce", "Caguas", "Guaynabo"].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* Dev Role Switcher */}
                {user?.email === "cabuyacreativa@gmail.com" && (
                  <div className="p-4 bg-green-50 rounded-2xl text-left border border-green-100 mb-4 focus-within:ring-2 ring-primary/20 transition-all">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                       <ShieldCheck size={12} />
                       Dev Role Switcher
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Admin", "Patrono", "Negocio", "RSP"].map((r) => (
                        <button
                          key={r}
                          onClick={async () => {
                            await updateRole({ clerkId: userId!, role: r as any });
                            setIsSettingsOpen(false);
                          }}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                            role === r 
                              ? "bg-primary text-gray-900 border-primary shadow-sm" 
                              : "bg-white text-gray-400 border-gray-100 hover:border-primary/30"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <p className="text-[8px] text-primary/60 font-medium mt-2 leading-none">Note: Use this to test different dashboard views.</p>
                  </div>
                )}

                <button 
                  onClick={() => void signOut()}
                  className="w-full p-4 bg-red-50 text-red-500 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full p-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-gray-200"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ID Card / Driver License Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsProfileOpen(false)} />
          <div className="w-full max-w-[340px] max-h-[85vh] bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border-8 border-white animate-in zoom-in-95 duration-500 flex flex-col">
            {/* License Header - FIXED */}
            <div className="bg-primary p-6 py-4 text-white text-center flex-shrink-0">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Puerto Rico</h4>
              <h3 className="text-sm font-black uppercase tracking-widest leading-tight">Representante de Servicio al Pasajero</h3>
            </div>

            {/* License Content - SCROLLABLE */}
            <div className="p-6 pt-4 flex-1 flex flex-col items-center overflow-y-auto custom-scrollbar pb-24">
              <div className="size-32 rounded-2xl bg-gray-100 mb-6 overflow-hidden border-4 border-gray-50 flex-shrink-0">
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center text-gray-300 bg-gray-50"><User size={48} /></div>
                )}
              </div>

              <div className="text-center w-full space-y-1 mb-8">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Colaborador TransCita</p>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">{user?.name || "Alexis Roman"}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="bg-green-50 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-green-100">BASE MAYAGÜEZ</span>
                  <span className="bg-gray-50 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full border border-gray-100">RSP-9921</span>
                </div>
              </div>

              {/* Achievements / Gamification */}
              <div className="w-full space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 transition-all hover:bg-green-50">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Map size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Meta Alcanzada</p>
                    <p className="text-sm font-black text-gray-900 leading-tight">100 Tramos Completados</p>
                  </div>
                  <BadgeCheck className="text-primary" size={20} fill="currentColor" fillOpacity={0.1} />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 transition-all hover:bg-blue-50">
                  <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <Moon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Especialista</p>
                    <p className="text-sm font-black text-gray-900 leading-tight">Guerrero Nocturno</p>
                  </div>
                  <BadgeCheck className="text-blue-500" size={20} fill="currentColor" fillOpacity={0.1} />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 transition-all hover:bg-orange-50">
                  <div className="size-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                    <Zap size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Próximo Nivel</p>
                    <p className="text-sm font-black text-gray-900 leading-tight">50 Turnos Perfectos</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-orange-100 flex items-center justify-center text-[8px] font-black text-orange-500">80%</div>
                </div>
              </div>
            </div>

            {/* License Footer - FIXED */}
            <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full py-4 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all pointer-events-auto"
              >
                Cerrar Identificación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between p-5 pb-4 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsProfileOpen(true)}>
          <div className="relative">
            {user?.image ? (
              <img src={user.image} alt="Profile" className="size-12 rounded-full border-2 border-primary object-cover" />
            ) : (
              <div className="size-12 rounded-full border-2 border-primary bg-gray-200" />
            )}
            <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 leading-tight">Hola,</p>
            <h2 className="font-black text-gray-900 leading-tight hover:text-primary transition-colors">{user?.name?.split(' ')[0] || "Compañero"} 👋</h2>
          </div>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100"
        >
          <Settings size={22} strokeWidth={2.5} />
        </button>
      </header>

      <main className="pt-2">
        {/* Tabs Content */}
        <>
          {/* TAB: Gestión (Solo para Patrono, Negocio, Admin) */}
          {activeTab === "gestion" && (role === "Patrono" || role === "Negocio" || role === "Admin") && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-5">
              <header className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-1">
                  {role === "Patrono" ? "Mi Equipo" : role === "Negocio" ? "Mi Negocio" : "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500 font-medium tracking-tight">
                  Panel de control exclusivo.
                </p>
              </header>

              <div className="mb-8">
                {role === "Patrono" && userId && (
                  <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-green-50">
                    <PatronoEvaluation clerkId={userId} />
                  </div>
                )}
                {role === "Negocio" && userId && (
                  <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-green-50">
                    <BusinessDashboard clerkId={userId} />
                  </div>
                )}
                {role === "Admin" && userId && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-green-50">
                      <PatronoEvaluation clerkId={userId} />
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-green-50">
                      <BusinessDashboard clerkId={userId} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Comunidad (Beneficios - Cupones) */}
          {activeTab === "comunidad" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-5">
                <header className="mb-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Tus Beneficios</h2>
                  <p className="text-sm text-gray-500 font-medium tracking-tight">Exclusivos para el equipo TransCita.</p>
                </header>

                <div className="space-y-4">
                  {benefitsList.map((benefit) => (
                    <CouponTimer
                      key={benefit.id}
                      benefit={benefit}
                      isExpanded={expandedBenefitId === benefit.id}
                      onToggle={() => {
                        setExpandedBenefitId(expandedBenefitId === benefit.id ? null : benefit.id);
                      }}
                      activeRedeemingId={activeRedeemingId}
                      onRedeemStateChange={(id) => setActiveRedeemingId(id)}
                      onExpire={() => console.log("Expired", benefit.id)}
                      onConfirmRedeem={() => handleConfirmRedeem(benefit.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Desarrollo (LMS) */}
            {activeTab === "desarrollo" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <LMSPortal />
              </div>
            )}

            {/* TAB: Perfil */}
            {activeTab === "perfil" && (
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
                    <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(0,143,57,0.3)]"></div>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">650 / 1000 XP para Nivel 15</p>
                </div>

                {/* Documentos Requeridos */}
                {userId && <EmployeeDocuments clerkId={userId} />}

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
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2 tracking-widest">Resumen de Carrera</h4>
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
                  onClick={() => setIsProfileOpen(true)}
                  className="w-full p-5 bg-primary text-gray-900 rounded-3xl font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Ver carnet Digital
                </button>
              </div>
            )}

            {/* TAB: Nosotros */}
            {activeTab === "nosotros" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-5 space-y-6">
                <header className="mb-4">
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Comunidad HuB</h2>
                  <p className="text-sm text-gray-500 font-medium">Conecta con tus compañeros.</p>
                </header>

                <div className="space-y-6">
                  {wallPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
                      <div className="p-5 flex items-center gap-3">
                        <div className="size-10 bg-green-50 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {post.author.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-sm leading-tight">{post.author}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{post.time} • Público</p>
                        </div>
                      </div>
                      <div className="px-5 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{post.content}</p>
                      </div>
                      {post.image && (
                        <div className="w-full aspect-video bg-gray-100 overflow-hidden px-4 mb-2">
                          <img src={post.image} alt="Post content" className="w-full h-full object-cover rounded-3xl" />
                        </div>
                      )}
                      <div className="p-4 px-6 bg-gray-50/50 flex items-center gap-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 group transition-all ${post.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                        >
                          <Heart className={`transition-all ${post.liked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} size={20} />
                          <span className="text-xs font-black">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <MessageCircle size={20} />
                          <span className="text-xs font-black">Comentar</span>
                        </button>
                        <div className="flex-1" />
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
                  <div className="size-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 mx-auto mb-6">
                    <ShieldCheck size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">TransCita</h2>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                    Líderes en transportación médica en Puerto Rico. Comprometidos con la excelencia y el servicio al paciente.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-3xl">
                      <p className="text-2xl font-black text-gray-900 leading-tight">2008</p>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fundado</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-3xl">
                      <p className="text-2xl font-black text-gray-900 leading-tight">100%</p>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Local</p>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Información de Contacto</p>
                    <div className="space-y-4">
                      <div className="flex flex-col items-center">
                        <p className="text-sm font-black text-gray-900">Alexis Roman</p>
                        <a 
                          href="https://cabuyacreativa.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary font-bold hover:underline"
                        >
                          CabuyaCreativa.com
                        </a>
                      </div>
                      <div className="bg-green-50 py-3 px-6 rounded-2xl inline-block border border-green-100">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Para más información</p>
                        <p className="text-lg font-black text-primary">787-222-1044</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
      </main>

      {/* Navigation Bar - Visible for all authenticated users */}
      {userId && (
        <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-10 pt-4 px-8 z-50 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center max-w-md mx-auto relative h-12">

            {(role === "Patrono" || role === "Negocio" || role === "Admin") ? (
              <button
                onClick={() => setActiveTab("gestion")}
                className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === 'gestion' ? 'text-primary scale-110' : 'text-gray-400'}`}
              >
                <div className={`p-2 rounded-2xl transition-all ${activeTab === 'gestion' ? 'bg-green-50' : ''}`}>
                  <Briefcase size={26} strokeWidth={activeTab === 'gestion' ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {role === "Patrono" ? "Equipo" : "Gestión"}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("comunidad")}
                className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === 'comunidad' ? 'text-primary scale-110' : 'text-gray-400'}`}
              >
                <div className={`p-2 rounded-2xl transition-all ${activeTab === 'comunidad' ? 'bg-green-50' : ''}`}>
                  <ShieldCheck size={26} strokeWidth={activeTab === 'comunidad' ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Beneficios</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("desarrollo")}
              className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === 'desarrollo' ? 'text-primary scale-110' : 'text-gray-400'}`}
            >
              <div className={`p-2 rounded-2xl transition-all ${activeTab === 'desarrollo' ? 'bg-green-50' : ''}`}>
                <GraduationCap size={26} strokeWidth={activeTab === 'desarrollo' ? 2.5 : 2} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">Desarrollo</span>
            </button>

            {/* Mostrar botón de Beneficios solo si no es RSP (Porque RSP ya lo tiene al frente) o si queremos que Patrono lo vea como secundario. Vamos a mostrarlo siempre como segunda opción si eres Patrono, y si eres RSP ves "Comunidad". Mejor aún, dejo Comunidad y Beneficios para todos, pero reorganizado.
                Si eres Patron/Negocio: Gestión | Desarrollo | Comunidad | Perfil 
                Si eres RSP: Beneficios | Desarrollo | Comunidad | Perfil
            */}
            <button
              onClick={() => setActiveTab(role === "Patrono" || role === "Negocio" || role === "Admin" ? "comunidad" : "nosotros")}
              className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${(activeTab === 'nosotros' || (activeTab === 'comunidad' && (role === "Patrono" || role === "Negocio" || role === "Admin"))) ? 'text-primary scale-110' : 'text-gray-400'}`}
            >
              <div className={`p-2 rounded-2xl transition-all ${(activeTab === 'nosotros' || (activeTab === 'comunidad' && (role === "Patrono" || role === "Negocio" || role === "Admin"))) ? 'bg-green-50' : ''}`}>
                {(role === "Patrono" || role === "Negocio" || role === "Admin") ? (
                  <ShieldCheck size={26} strokeWidth={activeTab === 'comunidad' ? 2.5 : 2} />
                ) : (
                  <Heart size={26} strokeWidth={activeTab === 'nosotros' ? 2.5 : 2} />
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">
                {(role === "Patrono" || role === "Negocio" || role === "Admin") ? "Beneficios" : "Comunidad"}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("perfil")}
              className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === 'perfil' ? 'text-primary scale-110' : 'text-gray-400'}`}
            >
              <div className={`p-2 rounded-2xl transition-all ${activeTab === 'perfil' ? 'bg-green-50' : ''}`}>
                <User size={26} strokeWidth={activeTab === 'perfil' ? 2.5 : 2} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">Perfil</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
