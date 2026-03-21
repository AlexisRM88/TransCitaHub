"use client";

import { useState, useEffect } from "react";
import { CouponTimer } from "@/components/CouponTimer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

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

  const dbBenefits = useQuery(api.benefits.getBenefitsWithStatus, { clerkId: userId });
  const redeemBenefit = useMutation(api.benefits.redeemBenefit);

  useEffect(() => {
    if (dbBenefits) {
      const mapped = dbBenefits.map((b) => {
        const meta = BENEFITS_META[b.merchantName] || {};
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
          isSingleUse: b.isSingleUse || (b.maxUses ? b.maxUses === 1 : false),
        };
      });
      setBenefitsList(mapped);
    }
  }, [dbBenefits]);

  const handleConfirmRedeem = async (benefitId: string) => {
    try {
      await redeemBenefit({ clerkId: userId, benefitId });
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

      <div className="space-y-4">
        {benefitsList.map((benefit) => (
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
