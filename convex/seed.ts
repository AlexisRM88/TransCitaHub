import { action, internalAction, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Run once to add the 5K activity without wiping existing data
export const add5KEvent = mutation({
    handler: async (ctx) => {
        // Avoid duplicates
        const existing = await ctx.db.query("benefits")
            .filter(q => q.eq(q.field("merchantName"), "5K TransCita Run"))
            .first();
        if (existing) return "Already exists";

        await ctx.db.insert("benefits", {
            merchantName: "5K TransCita Run",
            offerLabel: "Carrera solidaria 5K - camiseta y medalla incluida",
            lat: 18.4655,
            lng: -66.1057,
            category: "Actividad",
            isSponsored: true,
            activeDays: ["Sab"],
            isSingleUse: true,
            maxUses: 1,
            isLive: true,
            type: "actividad",
            eventDate: "2026-05-10",
            eventTime: "6:00 AM",
            eventLocation: "Parque Luis Muñoz Marín, San Juan",
            eventCapacity: 200,
        });
        return "5K event added!";
    },
});

export const seed = mutation({
    handler: async (ctx) => {
        // Add authorized domain/email
        await ctx.db.insert("authorized_emails", { email: "admin@transcita.com" });
        await ctx.db.insert("authorized_emails", { email: "cabuyacreativa@gmail.com" });
        // Test accounts — sign up with these emails to get the role automatically
        await ctx.db.insert("authorized_emails", { email: "empleado@transcita.com" });
        await ctx.db.insert("authorized_emails", { email: "patrono@transcita.com" });
        await ctx.db.insert("authorized_emails", { email: "negocio@transcita.com" });
        await ctx.db.insert("authorized_emails", { email: "staff@transcita.com" });

        // Clear existing data to avoid duplicates and schema mismatches in dev
        const oldBenefits = await ctx.db.query("benefits").collect();
        for (const b of oldBenefits) {
            await ctx.db.delete(b._id);
        }

        const oldRedemptions = await ctx.db.query("redemptions").collect();
        for (const r of oldRedemptions) {
            await ctx.db.delete(r._id);
        }

        const oldDocuments = await ctx.db.query("employee_documents").collect();
        for (const d of oldDocuments) {
            await ctx.db.delete(d._id);
        }

        const oldProgress = await ctx.db.query("lms_progress").collect();
        for (const p of oldProgress) {
            await ctx.db.delete(p._id);
        }

        const oldProfiles = await ctx.db.query("profiles").collect();
        for (const p of oldProfiles) {
            await ctx.db.delete(p._id);
        }

        // Add initial benefits matching UI hardcoded IDs
        await ctx.db.insert("benefits", {
            merchantName: "Friend's Cafe PR",
            offerLabel: "☕ Café de Cortesía",
            lat: 18.0110,
            lng: -66.6140,
            category: "Bienestar",
            isSponsored: true,
            activeDays: ["Todos los días"],
            isSingleUse: true,
        });

        await ctx.db.insert("benefits", {
            merchantName: "Shell Puerto Rico",
            offerLabel: "⛽ Descuento en Combustible",
            lat: 18.3985,
            lng: -66.1557,
            category: "Auto",
            isSponsored: false,
            activeDays: ["Todos los días"],
            isSingleUse: true,
        });

        await ctx.db.insert("benefits", {
            merchantName: "Snap Fitness PR",
            offerLabel: "🏋️ Membresía Corporativa",
            lat: 18.4655,
            lng: -66.1167,
            category: "Salud",
            isSponsored: false,
            activeDays: ["Todos los días"]
        });

        await ctx.db.insert("benefits", {
            merchantName: "El Mesón",
            offerLabel: "☕ Café gratis con Desayuno Bravo",
            lat: 18.2208,
            lng: -66.5901,
            category: "Comida",
            isSponsored: true,
            activeDays: ["Todos los días"],
            maxUses: 5,
            type: "descuento",
        });

        // Example: Activity-type benefit (5K race)
        await ctx.db.insert("benefits", {
            merchantName: "5K TransCita Run",
            offerLabel: "Carrera solidaria 5K - camiseta y medalla incluida",
            lat: 18.4655,
            lng: -66.1057,
            category: "Actividad",
            isSponsored: true,
            activeDays: ["Sab"],
            isSingleUse: true,
            maxUses: 1,
            isLive: true,
            type: "actividad",
            eventDate: "2026-05-10",
            eventTime: "6:00 AM",
            eventLocation: "Parque Luis Muñoz Marín, San Juan",
            eventCapacity: 200,
        });

        return "Seeding completed!";
    },
});

// Safely add test emails to authorized_emails without deleting any data.
//   npx convex run seed:authorizeTestEmails
export const authorizeTestEmails = mutation({
    handler: async (ctx) => {
        const testEmails = [
            "empleado@transcita.com",
            "patrono@transcita.com",
            "negocio@transcita.com",
            "staff@transcita.com",
            "cabuyacreativa@gmail.com",
        ];
        const results = [];
        for (const email of testEmails) {
            const existing = await ctx.db
                .query("authorized_emails")
                .withIndex("by_email", (q) => q.eq("email", email))
                .first();
            if (!existing) {
                await ctx.db.insert("authorized_emails", { email });
                results.push({ email, status: "added" });
            } else {
                results.push({ email, status: "already authorized" });
            }
        }
        return results;
    },
});

// Run once to register test accounts in Convex Auth:
//   npx convex run seed:createTestUsers
export const createTestUsers = action({
    handler: async (ctx) => {
        const testUsers = [
            { email: "empleado@transcita.com", name: "RSP Empleado" },
            { email: "patrono@transcita.com", name: "Patrono Test" },
            { email: "negocio@transcita.com", name: "Negocio Test" },
            { email: "staff@transcita.com", name: "Staff Test" },
        ];

        const results = [];
        for (const u of testUsers) {
            try {
                // Call Convex Auth's signIn action with signUp flow to create the user
                await ctx.runAction(api.auth.signIn, {
                    provider: "password",
                    params: {
                        flow: "signUp",
                        email: u.email,
                        password: "Test1234!",
                        name: u.name,
                    },
                });
                results.push({ email: u.email, ok: true, status: "created" });
            } catch (e: any) {
                // If user already exists, try signing in (just to verify they exist)
                const msg: string = e.message ?? "";
                if (msg.includes("already") || msg.includes("exist") || msg.includes("duplicate")) {
                    results.push({ email: u.email, ok: true, status: "already exists" });
                } else {
                    results.push({ email: u.email, ok: false, error: msg.slice(0, 200) });
                }
            }
        }
        return results;
    },
});
