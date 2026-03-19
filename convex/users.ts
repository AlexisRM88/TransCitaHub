import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) return null;
        
        let profile = await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
            .first();

        const user = await ctx.db.get(userId);
        return { user, profile };
    },
});

export const ensureProfile = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) return null;

        // Check if profile already exists
        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
            .first();
        
        if (existing) return existing;

        // Get user data from auth table
        const user = await ctx.db.get(userId);
        const email = user?.email || "";
        const fullName = user?.name || "Colaborador";

        const isWebmaster = email === "cabuyacreativa@gmail.com";
        const assignedRole = isWebmaster ? "Admin" : "RSP";

        const profileId = await ctx.db.insert("profiles", {
            clerkId: userId,
            email,
            fullName,
            role: assignedRole,
            base: "San Juan",
            totalTrips: 0,
            medals: [],
            companyName: undefined,
            businessId: undefined,
        });

        console.log("Auto-provisioned profile for", email, "with role", assignedRole);
        return await ctx.db.get(profileId);
    },
});

// Mock to check if auth is active or authorized
export const isAuthorized = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        // Zero-Trust Auth: check if domain is @transcita.com or webmaster override
        const isWebmaster = args.email === "cabuyacreativa@gmail.com";
        if (!args.email.endsWith("@transcita.com") && !isWebmaster) {
            return false;
        }
        const authorized = await ctx.db
            .query("authorized_emails")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        return !!authorized;
    },
});

export const getProfile = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();
    }
});

export const syncUser = mutation({
    args: { clerkId: v.string(), email: v.string(), fullName: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!existing) {
            const isWebmaster = args.email === "cabuyacreativa@gmail.com";
            const assignedRole = isWebmaster ? "Admin" : "RSP";
            await ctx.db.insert("profiles", {
                clerkId: args.clerkId,
                email: args.email,
                fullName: args.fullName,
                role: assignedRole,
                base: "San Juan",
                totalTrips: 0,
                medals: [],
                companyName: undefined,
                businessId: undefined,
            });
            console.log("New profile created for clerkId:", args.clerkId, "with role", assignedRole);
        }
    },
});

export const updateRole = mutation({
    args: { clerkId: v.string(), role: v.union(v.literal("RSP"), v.literal("Admin"), v.literal("Staff"), v.literal("Patrono"), v.literal("Negocio")) },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { role: args.role });
            console.log(`Role updated to ${args.role} for clerkId: ${args.clerkId}`);
        }
    },
});

