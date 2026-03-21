import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

// ── Storage: generate a one-time upload URL ──────────────────────────────────
export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

// ── Storage: resolve storageId → public URL ──────────────────────────────────
export const getImageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

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
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (!profile) return [];

        // Only show benefits that are explicitly live, or legacy benefits without isLive set
        const allBenefits = await ctx.db.query("benefits").collect();
        const benefits = allBenefits.filter(b => b.isLive !== false);
        const redemptions = await ctx.db
            .query("redemptions")
            .withIndex("by_userId", (q) => q.eq("userId", profile._id))
            .collect();

        return Promise.all(benefits.map(async (benefit) => {
            const userRedemptions = redemptions.filter((r) => r.benefitId === benefit._id);
            const totalRedemptions = userRedemptions.length;
            const max = benefit.maxUses || (benefit.isSingleUse ? 1 : 1);
            const usesLeft = Math.max(0, max - totalRedemptions);
            const imageUrl = benefit.imageStorageId
                ? await ctx.storage.getUrl(benefit.imageStorageId)
                : null;

            return {
                ...benefit,
                status: usesLeft === 0 ? "used" : "available",
                usesLeft: usesLeft,
                totalRedemptions: totalRedemptions,
                type: benefit.type ?? "descuento",
                imageUrl,
            };
        }));
    },
});

// ── Admin: get ALL benefits (with resolved image URLs) ───────────────────────
export const getAllBenefitsAdmin = query({
    args: {},
    handler: async (ctx) => {
        const benefits = await ctx.db.query("benefits").collect();
        return Promise.all(benefits.map(async (b) => ({
            ...b,
            imageUrl: b.imageStorageId ? await ctx.storage.getUrl(b.imageStorageId) : null,
        })));
    },
});

// ── Admin: create a global benefit (no owner) ────────────────────────────────
export const adminCreateBenefit = mutation({
    args: {
        merchantName: v.string(),
        offerLabel: v.string(),
        category: v.string(),
        isSingleUse: v.boolean(),
        maxUses: v.optional(v.number()),
        isLive: v.boolean(),
        type: v.optional(v.union(v.literal("descuento"), v.literal("actividad"))),
        eventDate: v.optional(v.string()),
        eventTime: v.optional(v.string()),
        eventLocation: v.optional(v.string()),
        eventCapacity: v.optional(v.number()),
        imageStorageId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("benefits", {
            merchantName: args.merchantName,
            offerLabel: args.offerLabel,
            category: args.category,
            isSingleUse: args.isSingleUse,
            maxUses: args.maxUses ?? 1,
            isLive: args.isLive,
            lat: 18.2208,
            lng: -66.5901,
            isSponsored: false,
            activeDays: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
            type: args.type ?? "descuento",
            eventDate: args.eventDate,
            eventTime: args.eventTime,
            eventLocation: args.eventLocation,
            eventCapacity: args.eventCapacity,
            imageStorageId: args.imageStorageId,
        });
    },
});

// ── Admin: toggle any benefit live ──────────────────────────────────────────
export const adminToggleBenefitLive = mutation({
    args: { benefitId: v.string() },
    handler: async (ctx, args) => {
        const id = ctx.db.normalizeId("benefits", args.benefitId);
        if (!id) throw new Error("Benefit not found");
        const benefit = await ctx.db.get(id);
        if (!benefit) throw new Error("Benefit not found");
        await ctx.db.patch(id, { isLive: !benefit.isLive });
    },
});

// ── Admin: update any benefit ────────────────────────────────────────────────
export const adminUpdateBenefit = mutation({
    args: {
        benefitId: v.string(),
        merchantName: v.string(),
        offerLabel: v.string(),
        category: v.string(),
        isSingleUse: v.boolean(),
        maxUses: v.number(),
        isLive: v.boolean(),
        type: v.optional(v.union(v.literal("descuento"), v.literal("actividad"))),
        eventDate: v.optional(v.string()),
        eventTime: v.optional(v.string()),
        eventLocation: v.optional(v.string()),
        eventCapacity: v.optional(v.number()),
        imageStorageId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const id = ctx.db.normalizeId("benefits", args.benefitId);
        if (!id) throw new Error("Benefit not found");
        await ctx.db.patch(id, {
            merchantName: args.merchantName,
            offerLabel: args.offerLabel,
            category: args.category,
            isSingleUse: args.isSingleUse,
            maxUses: args.maxUses,
            isLive: args.isLive,
            type: args.type,
            eventDate: args.eventDate,
            eventTime: args.eventTime,
            eventLocation: args.eventLocation,
            eventCapacity: args.eventCapacity,
            ...(args.imageStorageId ? { imageStorageId: args.imageStorageId } : {}),
        });
    },
});

// ── Admin: delete any benefit ────────────────────────────────────────────────
export const adminDeleteBenefit = mutation({
    args: { benefitId: v.string() },
    handler: async (ctx, args) => {
        const id = ctx.db.normalizeId("benefits", args.benefitId);
        if (!id) throw new Error("Benefit not found");
        await ctx.db.delete(id);
    },
});

// ── Negocio: get own offers ──────────────────────────────────────────────────
export const getMyOffers = query({
    args: { ownerId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("benefits")
            .withIndex("by_ownerId", (q) => q.eq("ownerId", args.ownerId))
            .collect();
    },
});

// ── Negocio: create a new offer ──────────────────────────────────────────────
export const createOffer = mutation({
    args: {
        ownerId: v.string(),
        merchantName: v.string(),
        offerLabel: v.string(),
        category: v.string(),
        isSingleUse: v.boolean(),
        maxUses: v.optional(v.number()),
        type: v.optional(v.union(v.literal("descuento"), v.literal("actividad"))),
        eventDate: v.optional(v.string()),
        eventTime: v.optional(v.string()),
        eventLocation: v.optional(v.string()),
        eventCapacity: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("benefits", {
            ownerId: args.ownerId,
            merchantName: args.merchantName,
            offerLabel: args.offerLabel,
            category: args.category,
            isSingleUse: args.isSingleUse,
            maxUses: args.maxUses ?? 1,
            lat: 18.2208,   // Puerto Rico center — placeholder
            lng: -66.5901,
            isSponsored: false,
            activeDays: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
            isLive: false,
            type: args.type ?? "descuento",
            eventDate: args.eventDate,
            eventTime: args.eventTime,
            eventLocation: args.eventLocation,
            eventCapacity: args.eventCapacity,
        });
    },
});

// ── Negocio: toggle isLive ───────────────────────────────────────────────────
export const toggleOfferLive = mutation({
    args: { benefitId: v.string() },
    handler: async (ctx, args) => {
        const id = ctx.db.normalizeId("benefits", args.benefitId);
        if (!id) throw new Error("Offer not found");
        const benefit = await ctx.db.get(id);
        if (!benefit) throw new Error("Offer not found");
        await ctx.db.patch(id, { isLive: !benefit.isLive });
    },
});

// ── Negocio: delete an offer ─────────────────────────────────────────────────
export const deleteOffer = mutation({
    args: { benefitId: v.string() },
    handler: async (ctx, args) => {
        const id = ctx.db.normalizeId("benefits", args.benefitId);
        if (!id) throw new Error("Offer not found");
        await ctx.db.delete(id);
    },
});

export const redeemBenefit = mutation({
    args: { userId: v.string(), benefitId: v.string() },
    handler: async (ctx, args) => {
        // 1. Find user profile
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (!profile) {
            console.error("Profile not found for userId:", args.userId);
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
