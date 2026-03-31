"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Timer, MapPin, ChevronLeft, ShieldCheck, ChevronUp } from "lucide-react";

export interface BenefitItem {
    id: string;
    title: string;
    subtitle: string;
    emoji: string;
    distance: string;
    rating: string;
    category: string;
    imageUrl: string;
    outOfRange?: boolean;
    usesLeft?: number;
}

interface CouponTimerProps {
    benefit: BenefitItem;
    isExpanded: boolean;
    onToggle: () => void;
    activeRedeemingId: string | null;
    onRedeemStateChange: (id: string | null) => void;
    onExpire: () => void;
    onConfirmRedeem?: () => void;
}

export function CouponTimer({ benefit, isExpanded, onToggle, activeRedeemingId, onRedeemStateChange, onExpire, onConfirmRedeem }: CouponTimerProps) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [status, setStatus] = useState<"idle" | "active" | "used" | "expired">("idle");

    const isAnotherRedeeming = activeRedeemingId !== null && activeRedeemingId !== benefit.id;

    // Reset status to idle if accordion gets closed while we're not actively redeeming (or even if we are, maybe cancel it)
    useEffect(() => {
        if (!isExpanded && status === "idle") {
            // Already idle, doing nothing
        } else if (!isExpanded && status !== "idle") {
            // Reset state when closed
            setStatus("idle");
            setTimeLeft(300);
            onRedeemStateChange(null);
        }
    }, [isExpanded, status, onRedeemStateChange]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === "active" && timeLeft > 0 && isExpanded) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        } else if (timeLeft <= 0 && status === "active") {
            setStatus("expired");
            onRedeemStateChange(null);
            onExpire();
        }
    }, [status, timeLeft, isExpanded, onExpire, onRedeemStateChange]);

    const handleActivate = () => {
        if (isAnotherRedeeming) {
            alert("Ya tienes otro cupón activo. Por favor finaliza o cierra ese primero.");
            return;
        }
        setStatus("active");
        onRedeemStateChange(benefit.id);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (!isExpanded) {
        // Compact View
        return (
            <div
                onClick={onToggle}
                className={`flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all cursor-pointer hover:shadow-md ${benefit.outOfRange ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
                <div className="size-20 rounded-xl bg-gray-200 flex-shrink-0 flex items-center justify-center text-3xl">
                    {benefit.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="text-gray-900 font-bold truncate pr-3">{benefit.title}</h4>
                        <span className={`text-caption font-bold px-2 py-1 rounded-full flex gap-1 items-center shrink-0 ${benefit.outOfRange ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-primary'}`}>
                            <MapPin size={12} /> {benefit.distance}
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-2 truncate">{benefit.subtitle}</p>
                    <div className="flex items-center gap-2 text-caption text-gray-600">
                        {benefit.outOfRange ? (
                            <><ShieldCheck size={12} /> Fuera de rango</>
                        ) : (
                            <>
                                <span className="text-yellow-500 font-bold flex gap-1 items-center">⭐ {benefit.rating}</span>
                                <span>• {benefit.category}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                        <ChevronLeft className="rotate-180" size={16} />
                    </div>
                </div>
            </div>
        );
    }

    // Expanded View (Full Active Coupon State)
    return (
        <div className="px-2 animate-in slide-in-from-top-4 fade-in duration-300">
            <h2 className="text-gray-900 text-xl font-bold mb-4 flex items-center justify-between px-2 cursor-pointer" onClick={onToggle}>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary-vibrant" size={24} /> {status === 'idle' ? 'Detalles de Beneficio' : 'Cupón Activo'}
                </div>
                <button className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><ChevronUp size={20} /></button>
            </h2>
            <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-[#f9fdfa] shadow-[0_10px_40px_rgba(0,143,57,0.08)] p-3 group">
                <div className="relative z-10 flex flex-col items-center">
                    {/* Image Header with Label inside */}
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-5 bg-green-50 relative border border-black/5">
                        <img
                            src={benefit.imageUrl}
                            alt={benefit.title}
                            className="w-full h-full object-cover"
                        />
                        {status === "active" && (
                            <div className="absolute top-4 right-4 bg-primary-vibrant text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5">
                                <Timer size={14} /> En curso
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center text-center px-4 mb-4">
                        <p className="text-micro-label text-primary mb-1.5">TRANSCITA EXCLUSIVE</p>
                        <h3 className="text-[28px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">{benefit.subtitle}</h3>
                        <p className="text-gray-500 text-sm">Válido en {benefit.title}</p>
                    </div>

                    {status === "idle" && (
                        <div className="w-full mt-2">
                            <button
                                onClick={handleActivate}
                                disabled={isAnotherRedeeming || (benefit.usesLeft !== undefined && benefit.usesLeft <= 0)}
                                className={`w-full h-14 text-gray-900 rounded-2xl font-black text-lg shadow-lg transition-all ${(isAnotherRedeeming || (benefit.usesLeft !== undefined && benefit.usesLeft <= 0)) ? 'bg-gray-300 text-gray-500 shadow-none' : 'bg-primary-vibrant hover:bg-green-400 active:scale-95'}`}
                            >
                                {isAnotherRedeeming ? "Otro cupón abierto..." : (benefit.usesLeft === 0 ? "Agotado" : "Redimir Cupón")}
                            </button>
                            {benefit.usesLeft !== undefined && (
                                <p className="text-gray-500 text-xs text-center mt-4 mb-1 font-medium bg-gray-100 rounded-lg p-2 border border-gray-200">
                                    Te quedan <strong className="text-gray-900">{benefit.usesLeft} usos</strong> restantes
                                </p>
                            )}
                        </div>
                    )}

                    {status === "active" && (
                        <div className="w-full px-2">
                            {/* Timer Blocks */}
                            <div className="flex gap-4 py-4 pb-8 justify-center w-full items-end">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6fbf1] border border-green-200/50">
                                        <p className="text-primary text-3xl font-bold tabular-nums">{minutes.toString().padStart(2, "0")}</p>
                                    </div>
                                    <span className="text-micro-label text-gray-600">Min</span>
                                </div>
                                <div className="flex flex-col justify-center pb-8">
                                    <span className="text-primary font-bold text-2xl">:</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6fbf1] border border-green-400 shadow-[0_4px_15px_rgba(19,236,109,0.3)]">
                                        <p className="text-primary text-3xl font-bold tabular-nums">{seconds.toString().padStart(2, "0")}</p>
                                    </div>
                                    <span className="text-micro-label text-gray-600">Sec</span>
                                </div>
                            </div>

                            <button onClick={() => {
                                setStatus("used");
                                onRedeemStateChange(null);
                                if (onConfirmRedeem) onConfirmRedeem();
                                alert("Transacción Confirmada!");
                            }} className="w-full flex items-center justify-center gap-2 h-14 bg-[#13ec6d] hover:bg-green-400 text-gray-900 text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-95 mb-1 text-center">
                                <CheckCircle2 size={24} /> Confirmar Transacción
                            </button>
                        </div>
                    )}

                    {status === "used" && (
                        <div className="w-full mt-4 bg-green-50 text-green-700 rounded-2xl py-4 font-black flex justify-center items-center gap-2 text-center border border-green-200 uppercase tracking-widest text-sm">
                            <CheckCircle2 /> Redimido hoy
                        </div>
                    )}

                    {status === "expired" && (
                        <div className="w-full mt-4 bg-red-50 text-red-500 rounded-2xl py-4 font-black text-center border border-red-100 uppercase tracking-widest text-sm">
                            Cupón Expirado
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
