import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  authorized_emails: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),

  profiles: defineTable({
    userId: v.string(),
    fullName: v.string(),
    email: v.string(),
    role: v.union(v.literal("RSP"), v.literal("Admin"), v.literal("Staff"), v.literal("Patrono"), v.literal("Negocio")),
    base: v.union(v.literal("Bayamón"), v.literal("Ponce"), v.literal("Mayagüez"), v.literal("San Juan"), v.literal("Caguas")),
    photoUrl: v.optional(v.string()), // string_url
    totalTrips: v.number(),
    medals: v.array(v.string()),
    companyName: v.optional(v.string()), // For Patrono/Employees
    businessId: v.optional(v.string()),  // For Negocio
  }).index("by_userId", ["userId"])
    .index("by_base_totalTrips", ["base", "totalTrips"])
    .index("by_company", ["companyName"]),

  trainings: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    isMandatory: v.boolean(),
    category: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  user_progress: defineTable({
    userId: v.id("profiles"),
    trainingId: v.id("trainings"),
    status: v.union(v.literal("pending"), v.literal("completed")),
    completedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]).index("by_trainingId", ["trainingId"]).index("by_user_training", ["userId", "trainingId"]),

  activity_logs: defineTable({
    userId: v.id("profiles"),
    action: v.string(),
    timestamp: v.number(),
  }).index("by_userId", ["userId"]),

  lms_progress: defineTable({
    userId: v.optional(v.string()),
    clerkId: v.optional(v.string()), // legacy field, will be removed after migration
    programId: v.string(),
    moduleId: v.string(),
    completedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_user_module", ["userId", "moduleId"]),

  benefits: defineTable({
    merchantName: v.string(),
    offerLabel: v.string(),
    lat: v.number(), // float
    lng: v.number(), // float
    category: v.string(),
    isSponsored: v.boolean(),
    amazonAffiliateUrl: v.optional(v.string()), // string_url
    activeDays: v.array(v.string()),
    isSingleUse: v.optional(v.boolean()),
    maxUses: v.optional(v.number()),
    isLive: v.optional(v.boolean()),   // visible to RSPs when true
    ownerId: v.optional(v.string()),   // userId of the Negocio that created it
  }).index("by_ownerId", ["ownerId"]),

  redemptions: defineTable({
    userId: v.id("profiles"), // id_ref
    benefitId: v.id("benefits"), // id_ref
    status: v.union(v.literal("active"), v.literal("used"), v.literal("expired")),
    expiresAt: v.number(), // timestamp
  }).index("by_userId", ["userId"]).index("by_benefitId", ["benefitId"]),

  employee_documents: defineTable({
    userId: v.optional(v.string()),
    clerkId: v.optional(v.string()), // legacy field, will be removed after migration
    ley300: v.boolean(),
    cpr: v.boolean(),
    recordChoferil: v.boolean(),
    antecedentes: v.boolean(),
    licenciaCat4: v.boolean(),
    autorizacionOperador: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),
});
