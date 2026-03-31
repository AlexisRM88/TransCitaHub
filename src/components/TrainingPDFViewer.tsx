"use client";

import { useState, useRef, UIEvent } from "react";
import { CheckCircle2, ChevronLeft, MoreVertical, ShieldCheck, Bug, Anchor, Lock, Search, ZoomIn, ZoomOut } from "lucide-react";

interface TrainingProps {
    title: string;
    pdfUrl: string;
    onComplete: () => void;
}

export function TrainingPDFViewer({ title, pdfUrl, onComplete }: TrainingProps) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [progress, setProgress] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const currentProgress = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
        setProgress(currentProgress);

        if (hasScrolledToBottom) return;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            setHasScrolledToBottom(true);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-[85vh] bg-white text-gray-900 overflow-hidden rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            {/* Top App Bar */}
            <header className="flex items-center justify-between px-2 py-3 bg-white border-b border-gray-100 z-10">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900">Manual de Seguridad</h1>
                    <span className="text-micro-label text-gray-500">Módulo 1 de 4</span>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <MoreVertical size={24} />
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative w-full overflow-hidden flex flex-col">
                {/* Viewer Controls */}
                <div className="px-5 py-2.5 bg-[#fdfdfd] flex justify-between items-center text-micro-label text-gray-500 border-b border-gray-100">
                    <span>Página {Math.max(1, Math.ceil(progress / 33))} / 12</span>
                    <div className="flex gap-4 text-gray-400">
                        <button className="hover:text-primary transition-colors"><ZoomOut size={14} /></button>
                        <button className="hover:text-primary transition-colors"><ZoomIn size={14} /></button>
                    </div>
                </div>

                {/* Scrollable Document Area */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f4f7f5] hide-scrollbar"
                >
                    {/* Page 1 */}
                    <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden min-h-[400px] flex flex-col border border-gray-100/50 relative">
                        <div className="h-48 w-full relative flex items-center justify-center bg-gray-900">
                            <img
                                src="https://images.unsplash.com/photo-1510511459019-5efa370248f7?q=80&w=800&auto=format&fit=crop"
                                alt="Security Lock"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent flex items-center justify-center p-6">
                                <h2 className="text-white text-[28px] mt-10 font-bold leading-tight drop-shadow-lg text-center max-w-[200px]">Introducción a la Ciberseguridad</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[70%]"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[95%]"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[95%]"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[80%]"></div>

                            <h3 className="text-[16px] font-bold text-gray-800 mt-8 mb-4">Protocolos Básicos</h3>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[95%]"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[85%]"></div>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden min-h-[400px] flex flex-col p-6 border border-gray-100/50">
                        <h3 className="text-lg font-bold mb-6 text-gray-900">Identificación de Amenazas</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="h-20 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[#94a3b8] border border-gray-100">
                                <Anchor size={28} />
                            </div>
                            <div className="h-20 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[#94a3b8] border border-gray-100">
                                <Bug size={28} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-full"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-full"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[80%]"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-full"></div>
                            <div className="h-3 bg-[#e2e8f0] rounded-full w-[70%]"></div>
                        </div>
                        <div className="mt-8 p-4 bg-[#fdfaf2] border-l-4 border-[#f0c14b] text-body text-[#5e4905] rounded-r-md">
                            <strong className="text-[#a47a16]">Nota Importante:</strong> Nunca comparta sus credenciales de acceso con nadie, ni siquiera con el departamento de TI.
                        </div>
                    </div>

                    {/* Locked Document End */}
                    <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl p-8 flex flex-col items-center justify-center text-center border border-gray-100/50 min-h-[200px]">
                        <div className="size-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4">
                            <Lock size={24} />
                        </div>
                        <h3 className="text-gray-900 font-bold mb-2">Contenido Protegido</h3>
                        <p className="text-xs text-gray-500 max-w-[220px]">Continúe leyendo para desbloquear la evaluación final y obtener sus puntos de recompensa.</p>
                    </div>

                    <div className="h-12 flex items-center justify-center text-micro-label text-gray-600">
                        Fin de la vista
                    </div>
                </div>

            </main>

            {/* Bottom Action Bar */}
            <footer className="bg-white border-t border-gray-100 p-4 pb-8 z-10 relative">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {/* Primary Action */}
                    <button
                        onClick={onComplete}
                        disabled={!hasScrolledToBottom}
                        className={`w-full flex items-center justify-center gap-2 h-14 font-black rounded-2xl transition-all shadow-md active:scale-95 ${hasScrolledToBottom
                            ? "bg-primary-vibrant text-black"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <span>Marcar como Completado</span>
                        <CheckCircle2 size={20} />
                    </button>
                </div>
            </footer>
        </div>
    );
}
