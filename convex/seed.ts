import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
    handler: async (ctx) => {
        // Add authorized domain/email
        await ctx.db.insert("authorized_emails", { email: "admin@transcita.com" });
        await ctx.db.insert("authorized_emails", { email: "cabuyacreativa@gmail.com" });

        // Clear existing benefits and redemptions to avoid duplicates in dev
        const oldBenefits = await ctx.db.query("benefits").collect();
        for (const b of oldBenefits) {
            await ctx.db.delete(b._id);
        }

        const oldRedemptions = await ctx.db.query("redemptions").collect();
        for (const r of oldRedemptions) {
            await ctx.db.delete(r._id);
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
            maxUses: 5
        });

        // Seed Profiles for testing
        const testPatronoId = "user_patrono_test";
        const testEmployeeId = "user_employee_test";
        const testNegocioId = "user_negocio_test";

        await ctx.db.insert("profiles", {
            clerkId: testPatronoId,
            fullName: "Alexis Patrono",
            email: "patrono@transcita.com",
            role: "Patrono",
            base: "San Juan",
            totalTrips: 0,
            medals: [],
            companyName: "TransCita Corp",
        });

        await ctx.db.insert("profiles", {
            clerkId: testEmployeeId,
            fullName: "Juan Empleado",
            email: "empleado@transcita.com",
            role: "RSP",
            base: "San Juan",
            totalTrips: 150,
            medals: ["Puntualidad"],
            companyName: "TransCita Corp",
        });

        await ctx.db.insert("profiles", {
            clerkId: testNegocioId,
            fullName: "Gerente Snap Fitness",
            email: "snap@fitness.com",
            role: "Negocio",
            base: "Bayamón",
            totalTrips: 0,
            medals: [],
            businessId: "snap-fitness-01",
        });

        // Seed some progress for the employee
        await ctx.db.insert("lms_progress", {
            clerkId: testEmployeeId,
            programId: "onboarding",
            moduleId: "bienvenida",
            completedAt: Date.now(),
        });

        await ctx.db.insert("lms_progress", {
            clerkId: testEmployeeId,
            programId: "onboarding",
            moduleId: "mision",
            completedAt: Date.now(),
        });

        return "Seeding completed!";
    },
});
