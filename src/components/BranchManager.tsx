"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  Plus, MapPin, Pencil, Trash2, Navigation, Check, X,
  ExternalLink, Link2, AlertCircle, CheckCircle2, Loader2,
} from "lucide-react";

interface BranchManagerProps {
  benefitId: Id<"benefits">;
  benefitName: string;
}

interface BranchForm {
  name: string;
  lat: string;
  lng: string;
  address: string;
  mapsUrl: string;
}

type GeoState = "idle" | "loading" | "success" | "denied" | "unavailable" | "timeout";

const EMPTY_FORM: BranchForm = { name: "", lat: "", lng: "", address: "", mapsUrl: "" };

// Extract lat/lng from various Google Maps URL formats
function parseGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  const trimmed = url.trim();

  // @lat,lng,zoom pattern (most common share link)
  const atMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

  // q=lat,lng pattern
  const qMatch = trimmed.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

  // ll=lat,lng pattern
  const llMatch = trimmed.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };

  // !3dlat!4dlng pattern (embedded maps)
  const d3Match = trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (d3Match) return { lat: parseFloat(d3Match[1]), lng: parseFloat(d3Match[2]) };

  // plain "lat,lng" (user types coordinates directly)
  const plainMatch = trimmed.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  if (plainMatch) return { lat: parseFloat(plainMatch[1]), lng: parseFloat(plainMatch[2]) };

  return null;
}

const GEO_MESSAGES: Record<GeoState, { text: string; color: string } | null> = {
  idle: null,
  loading: null,
  success: { text: "Ubicación capturada", color: "text-green-600" },
  denied: { text: "Permiso de ubicación denegado. Usa el enlace de Google Maps en su lugar.", color: "text-red-500" },
  unavailable: { text: "GPS no disponible en este dispositivo.", color: "text-orange-500" },
  timeout: { text: "Tardó demasiado. Intenta de nuevo o usa un enlace de mapa.", color: "text-orange-500" },
};

export function BranchManager({ benefitId, benefitName }: BranchManagerProps) {
  const branches = useQuery(api.benefits.getBranchesByBenefit, { benefitId });
  const addBranch = useMutation(api.benefits.addBranch);
  const updateBranch = useMutation(api.benefits.updateBranch);
  const deleteBranch = useMutation(api.benefits.deleteBranch);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"benefit_branches"> | null>(null);
  const [form, setForm] = useState<BranchForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── GPS ──────────────────────────────────────────────────────────────────────
  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGeoState("unavailable");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
          mapsUrl: "",
        }));
        setGeoState("success");
      },
      (err) => {
        if (err.code === 1) setGeoState("denied");
        else if (err.code === 2) setGeoState("unavailable");
        else setGeoState("timeout");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── Google Maps URL / coordinates paste ──────────────────────────────────────
  const handleMapsUrl = (value: string) => {
    setForm((f) => ({ ...f, mapsUrl: value }));
    const parsed = parseGoogleMapsUrl(value);
    if (parsed) {
      setForm((f) => ({
        ...f,
        mapsUrl: value,
        lat: parsed.lat.toFixed(6),
        lng: parsed.lng.toFixed(6),
      }));
      setGeoState("idle");
    }
  };

  // ── Form helpers ─────────────────────────────────────────────────────────────
  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setGeoState("idle");
    setShowForm(true);
  };

  const openEditForm = (branch: { _id: Id<"benefit_branches">; name: string; lat: number; lng: number; address?: string }) => {
    setEditingId(branch._id);
    setForm({
      name: branch.name,
      lat: String(branch.lat),
      lng: String(branch.lng),
      address: branch.address ?? "",
      mapsUrl: "",
    });
    setGeoState("idle");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setGeoState("idle");
  };

  const handleSave = async () => {
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (!form.name.trim() || isNaN(lat) || isNaN(lng)) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateBranch({
          branchId: editingId,
          name: form.name.trim(),
          lat,
          lng,
          address: form.address.trim() || undefined,
        });
      } else {
        await addBranch({
          benefitId,
          name: form.name.trim(),
          lat,
          lng,
          address: form.address.trim() || undefined,
        });
      }
      handleCancel();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (branchId: Id<"benefit_branches">) => {
    setDeletingId(branchId);
    try {
      await deleteBranch({ branchId });
    } finally {
      setDeletingId(null);
    }
  };

  const hasCoords = !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) && form.lat && form.lng;
  const isFormValid = form.name.trim() && hasCoords;
  const geoMsg = GEO_MESSAGES[geoState];

  return (
    <div className="mt-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
          <MapPin size={10} /> Sucursales {branches !== undefined && `(${branches.length})`}
        </p>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-xl hover:bg-green-100 transition-colors"
          >
            <Plus size={11} /> Añadir
          </button>
        )}
      </div>

      {/* Branch list */}
      {branches && branches.length > 0 && (
        <div className="space-y-2">
          {branches.map((branch, i) => (
            <div
              key={branch._id}
              className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm"
            >
              {/* Number badge */}
              <div className="size-7 rounded-xl bg-green-50 text-primary flex items-center justify-center text-[10px] font-black flex-shrink-0">
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{branch.name}</p>
                {branch.address && (
                  <p className="text-[10px] text-gray-500 font-medium truncate">{branch.address}</p>
                )}
                <p className="text-[10px] text-gray-300 font-medium mt-0.5">
                  {branch.lat.toFixed(5)}, {branch.lng.toFixed(5)}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`https://maps.google.com/?q=${branch.lat},${branch.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                  title="Ver en mapa"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => openEditForm(branch)}
                  className="size-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  title="Editar"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(branch._id)}
                  disabled={deletingId === branch._id}
                  className="size-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-40"
                  title="Borrar"
                >
                  {deletingId === branch._id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {branches?.length === 0 && !showForm && (
        <div className="text-center py-3 border border-dashed border-gray-200 rounded-2xl">
          <MapPin size={20} className="text-gray-200 mx-auto mb-1" />
          <p className="text-[10px] text-gray-300 font-bold">Sin sucursales — añade la primera ubicación.</p>
        </div>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700">
            {editingId ? "✏️ Editar Sucursal" : `➕ Nueva Sucursal`}
          </p>

          {/* Branch name */}
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nombre (ej: Plaza Las Américas, Mayagüez Mall…)"
            className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          {/* Address (optional) */}
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Dirección (opcional — ej: Calle San Justo 15, SJ)"
            className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-green-100" />
            <p className="text-[9px] font-black uppercase tracking-widest text-green-400">Ubicación</p>
            <div className="flex-1 h-px bg-green-100" />
          </div>

          {/* Option 1 — GPS button */}
          <button
            onClick={handleGPS}
            disabled={geoState === "loading"}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
              geoState === "success"
                ? "bg-green-500 text-white border-green-500 shadow-md shadow-green-200"
                : "bg-white border-green-200 text-green-700 hover:bg-green-100"
            } disabled:opacity-60`}
          >
            {geoState === "loading" ? (
              <><Loader2 size={14} className="animate-spin" /> Detectando…</>
            ) : geoState === "success" ? (
              <><CheckCircle2 size={14} /> Ubicación capturada</>
            ) : (
              <><Navigation size={14} /> Usar mi ubicación actual (GPS)</>
            )}
          </button>

          {/* GPS feedback message */}
          {geoMsg && geoState !== "success" && (
            <div className={`flex items-start gap-2 text-[10px] font-bold ${geoMsg.color}`}>
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              <span>{geoMsg.text}</span>
            </div>
          )}

          {/* Option 2 — paste Google Maps link */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1 mb-1.5">
              <Link2 size={9} /> O pega un enlace de Google Maps / Apple Maps
            </label>
            <input
              type="url"
              value={form.mapsUrl}
              onChange={(e) => handleMapsUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/... o https://www.google.com/maps/@..."
              className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {form.mapsUrl && !hasCoords && (
              <p className="text-[10px] text-orange-500 font-bold mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> No se pudo extraer la ubicación. Intenta con un enlace diferente o usa GPS.
              </p>
            )}
          </div>

          {/* Option 3 — manual coordinates */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1 mb-1.5">
              <MapPin size={9} /> O ingresa coordenadas manualmente
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={form.lat}
                onChange={(e) => { setForm((f) => ({ ...f, lat: e.target.value, mapsUrl: "" })); setGeoState("idle"); }}
                placeholder="Latitud (18.xxxx)"
                className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <input
                type="text"
                inputMode="decimal"
                value={form.lng}
                onChange={(e) => { setForm((f) => ({ ...f, lng: e.target.value, mapsUrl: "" })); setGeoState("idle"); }}
                placeholder="Longitud (-66.xxxx)"
                className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

          {/* Preview link if coords are valid */}
          {hasCoords && (
            <a
              href={`https://maps.google.com/?q=${form.lat},${form.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 bg-white border border-blue-100 text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-50 transition-colors"
            >
              <ExternalLink size={12} /> Verificar en Google Maps
            </a>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              <X size={13} /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !isFormValid}
              className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-green-200 disabled:opacity-50 hover:bg-green-600 transition-colors"
            >
              {saving
                ? <Loader2 size={13} className="animate-spin" />
                : <><Check size={13} /> {editingId ? "Guardar" : "Añadir Sucursal"}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
