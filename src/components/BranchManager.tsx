"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Plus, MapPin, Pencil, Trash2, Locate, Check, X, ExternalLink } from "lucide-react";

interface BranchManagerProps {
  benefitId: Id<"benefits">;
  benefitName: string;
}

interface BranchForm {
  name: string;
  lat: string;
  lng: string;
  address: string;
}

const EMPTY_FORM: BranchForm = { name: "", lat: "", lng: "", address: "" };

export function BranchManager({ benefitId, benefitName }: BranchManagerProps) {
  const branches = useQuery(api.benefits.getBranchesByBenefit, { benefitId });
  const addBranch = useMutation(api.benefits.addBranch);
  const updateBranch = useMutation(api.benefits.updateBranch);
  const deleteBranch = useMutation(api.benefits.deleteBranch);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"benefit_branches"> | null>(null);
  const [form, setForm] = useState<BranchForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 8000 }
    );
  };

  const openEditForm = (branch: { _id: Id<"benefit_branches">; name: string; lat: number; lng: number; address?: string }) => {
    setEditingId(branch._id);
    setForm({
      name: branch.name,
      lat: String(branch.lat),
      lng: String(branch.lng),
      address: branch.address ?? "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
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

  const isFormValid = form.name.trim() && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng));

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
          <MapPin size={10} /> Sucursales {branches !== undefined && `(${branches.length})`}
        </p>
        {!showForm && (
          <button
            onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); }}
            className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-xl hover:bg-green-100 transition-colors"
          >
            <Plus size={11} /> Añadir
          </button>
        )}
      </div>

      {/* Existing branches */}
      {branches && branches.length > 0 && (
        <div className="space-y-1.5">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{branch.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {branch.lat.toFixed(5)}, {branch.lng.toFixed(5)}
                  {branch.address && ` · ${branch.address}`}
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
                  onClick={() => deleteBranch({ branchId: branch._id })}
                  className="size-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Borrar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {branches?.length === 0 && !showForm && (
        <p className="text-[10px] text-gray-300 font-medium text-center py-2">
          Sin sucursales — añade la primera ubicación.
        </p>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700">
            {editingId ? "Editar Sucursal" : `Nueva Sucursal · ${benefitName}`}
          </p>

          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nombre (ej: Plaza Las Américas)"
            className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              placeholder="Latitud (18.xxxx)"
              className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <input
              type="text"
              inputMode="decimal"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              placeholder="Longitud (-66.xxxx)"
              className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Dirección (opcional)"
            className="w-full bg-white border border-green-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          <div className="flex gap-2">
            <button
              onClick={handleGeolocate}
              disabled={geoLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-green-200 text-green-700 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <Locate size={13} className={geoLoading ? "animate-spin" : ""} />
              {geoLoading ? "Localizando..." : "Mi ubicación"}
            </button>

            {form.lat && form.lng && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) && (
              <a
                href={`https://maps.google.com/?q=${form.lat},${form.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-blue-100 text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-50 transition-colors"
              >
                <ExternalLink size={13} />
                Ver
              </a>
            )}
          </div>

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
              {saving ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
              ) : (
                <><Check size={13} /> {editingId ? "Guardar" : "Añadir"}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
