"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Plus, Zap, ZapOff, Trash2, Tag, Store, X, CheckCircle, Calendar, MapPin, Clock, Users } from "lucide-react";

interface NegocioOfertasTabProps {
  userId: string;
}

const CATEGORIES = ["Comida", "Gasolina", "Fitness", "Salud", "Entretenimiento", "Actividad", "Otro"];
type BenefitType = "descuento" | "actividad";

export function NegocioOfertasTab({ userId }: NegocioOfertasTabProps) {
  const offers = useQuery(api.benefits.getMyOffers, { ownerId: userId });
  const createOffer = useMutation(api.benefits.createOffer);
  const toggleLive = useMutation(api.benefits.toggleOfferLive);
  const deleteOffer = useMutation(api.benefits.deleteOffer);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    merchantName: "",
    offerLabel: "",
    category: "Comida",
    maxUses: 1,
    type: "descuento" as BenefitType,
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventCapacity: 0,
  });

  const handleCreate = async () => {
    if (!form.merchantName.trim() || !form.offerLabel.trim()) return;
    setSaving(true);
    try {
      const uses = Math.max(1, form.maxUses || 1);
      await createOffer({
        ownerId: userId,
        merchantName: form.merchantName.trim(),
        offerLabel: form.offerLabel.trim(),
        category: form.type === "actividad" ? "Actividad" : form.category,
        isSingleUse: uses === 1,
        maxUses: uses,
        type: form.type,
        ...(form.type === "actividad" ? {
          eventDate: form.eventDate || undefined,
          eventTime: form.eventTime || undefined,
          eventLocation: form.eventLocation || undefined,
          eventCapacity: form.eventCapacity > 0 ? form.eventCapacity : undefined,
        } : {}),
      });
      setForm({ merchantName: "", offerLabel: "", category: "Comida", maxUses: 1, type: "descuento", eventDate: "", eventTime: "", eventLocation: "", eventCapacity: 0 });
      setShowForm(false);
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
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Nueva
        </button>
      </header>

      {/* Summary pill */}
      <div className="flex gap-3">
        <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-primary">{liveCount}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700">En Vivo</p>
        </div>
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{(offers?.length ?? 0) - liveCount}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pausadas</p>
        </div>
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{offers?.length ?? 0}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</p>
        </div>
      </div>

      {/* Offer list */}
      <div className="space-y-3">
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
          <div
            key={offer._id}
            className={`bg-white rounded-[1.5rem] border-2 p-5 flex items-center gap-4 transition-all ${
              offer.isLive ? "border-green-100 shadow-sm shadow-green-50" : "border-gray-100"
            }`}
          >
            <div className={`size-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              offer.isLive ? "bg-green-50 text-primary" : "bg-gray-50 text-gray-300"
            }`}>
              <Tag size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-sm leading-tight truncate">{offer.merchantName}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{offer.offerLabel}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                  {offer.category}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-400 px-2 py-0.5 rounded-full">
                  {offer.maxUses ?? 1} {(offer.maxUses ?? 1) === 1 ? "uso" : "usos"}
                </span>
                {(offer as any).type === "actividad" && (
                  <span className="text-[9px] font-black uppercase tracking-widest bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full">
                    Evento
                  </span>
                )}
              </div>
              {(offer as any).type === "actividad" && (offer as any).eventDate && (
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={10} />{(offer as any).eventDate}</span>
                  {(offer as any).eventTime && <span className="flex items-center gap-1"><Clock size={10} />{(offer as any).eventTime}</span>}
                  {(offer as any).eventLocation && <span className="flex items-center gap-1 truncate"><MapPin size={10} />{(offer as any).eventLocation}</span>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
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
        ))}
      </div>

      {/* Create offer modal */}
      {showForm && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowForm(false)} />

          {/* Sheet — scrollable, max 90vh */}
          <div className="w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[90vh]">

            {/* Fixed header */}
            <div className="px-6 pt-5 pb-4 flex-shrink-0">
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900">Nueva Oferta</h3>
                <button onClick={() => setShowForm(false)} className="size-9 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                  <X size={18} />
                </button>
              </div>

              {/* Type selector — always visible */}
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

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">
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

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">
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

              {form.type === "descuento" && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {CATEGORIES.filter(c => c !== "Actividad").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              {/* Usos — siempre visible, default 1 */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">
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
                <p className="text-[10px] text-gray-300 mt-1.5 text-center">
                  {form.maxUses === 1 ? "Una sola vez por empleado" : `${form.maxUses} veces por empleado`}
                </p>
              </div>

              {/* Campos extra para actividad */}
              {form.type === "actividad" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1">
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1">
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1">
                      <MapPin size={9} />Ubicación
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1">
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
            </div>

            {/* Fixed footer — create button */}
            <div className="px-6 py-4 flex-shrink-0 border-t border-gray-50">
              <button
                onClick={handleCreate}
                disabled={saving || !form.merchantName.trim() || !form.offerLabel.trim()}
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
                    {form.type === "actividad" ? "Crear Actividad" : "Crear Oferta"}
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
