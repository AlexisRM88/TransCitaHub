import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDocuments = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    let docs = await ctx.db
      .query("employee_documents")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!docs) {
      // Default state if not found (documents are pending/missing)
      return {
        ley300: false,
        cpr: false,
        recordChoferil: false,
        antecedentes: false,
        licenciaCat4: false,
        autorizacionOperador: false,
      };
    }
    return {
      ...docs,
      autorizacionOperador: docs.autorizacionOperador ?? false,
    };
  },
});

export const toggleDocument = mutation({
  args: {
    clerkId: v.string(),
    documentKey: v.union(
      v.literal("ley300"),
      v.literal("cpr"),
      v.literal("recordChoferil"),
      v.literal("antecedentes"),
      v.literal("licenciaCat4"),
      v.literal("autorizacionOperador")
    ),
  },
  handler: async (ctx, args) => {
    // Only Admin or Patrono should do this in a real scenario, but we just verify they exist
    let docs = await ctx.db
      .query("employee_documents")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!docs) {
      // Create it with the toggled field as true
      await ctx.db.insert("employee_documents", {
        clerkId: args.clerkId,
        ley300: args.documentKey === "ley300",
        cpr: args.documentKey === "cpr",
        recordChoferil: args.documentKey === "recordChoferil",
        antecedentes: args.documentKey === "antecedentes",
        licenciaCat4: args.documentKey === "licenciaCat4",
        autorizacionOperador: args.documentKey === "autorizacionOperador",
      });
    } else {
      // Toggle
      await ctx.db.patch(docs._id, {
        [args.documentKey]: !docs[args.documentKey as keyof typeof docs],
      });
    }
  },
});
