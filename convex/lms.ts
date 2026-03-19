import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProgress = query({
    args: { clerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerkId) return [];

        const progress = await ctx.db
            .query("lms_progress")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId as string))
            .collect();

        return progress.map(p => p.moduleId);
    },
});

export const markComplete = mutation({
    args: {
        clerkId: v.string(),
        programId: v.string(),
        moduleId: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if already completed
        const existing = await ctx.db
            .query("lms_progress")
            .withIndex("by_clerk_module", (q) =>
                q.eq("clerkId", args.clerkId).eq("moduleId", args.moduleId)
            )
            .first();

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("lms_progress", {
            clerkId: args.clerkId,
            programId: args.programId,
            moduleId: args.moduleId,
            completedAt: Date.now(),
        });
    },
});

export const getCompanyProgress = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const patrono = await ctx.db
            .query("profiles")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!patrono || patrono.role !== "Patrono" || !patrono.companyName) {
            return [];
        }

        const employees = await ctx.db
            .query("profiles")
            .withIndex("by_company", (q) => q.eq("companyName", patrono.companyName))
            .collect();

        const results = [];
        for (const emp of employees) {
            if (emp.role === "Patrono") continue; // Skip self

            const progress = await ctx.db
                .query("lms_progress")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", emp.clerkId))
                .collect();

            results.push({
                fullName: emp.fullName,
                clerkId: emp.clerkId,
                completedModules: progress.map(p => p.moduleId),
            });
        }

        return results;
    },
});
