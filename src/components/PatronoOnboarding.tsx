"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
    CheckCircle2, 
    Play, 
    TrendingUp, 
    Users, 
    MessageSquare, 
    Target,
    ArrowRight,
    Award
} from "lucide-react";
import { useState, useEffect } from "react";

export function PatronoOnboarding({ clerkId }: { clerkId: string }) {
    const dbCompletedIds = useQuery(api.lms.getProgress, clerkId ? { clerkId } : "skip") || [];
    const markComplete = useMutation(api.lms.markComplete);

    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onboardingModules = [
        {
            id: 'onboarding-step-1',
            title: 'El Costo de la Rotación',
            description: 'Perder un empleado cuesta meses de salario. Retenerlos es una inversión.',
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            actionText: 'Ver Mi Equipo',
            theory: '¿Sabías que la causa principal de las renuncias es la falta de oportunidades de crecimiento? Visita la lista de tus empleados abajo para identificar quién necesita apoyo.'
        },
        {
            id: 'onboarding-step-2',
            title: 'Crecimiento = Lealtad',
            description: 'Empleados que ven su desarrollo, se quedan.',
            icon: TrendingUp,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            actionText: 'Ver Progreso',
            theory: 'HubTransCita da visibilidad. Explora el nivel de completación de los módulos de tu equipo en la sección inferior para saber quiénes están listos para más retos.'
        },
        {
            id: 'onboarding-step-3',
            title: 'El Poder del Feedback',
            description: 'Cero sorpresas: evaluaciones continuas eliminan la frustración.',
            icon: MessageSquare,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
            actionText: 'Iniciar Evaluación',
            theory: 'La comunicación constante evita renuncias sorpresivas. Prepárate para iniciar una evaluación objetiva basada en datos reales de la plataforma.'
        },
        {
            id: 'onboarding-step-4',
            title: 'Plan de Retención a 90 Días',
            description: 'El compromiso de transformar datos en acciones.',
            icon: Target,
            color: 'text-red-500',
            bgColor: 'bg-red-50',
            actionText: 'Aceptar Compromiso',
            theory: 'Al marcar este paso, te comprometes a usar HubTransCita proactivamente para disminuir la rotación en tu departamento y crear líderes.'
        }
    ];

    const completedIds = Array.from(new Set(dbCompletedIds));
    const isFullyCompleted = onboardingModules.every(mod => completedIds.includes(mod.id));
    const progressPercentage = Math.round((onboardingModules.filter(m => completedIds.includes(m.id)).length / onboardingModules.length) * 100);

    const handleActionClick = async (moduleId: string) => {
        setIsProcessing(true);
        try {
            await markComplete({
                clerkId,
                programId: 'patrono-interactive-onboarding',
                moduleId: moduleId,
            });
            
            // Eliminado confetti para evitar dependencias extra

            setActiveModule(null);
            
            // Scroll down subtly to encourage looking at the dashboard
            if (moduleId !== 'onboarding-step-4') {
                window.scrollBy({ top: 400, behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error completing onboarding step:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isFullyCompleted) {
        return (
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden mb-8 shadow-2xl">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="size-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-6 border-4 border-white/10">
                        <Award size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">¡Líder Retenedor Certificado!</h2>
                    <p className="text-gray-400 font-medium text-sm max-w-md mx-auto">
                        Has completado el tour interactivo. Ahora tienes las herramientas para maximizar el engagement y la retención de tu equipo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900">Programa de Retención para Patronos</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Completa este tour interactivo para desbloquear tu insignia de Líder.
                </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-400">Progreso del Tour</span>
                        <span className="text-lg font-black text-green-500">{progressPercentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
                <div className="size-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 border-2 border-green-100 text-green-600">
                    <Award size={24} />
                </div>
            </div>

            {/* Modules Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
                {onboardingModules.map((module, index) => {
                    const isCompleted = completedIds.includes(module.id);
                    const isLocked = index > 0 && !completedIds.includes(onboardingModules[index - 1].id);
                    const isActive = activeModule === module.id;

                    return (
                        <div 
                            key={module.id}
                            className={`relative bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                                isCompleted 
                                    ? "border-green-100 bg-green-50/10" 
                                    : isLocked 
                                        ? "border-gray-50 opacity-60 grayscale cursor-not-allowed"
                                        : isActive
                                            ? "border-green-400 shadow-xl shadow-green-100"
                                            : "border-gray-100 hover:border-gray-200 cursor-pointer"
                            }`}
                        >
                            <div 
                                className="p-6"
                                onClick={() => {
                                    if (!isLocked && !isCompleted) {
                                        setActiveModule(isActive ? null : module.id);
                                    }
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center ${
                                        isCompleted ? "bg-green-500 text-white" : module.bgColor + " " + module.color
                                    }`}>
                                        {isCompleted ? <CheckCircle2 size={24} /> : <module.icon size={24} />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                        Módulo {index + 1}
                                    </span>
                                </div>
                                
                                <h3 className={`font-black text-lg leading-tight mb-2 ${isCompleted ? "text-gray-900" : "text-gray-800"}`}>
                                    {module.title}
                                </h3>
                                
                                {!isActive && (
                                    <p className="text-sm text-gray-500 font-medium">
                                        {module.description}
                                    </p>
                                )}

                                {isActive && !isCompleted && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                        <p className="text-sm text-gray-700 font-medium mb-5 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                            {module.theory}
                                        </p>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActionClick(module.id);
                                            }}
                                            disabled={isProcessing}
                                            className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {module.actionText} <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
