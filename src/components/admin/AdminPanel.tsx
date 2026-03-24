"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Users, Tag, FileText, LayoutDashboard,
  ShieldCheck, Zap, ZapOff, Trash2, Plus,
  CheckCircle, X, ChevronRight, Search,
  TrendingUp, AlertCircle, Calendar, Clock, MapPin, ImagePlus, Loader2, Navigation
} from "lucide-react";

type BenefitType = "descuento" | "actividad";
import { AdminDocumentManager } from "@/components/AdminDocumentManager";
import { BranchManager } from "@/components/BranchManager";
import { Id } from "../../../convex/_generated/dataModel";

type AdminTab = "resumen" | "usuarios" | "beneficios" | "documentos";

const ROLES = ["Admin", "Patrono", "Negocio", "RSP", "Staff"] as const;
const CATEGORIES = ["Comida", "Gasolina", "Fitness", "Salud", "Entretenimiento", "Otro"];
const BASES = ["San Juan", "Bayamón", "Carolina", "Ponce", "Caguas"] as const;

// ── Resumen ──────────────────────────────────────────────────────────────────
const PREVIEW_ROLES = ["RSP", "Patrono", "Negocio", "Staff"] as const;

function ResumenSection({ onPreviewRole }: { onPreviewRole?: (role: string | null) => void }) {
  const profiles = useQuery(api.users.getAllProfiles);
  const benefits = useQuery(api.benefits.getAllBenefitsAdmin);
  const benefitAnalytics = useQuery(api.benefits.getAllBenefitsAnalytics);

  const roleCount = (r: string) => profiles?.filter((p) => p.role === r).length ?? 0;
  const liveCount = benefits?.filter((b) => b.isLive).length ?? 0;

  const sortedAnalytics = benefitAnalytics
    ? [...benefitAnalytics].sort((a, b) => b.opens7d - a.opens7d)
    : undefined;

  const stats = [
    { label: "RSPs Activos", value: roleCount("RSP"), color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Patronos", value: roleCount("Patrono"), color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Negocios", value: roleCount("Negocio"), color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Beneficios Vivos", value: liveCount, color: "text-primary", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={`${s.bg} rounded-[1.5rem] p-5 border border-white`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-5">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
          <TrendingUp size={12} /> Estado del Sistema
        </h4>
        <div className="space-y-3">
          {[
            { label: "Base de datos Convex", ok: true },
            { label: "Autenticación activa", ok: true },
            { label: "Beneficios sincronizados", ok: (liveCount ?? 0) > 0 },
            { label: "Perfiles registrados", ok: (profiles?.length ?? 0) > 0 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">{item.label}</span>
              <span className={`flex items-center gap-1 text-[10px] font-black uppercase ${item.ok ? "text-green-500" : "text-red-400"}`}>
                {item.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {item.ok ? "OK" : "Revisar"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefit Analytics Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-green-500" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Rendimiento de Beneficios — Últimos 7 días
          </h4>
        </div>
        {!sortedAnalytics ? (
          <p className="px-5 pb-5 text-xs text-gray-300 font-bold">Cargando...</p>
        ) : sortedAnalytics.length === 0 ? (
          <p className="px-5 pb-5 text-xs text-gray-300 font-bold">Sin beneficios aún.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {sortedAnalytics.map((b) => (
              <div key={b._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{b.merchantName}</p>
                  <p className="text-[10px] text-gray-400 font-medium truncate">{b.offerLabel}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <p className="text-xs font-black text-blue-600">{b.opens7d}</p>
                    <p className="text-[9px] text-gray-400 uppercase">Aperturas</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-600">{b.totalRedeems}</p>
                    <p className="text-[9px] text-gray-400 uppercase">Redenc.</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-orange-500">{b.conversionRate}%</p>
                    <p className="text-[9px] text-gray-400 uppercase">Conv.</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${b.isLive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {b.isLive ? "Live" : "Off"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview mode selector */}
      {onPreviewRole && (
        <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-1.5">
            👁 Previsualizar como Rol
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PREVIEW_ROLES.map((r) => (
              <button
                key={r}
                onClick={() => onPreviewRole(r)}
                className="py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-white border border-amber-100 text-amber-700 hover:bg-amber-100 transition-colors active:scale-95"
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-amber-400 font-medium mt-2 text-center">
            Verás la interfaz de ese rol con tus propios datos.
          </p>
        </div>
      )}

      <div className="bg-gray-950 rounded-[2rem] p-6 text-white">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Versión Beta</p>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">
          Actualmente en control total del desarrollador. Los cambios se sincronizan con Convex en tiempo real.
          Para dar autonomía a roles, usa el panel de Usuarios.
        </p>
      </div>
    </div>
  );
}

// ── Usuarios ─────────────────────────────────────────────────────────────────
function UsuariosSection() {
  const profiles = useQuery(api.users.getAllProfiles);
  const updateProfile = useMutation(api.users.updateProfile);
  const deleteProfile = useMutation(api.users.deleteProfile);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [editBase, setEditBase] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const filtered = profiles?.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.role.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleSave = async (userId: string) => {
    setSaving(true);
    try {
      await updateProfile({
        userId,
        role: editRole as any,
        base: editBase as any,
      });
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const ROLE_COLORS: Record<string, string> = {
    Admin: "bg-red-50 text-red-500 border-red-100",
    Patrono: "bg-purple-50 text-purple-500 border-purple-100",
    Negocio: "bg-orange-50 text-orange-500 border-orange-100",
    RSP: "bg-blue-50 text-blue-500 border-blue-100",
    Staff: "bg-gray-50 text-gray-400 border-gray-100",
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {profiles === undefined && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((p) => (
          <div key={p._id} className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden">
            {/* Row */}
            <div
              className="p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (editingId === p.userId) {
                  setEditingId(null);
                } else {
                  setEditingId(p.userId);
                  setEditRole(p.role);
                  setEditBase(p.base);
                }
              }}
            >
              <div className="size-10 rounded-2xl bg-green-50 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm leading-tight truncate">{p.fullName}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate">{p.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${ROLE_COLORS[p.role] ?? "bg-gray-50 text-gray-400"}`}>
                  {p.role}
                </span>
                <ChevronRight size={14} className={`text-gray-300 transition-transform ${editingId === p.userId ? "rotate-90" : ""}`} />
              </div>
            </div>

            {/* Edit panel */}
            {editingId === p.userId && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-50 space-y-3 bg-gray-50/50">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Rol</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Base</label>
                    <select
                      value={editBase}
                      onChange={(e) => setEditBase(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
                    >
                      {BASES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(p.userId)}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {saving ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" /> : <><CheckCircle size={12} /> Guardar</>}
                  </button>
                  <button
                    onClick={() => deleteProfile({ userId: p.userId })}
                    className="px-4 py-2.5 bg-red-50 text-red-400 rounded-xl font-black text-xs flex items-center gap-1 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && profiles !== undefined && (
        <div className="text-center py-8 text-gray-300">
          <Users size={32} className="mx-auto mb-2" />
          <p className="text-sm font-black">No hay usuarios</p>
        </div>
      )}
    </div>
  );
}

// ── Beneficios ───────────────────────────────────────────────────────────────
function BeneficiosSection() {
  const benefits = useQuery(api.benefits.getAllBenefitsAdmin);
  const adminCreate = useMutation(api.benefits.adminCreateBenefit);
  const adminUpdate = useMutation(api.benefits.adminUpdateBenefit);
  const adminToggle = useMutation(api.benefits.adminToggleBenefitLive);
  const adminDelete = useMutation(api.benefits.adminDeleteBenefit);
  const generateUploadUrl = useMutation(api.benefits.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null = create, string = edit
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageStorageId, setImageStorageId] = useState<string | null>(null);
  const [form, setForm] = useState({
    merchantName: "",
    offerLabel: "",
    category: "Comida",
    maxUses: 1,
    isLive: true,
    type: "descuento" as BenefitType,
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    lat: 18.2208,
    lng: -66.5901,
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      setImageStorageId(storageId);
    } finally {
      setUploading(false);
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
        }));
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  };

  const resetForm = () => {
    setForm({ merchantName: "", offerLabel: "", category: "Comida", maxUses: 1, isLive: true, type: "descuento", eventDate: "", eventTime: "", eventLocation: "", lat: 18.2208, lng: -66.5901 });
    setImagePreview(null);
    setImageStorageId(null);
    setEditingId(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const openEdit = (b: any) => {
    setEditingId(b._id);
    setForm({
      merchantName: b.merchantName,
      offerLabel: b.offerLabel,
      category: b.category === "Actividad" ? "Comida" : (b.category ?? "Comida"),
      maxUses: b.maxUses ?? 1,
      isLive: b.isLive ?? false,
      type: (b.type ?? "descuento") as BenefitType,
      eventDate: b.eventDate ?? "",
      eventTime: b.eventTime ?? "",
      eventLocation: b.eventLocation ?? "",
      lat: b.lat ?? 18.2208,
      lng: b.lng ?? -66.5901,
    });
    setImagePreview(b.imageUrl ?? null);
    setImageStorageId(null); // only set if a new image is uploaded
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.merchantName.trim() || !form.offerLabel.trim()) return;
    setSaving(true);
    try {
      const uses = Math.max(1, form.maxUses || 1);
      const shared = {
        merchantName: form.merchantName.trim(),
        offerLabel: form.offerLabel.trim(),
        category: form.type === "actividad" ? "Actividad" : form.category,
        isSingleUse: uses === 1,
        maxUses: uses,
        isLive: form.isLive,
        type: form.type,
        lat: form.lat,
        lng: form.lng,
        eventDate: form.eventDate || undefined,
        eventTime: form.eventTime || undefined,
        eventLocation: form.eventLocation || undefined,
        imageStorageId: imageStorageId as any ?? undefined,
      };
      if (editingId) {
        await adminUpdate({ benefitId: editingId, ...shared });
      } else {
        await adminCreate(shared);
      }
      resetForm();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {benefits?.length ?? 0} beneficios totales · {benefits?.filter(b => b.isLive).length ?? 0} en vivo
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
        >
          <Plus size={14} /> Nuevo
        </button>
      </div>

      {benefits === undefined && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        </div>
      )}

      <div className="space-y-2">
        {benefits?.map((b) => {
          const imgUrl = (b as any).imageUrl as string | null;
          return (
            <div
              key={b._id}
              onClick={() => openEdit(b)}
              className={`bg-white rounded-[1.5rem] border-2 p-4 flex items-center gap-3 transition-all cursor-pointer active:scale-[0.98] hover:shadow-md ${b.isLive ? "border-green-100" : "border-gray-100"}`}
            >
              {imgUrl ? (
                <img src={imgUrl} alt={b.merchantName} className="size-11 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className={`size-11 rounded-xl flex items-center justify-center flex-shrink-0 ${b.isLive ? "bg-green-50 text-primary" : "bg-gray-50 text-gray-300"}`}>
                  {(b as any).type === "actividad" ? <span className="text-lg">🏃</span> : <Tag size={16} />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-xs leading-tight truncate">{b.merchantName}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate">{b.offerLabel}</p>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">{b.category}</span>
                  <span className="text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-400 px-1.5 py-0.5 rounded-full">
                    {b.maxUses ?? 1} {(b.maxUses ?? 1) === 1 ? "uso" : "usos"}
                  </span>
                  {b.ownerId && <span className="text-[8px] font-black uppercase tracking-wider bg-orange-50 text-orange-400 px-1.5 py-0.5 rounded-full">Negocio</span>}
                  {!b.ownerId && <span className="text-[8px] font-black uppercase tracking-wider bg-green-50 text-green-500 px-1.5 py-0.5 rounded-full">Global</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => adminToggle({ benefitId: b._id })}
                  className={`size-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${b.isLive ? "bg-green-500 text-white shadow-sm shadow-green-200" : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500"}`}
                >
                  {b.isLive ? <Zap size={15} fill="currentColor" /> : <ZapOff size={15} />}
                </button>
                <button
                  onClick={() => adminDelete({ benefitId: b._id })}
                  className="size-9 rounded-xl flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 transition-all active:scale-90"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[90vh]">

            {/* Fixed header */}
            <div className="px-6 pt-5 pb-4 flex-shrink-0">
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900">{editingId ? "Editar Beneficio" : "Nuevo Beneficio Global"}</h3>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="size-9 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                  <X size={18} />
                </button>
              </div>

              {/* Tipo — siempre visible */}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: "descuento" }))}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    form.type === "descuento" ? "bg-primary text-white shadow-md shadow-green-200" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Tag size={14} />Descuento
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: "actividad" }))}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    form.type === "actividad" ? "bg-purple-500 text-white shadow-md shadow-purple-200" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Calendar size={14} />Actividad
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 pb-2 space-y-3">

              {/* Image picker */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">
                  Imagen <span className="text-gray-300 normal-case font-medium">(WebP/JPG/PNG · max 2MB · 800×500px recomendado)</span>
                </label>
                <label className={`relative flex items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                  imagePreview ? "border-primary/30 h-36" : "border-gray-200 h-24 hover:border-primary/40 hover:bg-green-50/30"
                }`}>
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-black">Cambiar imagen</p>
                      </div>
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 size={24} className="text-white animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-gray-400">
                      {uploading ? <Loader2 size={22} className="animate-spin text-primary" /> : <ImagePlus size={22} />}
                      <p className="text-xs font-black">{uploading ? "Subiendo…" : "Toca para subir imagen"}</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/webp,image/jpeg,image/png"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </label>
                {imageStorageId && !uploading && (
                  <p className="text-[10px] text-primary font-bold mt-1 ml-1">✓ Imagen lista</p>
                )}
              </div>

              <input
                type="text"
                value={form.merchantName}
                onChange={(e) => setForm((f) => ({ ...f, merchantName: e.target.value }))}
                placeholder={form.type === "actividad" ? "Nombre del evento" : "Nombre del negocio"}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                value={form.offerLabel}
                onChange={(e) => setForm((f) => ({ ...f, offerLabel: e.target.value }))}
                placeholder={form.type === "actividad" ? "Descripción del evento" : "Descripción de la oferta"}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              {form.type === "descuento" && (
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}

              {/* Usos — stepper */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">
                  {form.type === "actividad" ? "Inscripciones por persona" : "Usos por empleado"}
                </label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, maxUses: Math.max(1, f.maxUses - 1) }))}
                    className="size-11 rounded-2xl bg-gray-100 text-gray-600 font-black text-xl flex items-center justify-center active:scale-90 transition-all">−</button>
                  <input
                    type="number" min={1} value={form.maxUses}
                    onChange={(e) => setForm((f) => ({ ...f, maxUses: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-black text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, maxUses: f.maxUses + 1 }))}
                    className="size-11 rounded-2xl bg-gray-100 text-gray-600 font-black text-xl flex items-center justify-center active:scale-90 transition-all">+</button>
                </div>
                <p className="text-[10px] text-gray-300 mt-1.5 text-center">
                  {form.maxUses === 1 ? "Una sola vez por empleado" : `${form.maxUses} veces por empleado`}
                </p>
              </div>

              {/* Campos de actividad */}
              {form.type === "actividad" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1"><Calendar size={9} />Fecha</label>
                      <input type="date" value={form.eventDate}
                        onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                        className="w-full bg-purple-50 border border-purple-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1"><Clock size={9} />Hora</label>
                      <input type="time" value={form.eventTime}
                        onChange={(e) => setForm((f) => ({ ...f, eventTime: e.target.value }))}
                        className="w-full bg-purple-50 border border-purple-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1"><MapPin size={9} />Ubicación</label>
                    <input type="text" value={form.eventLocation}
                      onChange={(e) => setForm((f) => ({ ...f, eventLocation: e.target.value }))}
                      placeholder="Ej: Parque Luis Muñoz Marín, SJ"
                      className="w-full bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                </>
              )}

              {/* Coordenadas con GPS */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1">
                  <Navigation size={9} />Coordenadas de Ubicación Principal
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] text-gray-400 font-bold block mb-1 ml-1">Latitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.lat}
                      onChange={(e) => setForm((f) => ({ ...f, lat: parseFloat(e.target.value) || 18.2208 }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-gray-400 font-bold block mb-1 ml-1">Longitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.lng}
                      onChange={(e) => setForm((f) => ({ ...f, lng: parseFloat(e.target.value) || -66.5901 }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="text-[9px] text-transparent font-bold block mb-1 ml-1">GPS</label>
                    <button
                      type="button"
                      onClick={handleGPS}
                      disabled={geoLoading}
                      title="Usar mi ubicación actual"
                      className="size-[46px] rounded-2xl bg-blue-500 text-white flex items-center justify-center active:scale-90 transition-all disabled:opacity-50 shadow-md shadow-blue-200"
                    >
                      {geoLoading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-300 mt-1.5 ml-1">
                  Coordenada principal del negocio. Usa "Sucursales" para agregar múltiples ubicaciones.
                </p>
              </div>

              {/* Toggle publicar en vivo */}
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                <p className="text-sm font-black text-gray-900">Publicar en vivo inmediatamente</p>
                <button onClick={() => setForm((f) => ({ ...f, isLive: !f.isLive }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${form.isLive ? "bg-primary" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 size-5 bg-white rounded-full shadow transition-all ${form.isLive ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
                </button>
              </div>

              {/* Branch manager — only shown when editing an existing benefit */}
              {editingId && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <BranchManager
                    benefitId={editingId as Id<"benefits">}
                    benefitName={form.merchantName}
                  />
                </div>
              )}
            </div>

            {/* Fixed footer */}
            <div className="px-6 py-4 flex-shrink-0 border-t border-gray-50">
              <button
                onClick={handleSave}
                disabled={saving || uploading || !form.merchantName.trim() || !form.offerLabel.trim()}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-white ${
                  form.type === "actividad" ? "bg-purple-500 shadow-purple-200" : "bg-primary shadow-green-500/20"
                }`}
              >
                {saving
                  ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  : <><CheckCircle size={16} />{editingId ? "Guardar Cambios" : (form.type === "actividad" ? "Crear Actividad" : "Crear Beneficio")}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Documentos ───────────────────────────────────────────────────────────────
function DocumentosSection() {
  const profiles = useQuery(api.users.getAllProfiles);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const rsps = profiles?.filter((p) => p.role === "RSP" || p.role === "Staff") ?? [];
  const filtered = rsps.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );
  const selected = profiles?.find((p) => p.userId === selectedUserId);

  return (
    <div className="space-y-4">
      {!selectedUserId ? (
        <>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelectedUserId(p.userId)}
                className="w-full bg-white rounded-[1.5rem] border border-gray-100 p-4 flex items-center gap-3 hover:border-primary/20 transition-all text-left"
              >
                <div className="size-10 rounded-2xl bg-green-50 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                  {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm leading-tight truncate">{p.fullName}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{p.base}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
          {filtered.length === 0 && profiles !== undefined && (
            <div className="text-center py-8 text-gray-300">
              <FileText size={32} className="mx-auto mb-2" />
              <p className="text-sm font-black">No hay empleados</p>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedUserId(null)}
            className="flex items-center gap-2 text-primary font-black text-sm"
          >
            ← Volver a la lista
          </button>
          <div className="bg-white rounded-[2rem] border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-2xl bg-green-50 flex items-center justify-center text-primary font-black">
                {selected?.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-black text-gray-900">{selected?.fullName}</p>
                <p className="text-xs text-gray-400">{selected?.base} · {selected?.role}</p>
              </div>
            </div>
            <AdminDocumentManager userId={selectedUserId} />
          </div>
        </>
      )}
    </div>
  );
}

// ── Main AdminPanel ──────────────────────────────────────────────────────────
interface AdminPanelProps {
  onPreviewRole?: (role: string | null) => void;
}

export function AdminPanel({ onPreviewRole }: AdminPanelProps = {}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("resumen");

  const TABS: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: "resumen", label: "Resumen", icon: <LayoutDashboard size={16} /> },
    { key: "usuarios", label: "Usuarios", icon: <Users size={16} /> },
    { key: "beneficios", label: "Beneficios", icon: <Tag size={16} /> },
    { key: "documentos", label: "Docs", icon: <FileText size={16} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Admin header */}
      <div className="flex items-center gap-3">
        <div className="size-10 bg-red-50 rounded-2xl flex items-center justify-center">
          <ShieldCheck size={20} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 leading-tight">Admin Panel</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Control total · Beta</p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "resumen" && <ResumenSection onPreviewRole={onPreviewRole} />}
        {activeTab === "usuarios" && <UsuariosSection />}
        {activeTab === "beneficios" && <BeneficiosSection />}
        {activeTab === "documentos" && <DocumentosSection />}
      </div>
    </div>
  );
}
