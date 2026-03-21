"use client";

import { useState, useEffect } from "react";
import { CouponTimer } from "@/components/CouponTimer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ACTIVITY_IMAGE = "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1000&auto=format&fit=crop";

const BENEFITS_META: Record<string, { emoji: string; distance: string; rating: string; imageUrl: string }> = {
  "Friend's Cafe PR": {
    emoji: "☕",
    distance: "0.8 km",
    rating: "4.9",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
  },
  "Shell Puerto Rico": {
    emoji: "⛽",
    distance: "2.4 km",
    rating: "4.7",
    imageUrl: "https://images.unsplash.com/photo-1545147986-a9d6f210df77?q=80&w=1000&auto=format&fit=crop",
  },
  "Snap Fitness PR": {
    emoji: "🏋️",
    distance: "3.1 km",
    rating: "4.8",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
  },
  "El Mesón": {
    emoji: "🥪",
    distance: "1.2 km",
    rating: "4.9",
    imageUrl: "/elmeson.png",
  },
};

interface BeneficiosTabProps {
  userId: string;
}

export function BeneficiosTab({ userId }: BeneficiosTabProps) {
  const [expandedBenefitId, setExpandedBenefitId] = useState<string | null>(null);
  const [activeRedeemingId, setActiveRedeemingId] = useState<string | null>(null);
  const [benefitsList, setBenefitsList] = useState<any[]>([]);

  const dbBenefits = useQuery(api.benefits.getBenefitsWithStatus, { userId: userId });
  const redeemBenefit = useMutation(api.benefits.redeemBenefit);

  useEffect(() => {
    if (dbBenefits) {
      const mapped = dbBenefits.map((b) => {
        const meta = BENEFITS_META[b.merchantName] || {};
        const isActivity = b.type === "actividad";
        // Convex Storage URL takes priority; fall back to BENEFITS_META, then generic
        const convexImageUrl = (b as any).imageUrl as string | null;
        const fallbackUrl = isActivity
          ? ACTIVITY_IMAGE
          : (meta.imageUrl || "https://images.unsplash.com/photo-1506784983877-455b4fedfd40");
        return {
          id: b._id,
          title: b.merchantName,
          subtitle: b.offerLabel,
          emoji: isActivity ? "🏃" : (meta.emoji || "🎁"),
          distance: isActivity ? (b.eventLocation || "Ver detalles") : (meta.distance || "N/A"),
          rating: meta.rating || "5.0",
          category: b.category,
          imageUrl: convexImageUrl || fallbackUrl,
          usesLeft: b.usesLeft ?? (b.status === "used" && b.isSingleUse ? 0 : 1),
          isSingleUse: b.isSingleUse || (b.maxUses ? b.maxUses === 1 : false),
          type: b.type ?? "descuento",
          eventDate: b.eventDate,
          eventTime: b.eventTime,
          eventLocation: b.eventLocation,
          eventCapacity: b.eventCapacity,
        };
      });
      setBenefitsList(mapped);
    }
  }, [dbBenefits]);

  const handleConfirmRedeem = async (benefitId: string) => {
    try {
      await redeemBenefit({ userId: userId, benefitId });
    } catch (err) {
      console.error("DB Redemption error:", err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-5">
      <header className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Tus Beneficios</h2>
        <p className="text-sm text-gray-500 font-medium tracking-tight">Exclusivos para el equipo TransCita.</p>
      </header>

      {/* Activities Section */}
      {benefitsList.filter(b => b.type === "actividad").length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 mb-4 flex items-center gap-2">
            <span className="size-5 bg-purple-50 rounded-lg flex items-center justify-center">🏃</span>
            Actividades
          </h3>
          <div className="space-y-3">
            {benefitsList.filter(b => b.type === "actividad").map((activity) => (
              <div key={activity.id} className="bg-gradient-to-br from-purple-50 to-white rounded-[1.5rem] border-2 border-purple-100 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-black text-gray-900 text-base">{activity.title}</p>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">{activity.subtitle}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    activity.usesLeft > 0 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-400"
                  }`}>
                    {activity.usesLeft > 0 ? "Disponible" : "Inscrito"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-medium">
                  {activity.eventDate && (
                    <span className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 border border-purple-100">
                      📅 {new Date(activity.eventDate + "T00:00:00").toLocaleDateString("es-PR", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                  )}
                  {activity.eventTime && (
                    <span className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 border border-purple-100">
                      🕐 {activity.eventTime}
                    </span>
                  )}
                  {activity.eventLocation && (
                    <span className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 border border-purple-100">
                      📍 {activity.eventLocation}
                    </span>
                  )}
                  {activity.eventCapacity && (
                    <span className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 border border-purple-100">
                      👥 Cupo: {activity.eventCapacity}
                    </span>
                  )}
                </div>
                {activity.usesLeft > 0 && (
                  <button
                    onClick={() => handleConfirmRedeem(activity.id)}
                    className="mt-4 w-full py-3 bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-200 active:scale-95 transition-all"
                  >
                    Inscribirme
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discounts Section */}
      {benefitsList.filter(b => b.type !== "actividad").length > 0 && (
        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
          <span className="size-5 bg-green-50 rounded-lg flex items-center justify-center">🎁</span>
          Descuentos
        </h3>
      )}
      <div className="space-y-4">
        {benefitsList.filter(b => b.type !== "actividad").map((benefit) => (
          <CouponTimer
            key={benefit.id}
            benefit={benefit}
            isExpanded={expandedBenefitId === benefit.id}
            onToggle={() => setExpandedBenefitId(expandedBenefitId === benefit.id ? null : benefit.id)}
            activeRedeemingId={activeRedeemingId}
            onRedeemStateChange={(id) => setActiveRedeemingId(id)}
            onExpire={() => console.log("Expired", benefit.id)}
            onConfirmRedeem={() => handleConfirmRedeem(benefit.id)}
          />
        ))}
      </div>
    </div>
  );
}
