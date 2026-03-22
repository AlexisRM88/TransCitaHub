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

// ── Branches: get all branches (for employee map view) ───────────────────────
export const getAllBranches = query({
    args: {},
    handler: async (ctx) => {
        return ctx.db.query("benefit_branches").collect();
    },
});

// ── Branches: get branches for a specific benefit ─────────────────────────────
export const getBranchesByBenefit = query({
    args: { benefitId: v.id("benefits") },
    handler: async (ctx, args) => {
        return ctx.db
            .query("benefit_branches")
            .withIndex("by_benefitId", (q) => q.eq("benefitId", args.benefitId))
            .collect();
    },
});

// ── Branches: add a branch to a benefit ──────────────────────────────────────
export const addBranch = mutation({
    args: {
        benefitId: v.id("benefits"),
        name: v.string(),
        lat: v.number(),
        lng: v.number(),
        address: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("benefit_branches", {
            benefitId: args.benefitId,
            name: args.name,
            lat: args.lat,
            lng: args.lng,
            address: args.address,
        });
    },
});

// ── Branches: update a branch ─────────────────────────────────────────────────
export const updateBranch = mutation({
    args: {
        branchId: v.id("benefit_branches"),
        name: v.string(),
        lat: v.number(),
        lng: v.number(),
        address: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { branchId, ...patch } = args;
        await ctx.db.patch(branchId, patch);
    },
});

// ── Branches: delete a branch ─────────────────────────────────────────────────
export const deleteBranch = mutation({
    args: { branchId: v.id("benefit_branches") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.branchId);
    },
});

// ── Analytics: track a benefit open (deduplicated on client via localStorage) ─
export const trackBenefitOpen = mutation({
    args: { benefitId: v.id("benefits") },
    handler: async (ctx, args) => {
        const today = new Date().toISOString().split("T")[0];
        const existing = await ctx.db
            .query("benefit_stats")
            .withIndex("by_benefit_date", (q) =>
                q.eq("benefitId", args.benefitId).eq("date", today)
            )
            .first();
        if (existing) {
            await ctx.db.patch(existing._id, { opens: existing.opens + 1 });
        } else {
            await ctx.db.insert("benefit_stats", {
                benefitId: args.benefitId,
                date: today,
                opens: 1,
                redeems: 0,
            });
        }
    },
});

// ── Analytics: query for Negocio — own offers with last 7 days stats ─────────
export const getMyOffersAnalytics = query({
    args: { ownerId: v.string() },
    handler: async (ctx, args) => {
        const offers = await ctx.db
            .query("benefits")
            .withIndex("by_ownerId", (q) => q.eq("ownerId", args.ownerId))
            .collect();

        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            return d.toISOString().split("T")[0];
        });

        return Promise.all(offers.map(async (offer) => {
            // Aggregate opens per day for the last 7 days
            const statsRows = await Promise.all(
                last7Days.map(async (date) => {
                    const row = await ctx.db
                        .query("benefit_stats")
                        .withIndex("by_benefit_date", (q) =>
                            q.eq("benefitId", offer._id).eq("date", date)
                        )
                        .first();
                    return { date, opens: row?.opens ?? 0, redeems: row?.redeems ?? 0 };
                })
            );

            const totalRedemptions = await ctx.db
                .query("redemptions")
                .withIndex("by_benefitId", (q) => q.eq("benefitId", offer._id))
                .collect();

            const opens7d = statsRows.reduce((sum, r) => sum + r.opens, 0);
            const totalRedeems = totalRedemptions.length;

            return {
                _id: offer._id,
                merchantName: offer.merchantName,
                offerLabel: offer.offerLabel,
                isLive: offer.isLive ?? false,
                type: offer.type ?? "descuento",
                opens7d,
                totalRedeems,
                conversionRate: opens7d > 0 ? Math.round((totalRedeems / opens7d) * 100) : 0,
                dailyData: statsRows,
            };
        }));
    },
});

// ── Analytics: query for Admin — all benefits with aggregated stats ───────────
export const getAllBenefitsAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const benefits = await ctx.db.query("benefits").collect();

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(sevenDaysAgo);
            d.setDate(sevenDaysAgo.getDate() + i);
            return d.toISOString().split("T")[0];
        });

        return Promise.all(benefits.map(async (benefit) => {
            const statsRows = await Promise.all(
                last7Days.map(async (date) => {
                    const row = await ctx.db
                        .query("benefit_stats")
                        .withIndex("by_benefit_date", (q) =>
                            q.eq("benefitId", benefit._id).eq("date", date)
                        )
                        .first();
                    return row?.opens ?? 0;
                })
            );

            const totalRedemptions = await ctx.db
                .query("redemptions")
                .withIndex("by_benefitId", (q) => q.eq("benefitId", benefit._id))
                .collect();

            const opens7d = statsRows.reduce((sum, n) => sum + n, 0);
            const totalRedeems = totalRedemptions.length;

            return {
                _id: benefit._id,
                merchantName: benefit.merchantName,
                offerLabel: benefit.offerLabel,
                isLive: benefit.isLive ?? false,
                type: benefit.type ?? "descuento",
                opens7d,
                totalRedeems,
                conversionRate: opens7d > 0 ? Math.round((totalRedeems / opens7d) * 100) : 0,
            };
        }));
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
