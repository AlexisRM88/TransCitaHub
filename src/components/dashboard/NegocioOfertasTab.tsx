"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Plus, Zap, ZapOff, Trash2, Tag, Store, X, CheckCircle,
  Calendar, MapPin, Clock, Users, Pencil, Navigation, ImagePlus, Loader2,
} from "lucide-react";
import { BranchManager } from "@/components/BranchManager";
import { Id } from "../../../convex/_generated/dataModel";

interface NegocioOfertasTabProps {
  userId: string;
}

const CATEGORIES = ["Comida", "Gasolina", "Fitness", "Salud", "Entretenimiento", "Otro"];
type BenefitType = "descuento" | "actividad";

const EMPTY_FORM = {
  merchantName: "",
  offerLabel: "",
  category: "Comida",
  maxUses: 1,
  isLive: false,
  type: "descuento" as BenefitType,
  eventDate: "",
  eventTime: "",
  eventLocation: "",
  eventCapacity: 0,
  lat: 18.2208,
  lng: -66.5901,
};

export function NegocioOfertasTab({ userId }: NegocioOfertasTabProps) {
  const offers = useQuery(api.benefits.getMyOffers, { ownerId: userId });
  const createOffer = useMutation(api.benefits.createOffer);
  const updateOffer = useMutation(api.benefits.updateOffer);
  const toggleLive = useMutation(api.benefits.toggleOfferLive);
  const deleteOffer = useMutation(api.benefits.deleteOffer);
  const generateUploadUrl = useMutation(api.benefits.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedBranchesId, setExpandedBranchesId] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageStorageId, setImageStorageId] = useState<string | null>(null);

  const [form, setForm] = useState({ ...EMPTY_FORM });

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setImagePreview(null);
    setImageStorageId(null);
    setShowForm(true);
  };

  const openEdit = (offer: any) => {
    setForm({
      merchantName: offer.merchantName,
      offerLabel: offer.offerLabel,
      category: offer.category === "Actividad" ? "Comida" : (offer.category ?? "Comida"),
      maxUses: offer.maxUses ?? 1,
      isLive: offer.isLive ?? false,
      type: (offer.type ?? "descuento") as BenefitType,
      eventDate: offer.eventDate ?? "",
      eventTime: offer.eventTime ?? "",
      eventLocation: offer.eventLocation ?? "",
      eventCapacity: offer.eventCapacity ?? 0,
      lat: offer.lat ?? 18.2208,
      lng: offer.lng ?? -66.5901,
    });
    setEditingId(offer._id);
    setImagePreview((offer as any).imageUrl ?? null);
    setImageStorageId(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setImagePreview(null);
    setImageStorageId(null);
  };

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
        eventCapacity: form.eventCapacity > 0 ? form.eventCapacity : undefined,
        ...(imageStorageId ? { imageStorageId: imageStorageId as any } : {}),
      };

      if (editingId) {
        await updateOffer({ benefitId: editingId, ...shared });
      } else {
        await createOffer({ ownerId: userId, ...shared });
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteOffer({ benefitId: id });
    } finally {
      setDeletingId(null);
    }
  };

  const liveCount = offers?.filter((o) => o.isLive).length ?? 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-5 space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Mis Ofertas</h2>
          <p className="text-sm text-gray-500 font-medium tracking-tight">
            Gestiona los beneficios visibles para los empleados.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Nueva
        </button>
      </header>

      {/* Summary pills */}
      <div className="flex gap-3">
        <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-primary">{liveCount}</p>
          <p className="text-micro-label text-green-700">En Vivo</p>
        </div>
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{(offers?.length ?? 0) - liveCount}</p>
          <p className="text-micro-label text-gray-600">Pausadas</p>
        </div>
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{offers?.length ?? 0}</p>
          <p className="text-micro-label text-gray-600">Total</p>
        </div>
      </div>

      {/* Offer list */}
      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {offers === undefined && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
          </div>
        )}
        {offers?.length === 0 && (
          <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 p-10 text-center">
            <Store size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-black text-gray-400">No tienes ofertas todavía.</p>
            <p className="text-xs text-gray-300 mt-1">Pulsa "Nueva" para crear la primera.</p>
          </div>
        )}
        {offers?.map((offer) => (
          <div key={offer._id} className="space-y-0">
            <div
              className={`bg-white rounded-[1.5rem] border-2 p-5 flex items-center gap-4 transition-all ${
                expandedBranchesId === offer._id ? "rounded-b-none border-b-0" : ""
              } ${offer.isLive ? "border-green-100 shadow-sm shadow-green-50" : "border-gray-100"}`}
            >
              {/* Icon / Image */}
              {(offer as any).imageUrl ? (
                <img src={(offer as any).imageUrl} alt={offer.merchantName} className="size-11 rounded-2xl object-cover flex-shrink-0" />
              ) : (
                <div className={`size-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  offer.isLive ? "bg-green-50 text-primary" : "bg-gray-50 text-gray-300"
                }`}>
                  {(offer as any).type === "actividad" ? <span className="text-lg">🏃</span> : <Tag size={20} />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm leading-tight truncate">{offer.merchantName}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{offer.offerLabel}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-micro-label bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {offer.category}
                  </span>
                  <span className="text-micro-label bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                    {offer.maxUses ?? 1} {(offer.maxUses ?? 1) === 1 ? "uso" : "usos"}
                  </span>
                  {(offer as any).type === "actividad" && (
                    <span className="text-micro-label bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full">
                      Evento
                    </span>
                  )}
                </div>
                {(offer as any).type === "actividad" && (offer as any).eventDate && (
                  <div className="flex items-center gap-3 mt-2 text-caption text-gray-600 font-medium flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={10} />{(offer as any).eventDate}</span>
                    {(offer as any).eventTime && <span className="flex items-center gap-1"><Clock size={10} />{(offer as any).eventTime}</span>}
                    {(offer as any).eventLocation && <span className="flex items-center gap-1 truncate"><MapPin size={10} />{(offer as any).eventLocation}</span>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Edit */}
                <button
                  onClick={() => openEdit(offer)}
                  title="Editar oferta"
                  className="size-10 rounded-2xl flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                >
                  <Pencil size={15} />
                </button>

                {/* Branches toggle */}
                <button
                  onClick={() => setExpandedBranchesId(expandedBranchesId === offer._id ? null : offer._id)}
                  title="Gestionar sucursales"
                  className={`size-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                    expandedBranchesId === offer._id
                      ? "bg-blue-500 text-white"
                      : "bg-blue-50 text-blue-400 hover:bg-blue-100"
                  }`}
                >
                  <MapPin size={16} />
                </button>

                {/* Live toggle */}
                <button
                  onClick={() => toggleLive({ benefitId: offer._id })}
                  title={offer.isLive ? "Quitar de vivo" : "Poner en vivo"}
                  className={`size-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                    offer.isLive
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500"
                  }`}
                >
                  {offer.isLive ? <Zap size={18} fill="currentColor" /> : <ZapOff size={18} />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(offer._id)}
                  disabled={deletingId === offer._id}
                  className="size-10 rounded-2xl flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 transition-all active:scale-90 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Branch manager — inline, collapsible */}
            {expandedBranchesId === offer._id && (
              <div className={`bg-white border-2 border-t-0 rounded-b-[1.5rem] px-5 pb-4 ${offer.isLive ? "border-green-100" : "border-gray-100"}`}>
                <BranchManager
                  benefitId={offer._id as Id<"benefits">}
                  benefitName={offer.merchantName}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={closeForm} />

          <div className="w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[90vh]">

            {/* Fixed header */}
            <div className="px-6 pt-5 pb-4 flex-shrink-0">
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900">
                  {editingId ? "Editar Oferta" : "Nueva Oferta"}
                </h3>
                <button onClick={closeForm} className="size-9 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                  <X size={18} />
                </button>
              </div>

              {/* Type selector */}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: "descuento" }))}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    form.type === "descuento"
                      ? "bg-primary text-white shadow-md shadow-green-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Tag size={15} />Descuento
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: "actividad", category: "Actividad" }))}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    form.type === "actividad"
                      ? "bg-purple-500 text-white shadow-md shadow-purple-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Calendar size={15} />Actividad
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 pb-2 space-y-4">

              {/* Image picker */}
              <div>
                <label className="text-micro-label text-gray-600 block mb-1.5">
                  Imagen <span className="text-gray-300 normal-case font-medium">(WebP/JPG/PNG · max 2MB)</span>
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
                  <p className="text-caption text-primary font-bold mt-1 ml-1">✓ Imagen lista</p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label className="text-micro-label text-gray-600 block mb-1.5">
                  {form.type === "actividad" ? "Nombre del Evento" : "Nombre del Negocio"}
                </label>
                <input
                  type="text"
                  value={form.merchantName}
                  onChange={(e) => setForm((f) => ({ ...f, merchantName: e.target.value }))}
                  placeholder={form.type === "actividad" ? "Ej: 5K TransCita Run" : "Ej: Friend's Café PR"}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="text-micro-label text-gray-600 block mb-1.5">
                  {form.type === "actividad" ? "Descripción" : "Descripción de la Oferta"}
                </label>
                <input
                  type="text"
                  value={form.offerLabel}
                  onChange={(e) => setForm((f) => ({ ...f, offerLabel: e.target.value }))}
                  placeholder={form.type === "actividad" ? "Ej: Carrera 5K - camiseta incluida" : "Ej: 10% de descuento en cualquier compra"}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Categoría — solo para descuentos */}
              {form.type === "descuento" && (
                <div>
                  <label className="text-micro-label text-gray-600 block mb-1.5">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              {/* Usos */}
              <div>
                <label className="text-micro-label text-gray-600 block mb-1.5">
                  {form.type === "actividad" ? "Inscripciones por persona" : "Usos por empleado"}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, maxUses: Math.max(1, f.maxUses - 1) }))}
                    className="size-11 rounded-2xl bg-gray-100 text-gray-600 font-black text-xl flex items-center justify-center active:scale-90 transition-all"
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    value={form.maxUses}
                    onChange={(e) => setForm((f) => ({ ...f, maxUses: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-black text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, maxUses: f.maxUses + 1 }))}
                    className="size-11 rounded-2xl bg-gray-100 text-gray-600 font-black text-xl flex items-center justify-center active:scale-90 transition-all"
                  >+</button>
                </div>
                <p className="text-caption text-gray-400 mt-1.5 text-center">
                  {form.maxUses === 1 ? "Una sola vez por empleado" : `${form.maxUses} veces por empleado`}
                </p>
              </div>

              {/* Campos extra para actividad */}
              {form.type === "actividad" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-micro-label text-gray-600 block mb-1.5 flex items-center gap-1">
                        <Calendar size={9} />Fecha
                      </label>
                      <input
                        type="date"
                        value={form.eventDate}
                        onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                        className="w-full bg-purple-50 border border-purple-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                    <div>
                      <label className="text-micro-label text-gray-600 block mb-1.5 flex items-center gap-1">
                        <Clock size={9} />Hora
                      </label>
                      <input
                        type="time"
                        value={form.eventTime}
                        onChange={(e) => setForm((f) => ({ ...f, eventTime: e.target.value }))}
                        className="w-full bg-purple-50 border border-purple-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-micro-label text-gray-600 block mb-1.5 flex items-center gap-1">
                      <MapPin size={9} />Ubicación del Evento
                    </label>
                    <input
                      type="text"
                      value={form.eventLocation}
                      onChange={(e) => setForm((f) => ({ ...f, eventLocation: e.target.value }))}
                      placeholder="Ej: Parque Luis Muñoz Marín, SJ"
                      className="w-full bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="text-micro-label text-gray-600 block mb-1.5 flex items-center gap-1">
                      <Users size={9} />Capacidad (opcional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.eventCapacity || ""}
                      onChange={(e) => setForm((f) => ({ ...f, eventCapacity: parseInt(e.target.value) || 0 }))}
                      placeholder="Sin límite"
                      className="w-full bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </>
              )}

              {/* Coordenadas con GPS */}
              <div>
                <label className="text-micro-label text-gray-600 block mb-1.5 flex items-center gap-1">
                  <Navigation size={9} />Coordenadas de Ubicación Principal
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-caption text-gray-600 font-bold block mb-1 ml-1">Latitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.lat}
                      onChange={(e) => setForm((f) => ({ ...f, lat: parseFloat(e.target.value) || 18.2208 }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-caption text-gray-600 font-bold block mb-1 ml-1">Longitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.lng}
                      onChange={(e) => setForm((f) => ({ ...f, lng: parseFloat(e.target.value) || -66.5901 }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="text-caption text-transparent font-bold block mb-1 ml-1">GPS</label>
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
                <p className="text-caption text-gray-400 mt-1.5 ml-1">
                  Usa el botón GPS para capturar tu ubicación actual, o agrega sucursales por separado con el botón 📍
                </p>
              </div>

              {/* Toggle publicar en vivo */}
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                <div>
                  <p className="text-sm font-black text-gray-900">Publicar en vivo</p>
                  <p className="text-caption text-gray-600 font-medium">Los empleados podrán ver esta oferta</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isLive: !f.isLive }))}
                  className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${form.isLive ? "bg-primary" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 size-5 bg-white rounded-full shadow transition-all ${form.isLive ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
                </button>
              </div>

              {/* Branch manager — only shown when editing */}
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
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-white ${
                  form.type === "actividad"
                    ? "bg-purple-500 shadow-purple-200"
                    : "bg-primary shadow-green-500/20"
                }`}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <CheckCircle size={16} />
                    {editingId
                      ? "Guardar Cambios"
                      : form.type === "actividad"
                      ? "Crear Actividad"
                      : "Crear Oferta"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
