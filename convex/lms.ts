import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProgress = query({
    args: { userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.userId) return [];

        const progress = await ctx.db
            .query("lms_progress")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId as string))
            .collect();

        return progress.map(p => p.moduleId);
    },
});

export const markComplete = mutation({
    args: {
        userId: v.string(),
        programId: v.string(),
        moduleId: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if already completed
        const existing = await ctx.db
            .query("lms_progress")
            .withIndex("by_user_module", (q) =>
                q.eq("userId", args.userId).eq("moduleId", args.moduleId)
            )
            .first();

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("lms_progress", {
            userId: args.userId,
            programId: args.programId,
            moduleId: args.moduleId,
            completedAt: Date.now(),
        });
    },
});

export const getCompanyProgress = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const patrono = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
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
                .withIndex("by_userId", (q) => q.eq("userId", emp.userId))
                .collect();

            results.push({
                fullName: emp.fullName,
                userId: emp.userId,
                completedModules: progress.map(p => p.moduleId),
            });
        }

        return results;
    },
});
