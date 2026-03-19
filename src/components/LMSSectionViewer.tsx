"use client";

import { useState, useRef, useEffect } from "react";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Play,
    BookOpen,
    FileText,
    Award,
    Circle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
    title: string;
    body: string;
}

interface DocumentItem {
    name: string;
    description?: string;
    image?: string;
    instructions: string[];
}

export interface OnboardingSection {
    id: string;
    title: string;
    type: 'presentation' | 'video' | 'document' | 'policy';
    content?: string;
    slides?: Slide[];
    videoUrl?: string;
    thumbnail?: string;
    documents?: DocumentItem[];
}

interface LMSViewerProps {
    section: OnboardingSection;
    onComplete: () => void;
    onBack: () => void;
    isAlreadyCompleted?: boolean;
}

export function LMSSectionViewer({ section, onComplete, onBack, isAlreadyCompleted = false }: LMSViewerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFinished, setIsFinished] = useState(isAlreadyCompleted);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Completion Logic
    useEffect(() => {
        if (isAlreadyCompleted) {
            setIsFinished(true);
            return;
        }

        if (section.type === 'presentation' || section.type === 'policy') {
            const totalSlides = section.slides?.length || 0;
            // If there's only one slide, it's already "viewed" at start
            if (totalSlides <= 1 || currentSlide === totalSlides - 1) {
                setIsFinished(true);
            }
        } else if (section.type === 'document') {
            setIsFinished(true);
        }
    }, [currentSlide, section, isAlreadyCompleted]);

    const handleVideoEnded = () => {
        setIsFinished(true);
    };

    const nextSlide = () => {
        if (section.slides && currentSlide < section.slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50 flex items-center justify-between">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-bold uppercase tracking-widest text-gray-400">Onboarding</h1>
                    <p className="font-extrabold text-gray-900">{section.title}</p>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </header>

            {/* Content Viewer */}
            <main className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">

                {/* 1. Presentation / Policy Type */}
                {(section.type === 'presentation' || section.type === 'policy') && section.slides && (
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col min-h-[400px]">
                            {/* Slide Counter / Progress */}
                            <div className="px-6 pt-6 flex gap-1">
                                {section.slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx <= currentSlide ? 'bg-green-500' : 'bg-gray-100'}`}
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-8 flex-1 flex flex-col"
                                >
                                    <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
                                        {section.slides[currentSlide].title}
                                    </h2>
                                    <div
                                        className="text-gray-600 leading-relaxed text-lg"
                                        dangerouslySetInnerHTML={{ __html: section.slides[currentSlide].body }}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Slide Navigation */}
                            <div className="p-6 bg-gray-50/50 flex justify-between border-t border-gray-50">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlide === 0}
                                    className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-all ${currentSlide === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-white active:scale-95'}`}
                                >
                                    <ChevronLeft size={20} /> Anterior
                                </button>

                                {currentSlide < section.slides.length - 1 ? (
                                    <button
                                        onClick={nextSlide}
                                        className="flex items-center gap-2 font-bold bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 active:scale-95 transition-all"
                                    >
                                        Siguiente <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <div className="w-24" />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Video Type */}
                {section.type === 'video' && (
                    <div className="bg-black rounded-3xl shadow-2xl overflow-hidden relative group aspect-video">
                        <video
                            ref={videoRef}
                            src={section.videoUrl}
                            controls
                            className="w-full h-full"
                            onEnded={handleVideoEnded}
                            poster={section.thumbnail}
                        />
                    </div>
                )}

                {/* 3. Document Type */}
                {section.type === 'document' && section.documents && (
                    <div className="space-y-6">
                        {section.documents.map((doc, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900">{doc.name}</h3>
                                        <p className="text-sm text-gray-500">{doc.description}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pl-4 border-l-2 border-green-100">
                                    {doc.instructions.map((inst, i) => (
                                        <div key={i} className="flex gap-3 text-sm text-gray-600">
                                            <Circle size={8} className="mt-1.5 text-green-500 fill-green-500" />
                                            <span>{inst}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Completion Area */}
                <div className="mt-8 pb-10">
                    <button
                        onClick={async () => {
                            if (isFinished && !isSubmitting) {
                                setIsSubmitting(true);
                                try {
                                    await onComplete();
                                } catch (e) {
                                    console.error("Error in onComplete:", e);
                                    setIsSubmitting(false);
                                }
                            }
                        }}
                        disabled={!isFinished || isSubmitting}
                        className={`w-full flex items-center justify-center gap-3 h-16 font-black rounded-2xl transition-all shadow-lg active:scale-95 ${isFinished
                            ? isSubmitting ? "bg-gray-400 text-white cursor-wait" : "bg-green-500 text-white shadow-green-200"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <span>
                            {isSubmitting ? "Guardando progreso..." :
                                isFinished ? "Marcar como Terminado" : "Visualice todo el contenido para finalizar"}
                        </span>
                        <CheckCircle2 size={24} className={isSubmitting ? "animate-spin" : ""} />
                    </button>
                    {isFinished && (
                        <p className="text-center text-green-600 text-xs font-bold mt-4 animate-bounce">
                            ¡Excelente! Ya puedes completar este paso.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
