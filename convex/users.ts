import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
            await ctx.db.insert("profiles", {
                clerkId: args.clerkId,
                email: args.email,
                fullName: args.fullName,
                role: "RSP", // Default role
                base: "San Juan",
                totalTrips: 0,
                medals: [],
                // Optional: initialization based on email domain or other logic could go here
                companyName: undefined,
                businessId: undefined,
            });
            console.log("New profile created for clerkId:", args.clerkId, "with role RSP");
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
