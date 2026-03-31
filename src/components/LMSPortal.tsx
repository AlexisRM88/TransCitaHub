"use client";

import { useState } from "react";
import { TRAINING_PROGRAMS, TrainingProgram } from "../data/onboardingData";
import { LMSSectionViewer, OnboardingSection } from "./LMSSectionViewer";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    CheckCircle2,
    Circle,
    Play,
    Lock,
    BookOpen,
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    FileText,
    Award,
    ChevronLeft
} from "lucide-react";
import { BusinessDashboard } from "./BusinessDashboard";
import { PatronoEvaluation } from "./PatronoEvaluation";

export function LMSPortal() {
    const currentData = useQuery(api.users.current);
    const user = currentData?.user;
    const userId = user?._id;
    const userRole = currentData?.profile?.role || "RSP";

    const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
    const [viewingSection, setViewingSection] = useState<OnboardingSection | null>(null);

    const dbCompletedIds = useQuery(api.lms.getProgress, userId ? { userId } : "skip") || [];
    const markComplete = useMutation(api.lms.markComplete);

    // Filter out duplicates just in case
    const completedIds = Array.from(new Set(dbCompletedIds));

    // Filter training programs based on role
    const filteredTrainingPrograms = TRAINING_PROGRAMS.filter(prog => {
        if (prog.id === 'patrono-training') return userRole === "Patrono" || userRole === "Admin";
        if (prog.id === 'negocio-training') return userRole === "Negocio" || userRole === "Admin";
        return true; // Everyone sees regular training
    });

    const handleComplete = async (id: string) => {
        console.log("handleComplete triggered for module:", id, "userId:", userId);
        if (!userId || !selectedProgram) {
            console.error("Cannot complete: missing userId or selectedProgram");
            return;
        }

        // Add a safety timeout to prevent eternal "Saving..." state
        const completionTimeout = setTimeout(() => {
            console.error("LMS completion timed out. Backend might be unreachable or authentication failing.");
            // We could optionally show a toast or alert here
            setViewingSection(null); // Return to list even if it failed, or stay but reset the button?
            // Resetting button state is handled by the viewer if we throw an error there.
            // But here we're in the portal's callback.
        }, 10000); // 10 seconds

        try {
            console.log("Invoking markComplete mutation...");
            await markComplete({
                userId,
                programId: selectedProgram.id,
                moduleId: id,
            });
            console.log("markComplete mutation success");
            clearTimeout(completionTimeout);
            setViewingSection(null);
        } catch (error) {
            console.error("Error marking module complete in Convex:", error);
            clearTimeout(completionTimeout);
            // Optionally we could show a toast here
            setViewingSection(null); // Still close it to avoid getting stuck, or throw to viewer?
        }
    };

    if (viewingSection) {
        return (
            <LMSSectionViewer
                section={viewingSection}
                onComplete={() => handleComplete(viewingSection.id)}
                onBack={() => setViewingSection(null)}
                isAlreadyCompleted={completedIds.includes(viewingSection.id)}
            />
        );
    }

    if (selectedProgram) {
        const completedInSectionCount = selectedProgram.sections.filter(s => completedIds.includes(s.id)).length;
        const progressPercentage = Math.round((completedInSectionCount / selectedProgram.sections.length) * 100);

        return (
            <div className="max-w-2xl mx-auto pb-20 p-4">
                <button
                    onClick={() => setSelectedProgram(null)}
                    className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft size={20} /> Volver a Desarrollo
                </button>

                {/* Program Header Card */}
                <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-[2.5rem] p-8 text-white mb-10 relative overflow-hidden shadow-xl shadow-green-200">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
                                {selectedProgram.emoji}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black">{selectedProgram.title}</h1>
                                <p className="text-sm font-bold opacity-80">RSP | TransCita</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end text-sm font-bold">
                                <span>Progreso del Programa</span>
                                <span className="text-xl">{progressPercentage}%</span>
                            </div>
                            <div className="h-4 bg-black/10 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <p className="text-xs font-medium opacity-70">
                                {completedInSectionCount} de {selectedProgram.sections.length} módulos completados
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modules List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="text-green-500" size={24} />
                        Módulos Disponibles
                    </h2>

                    {selectedProgram.sections.map((section, index) => {
                        const isCompleted = completedIds.includes(section.id);
                        const isUpcoming = index > 0 && !completedIds.includes(selectedProgram.sections[index - 1].id);

                        return (
                            <div
                                key={section.id}
                                onClick={() => !isUpcoming && setViewingSection(section)}
                                className={`group bg-white p-5 rounded-3xl border-2 transition-all duration-300 relative cursor-pointer ${isCompleted
                                    ? "border-green-100 bg-green-50/20"
                                    : isUpcoming
                                        ? "border-transparent opacity-60 grayscale cursor-not-allowed"
                                        : "border-gray-50 hover:border-green-400 hover:shadow-xl hover:shadow-green-100 hover:-translate-y-1"
                                    }`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center transition-colors ${isCompleted
                                        ? "bg-green-500 text-white shadow-lg shadow-green-100"
                                        : "bg-gray-100 text-gray-400 group-hover:bg-green-100 group-hover:text-green-600"
                                        }`}>
                                        {isCompleted ? <CheckCircle2 size={24} /> :
                                            section.type === 'video' ? <Play size={24} fill="currentColor" /> :
                                                <FileText size={24} />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-micro-label text-gray-600">
                                                Módulo {index + 1}
                                            </span>
                                            {isUpcoming && <Lock size={12} className="text-gray-400" />}
                                        </div>
                                        <h3 className={`font-black text-lg transition-colors ${isCompleted ? "text-gray-900" : "text-gray-800"
                                            }`}>
                                            {section.title}
                                        </h3>
                                    </div>

                                    <div className={`size-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-300"
                                        }`}>
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-20 p-5">
            {/* Conditional Dashboards based on Role */}
            <div className="mb-12">
                {userRole === "Patrono" && userId && (
                    <>
                        <PatronoEvaluation userId={userId} />
                    </>
                )}
                {userRole === "Negocio" && userId && <BusinessDashboard userId={userId} />}
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">Desarrollo Profesional</h2>
            <p className="text-sm text-gray-500 font-medium mb-8">Programas de capacitación para tu crecimiento.</p>

            <div className="grid gap-4">
                {filteredTrainingPrograms.map((program) => {
                    const progCompletedCount = program.sections.filter(s => completedIds.includes(s.id)).length;
                    const progPercentage = Math.round((progCompletedCount / program.sections.length) * 100);

                    return (
                        <div
                            key={program.id}
                            onClick={() => setSelectedProgram(program)}
                            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-100 hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="size-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-3xl group-hover:bg-green-50 transition-colors">
                                    {program.emoji}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-xl text-gray-900 mb-1">{program.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium leading-tight mb-3">
                                        {program.description}
                                    </p>

                                    {/* Small Progress Bar */}
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full transition-all duration-700"
                                            style={{ width: `${progPercentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-green-500 group-hover:text-white transition-all">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stats Summary */}
            <div className="mt-10 bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <p className="text-micro-label text-gray-600 mb-2">Total Capacitaciones</p>
                        <h3 className="text-4xl font-black">{completedIds.length}</h3>
                        <p className="text-xs font-bold text-green-400 mt-1">¡Sigue creciendo!</p>
                    </div>
                    <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Award size={32} className="text-yellow-400" />
                    </div>
                </div>
                <TrendingUp size={100} className="absolute -bottom-4 -right-4 opacity-10" />
            </div>
        </div>
    );
}
