import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

// Simple Haversine implementation to filter 10km Radius
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

export const getAvailableT_Life = query({
    args: { userLat: v.number(), userLng: v.number() },
    handler: async (ctx, args) => {
        const allBenefits = await ctx.db.query("benefits").collect();

        return allBenefits.filter((benefit) => {
            const distance = getDistanceFromLatLonInKm(args.userLat, args.userLng, benefit.lat, benefit.lng);
            return distance < 10;
        });
    },
});

export const getBenefitsWithStatus = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!profile) return [];

        const benefits = await ctx.db.query("benefits").collect();
        const redemptions = await ctx.db
            .query("redemptions")
            .withIndex("by_userId", (q) => q.eq("userId", profile._id))
            .collect();

        return benefits.map((benefit) => {
            const userRedemptions = redemptions.filter((r) => r.benefitId === benefit._id);
            const totalRedemptions = userRedemptions.length;
            const max = benefit.maxUses || (benefit.isSingleUse ? 1 : 1);
            const usesLeft = Math.max(0, max - totalRedemptions);

            return {
                ...benefit,
                status: usesLeft === 0 ? "used" : "available",
                usesLeft: usesLeft,
                totalRedemptions: totalRedemptions
            };
        });
    },
});

export const redeemBenefit = mutation({
    args: { clerkId: v.string(), benefitId: v.string() },
    handler: async (ctx, args) => {
        // 1. Find user profile
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!profile) {
            console.error("Profile not found for clerkId:", args.clerkId);
            return;
        }

        // 2. Identify the benefit
        let actualBenefitId = ctx.db.normalizeId("benefits", args.benefitId);

        if (!actualBenefitId) {
            // Fallback for hardcoded names in frontend
            const merchantMap: Record<string, string> = {
                "friendscafe": "Friend's Cafe PR",
                "shellgas": "Shell Puerto Rico",
                "snapfitness": "Snap Fitness PR",
                "elmeson": "El Mesón"
            };
            const merchantName = merchantMap[args.benefitId] || args.benefitId;
            const benefit = await ctx.db
                .query("benefits")
                .filter(q => q.eq(q.field("merchantName"), merchantName))
                .first();

            if (benefit) {
                actualBenefitId = benefit._id;
            }
        }

        // 3. Record redemption if benefit exists in DB and is not already used up
        if (actualBenefitId) {
            const benefitData: Doc<"benefits"> | null = await ctx.db.get(actualBenefitId);

            if (!benefitData) return;

            const existingCount = await ctx.db
                .query("redemptions")
                .withIndex("by_userId", (q) => q.eq("userId", profile._id))
                .filter(q => q.eq(q.field("benefitId"), actualBenefitId))
                .collect();

            const max = benefitData.maxUses || (benefitData.isSingleUse ? 1 : 1);

            if (existingCount.length >= max) {
                console.warn("User already exhausted this benefit");
                return;
            }

            await ctx.db.insert("redemptions", {
                userId: profile._id,
                benefitId: actualBenefitId,
                status: "used",
                expiresAt: Date.now() + (24 * 60 * 60 * 1000), // Placeholder expiry
            });
            console.log("Redemption recorded successfully");
        } else {
            console.warn("Could not find benefit in DB to record redemption:", args.benefitId);
        }
    },
});
