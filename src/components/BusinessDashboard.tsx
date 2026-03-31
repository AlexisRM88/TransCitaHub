"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    BarChart3,
    Eye,
    Gift,
    TrendingUp,
    Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export function BusinessDashboard({ userId }: { userId: string }) {
    const analytics = useQuery(api.benefits.getMyOffersAnalytics, { ownerId: userId });

    const isLoading = analytics === undefined;

    // Aggregate totals across all offers
    const totalOpens7d = analytics?.reduce((sum, o) => sum + o.opens7d, 0) ?? 0;
    const totalRedeems = analytics?.reduce((sum, o) => sum + o.totalRedeems, 0) ?? 0;
    const liveOffers = analytics?.filter(o => o.isLive).length ?? 0;
    const globalConversion = totalOpens7d > 0
        ? Math.round((totalRedeems / totalOpens7d) * 100)
        : 0;

    // Build weekly bar chart: sum opens per day across all offers
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const total = analytics?.reduce((sum, offer) => {
            return sum + (offer.dailyData?.[i]?.opens ?? 0);
        }, 0) ?? 0;
        return total;
    });
    const maxBar = Math.max(...weeklyData, 1);

    const stats = [
        {
            label: "Aperturas (7d)",
            value: isLoading ? "—" : totalOpens7d.toLocaleString(),
            icon: <Eye className="text-blue-500" size={20} />,
            bg: "bg-blue-50",
        },
        {
            label: "Redenciones",
            value: isLoading ? "—" : totalRedeems.toLocaleString(),
            icon: <Gift className="text-green-500" size={20} />,
            bg: "bg-green-50",
        },
        {
            label: "Ofertas Activas",
            value: isLoading ? "—" : liveOffers.toString(),
            icon: <Zap className="text-purple-500" size={20} />,
            bg: "bg-purple-50",
        },
        {
            label: "Conversión",
            value: isLoading ? "—" : `${globalConversion}%`,
            icon: <TrendingUp className="text-orange-500" size={20} />,
            bg: "bg-orange-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Dashboard de Negocio</h2>
                    <p className="text-sm text-gray-500 font-medium">Análisis de impacto y rendimiento de tus beneficios.</p>
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-micro-label flex items-center gap-1">
                    <TrendingUp size={12} /> Live
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${stat.bg} p-5 rounded-[2rem] border border-white shadow-sm`}
                    >
                        <div className="size-10 bg-white/60 rounded-2xl flex items-center justify-center mb-4">
                            {stat.icon}
                        </div>
                        <p className="text-micro-label text-gray-600 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                            <BarChart3 className="text-green-500" size={20} />
                            Aperturas — Últimos 7 días
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">Veces que se abrió un beneficio por día.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 flex items-center justify-center text-gray-300 text-sm font-bold">
                        Cargando datos...
                    </div>
                ) : (
                    <div className="flex items-end justify-between h-40 gap-2 mb-4">
                        {weeklyData.map((val, i) => {
                            const heightPct = Math.round((val / maxBar) * 100);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                    <div className="w-full relative flex flex-col justify-end" style={{ height: "100%" }}>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(heightPct, val > 0 ? 4 : 0)}%` }}
                                            transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                                            className="bg-green-100 rounded-t-xl group-hover:bg-green-500 transition-colors cursor-pointer relative"
                                        >
                                            {val > 0 && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-caption font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {val}
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                    <span className="text-micro-label text-gray-600 tracking-tighter">
                                        {DAYS[i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Per-offer breakdown */}
            {analytics && analytics.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 pt-6 pb-3">
                        <h3 className="text-micro-label text-gray-900 text-sm">Rendimiento por Oferta</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {analytics
                            .slice()
                            .sort((a, b) => b.opens7d - a.opens7d)
                            .map((offer) => (
                                <div key={offer._id} className="flex items-center justify-between px-6 py-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-gray-900 truncate">{offer.merchantName}</p>
                                        <p className="text-caption text-gray-600 font-medium truncate">{offer.offerLabel}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-right shrink-0">
                                        <div>
                                            <p className="text-xs font-black text-blue-600">{offer.opens7d}</p>
                                            <p className="text-caption text-gray-600 uppercase tracking-wider">Aperturas</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-green-600">{offer.totalRedeems}</p>
                                            <p className="text-caption text-gray-600 uppercase tracking-wider">Redenciones</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-orange-500">{offer.conversionRate}%</p>
                                            <p className="text-caption text-gray-600 uppercase tracking-wider">Conversión</p>
                                        </div>
                                        <span className={`text-micro-label px-2 py-1 rounded-full ${offer.isLive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                                            {offer.isLive ? "Live" : "Off"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {analytics && analytics.length === 0 && (
                <div className="bg-gray-50 rounded-[2rem] p-8 text-center">
                    <p className="text-gray-600 font-bold text-sm">Aún no tienes ofertas creadas.</p>
                    <p className="text-gray-300 text-xs mt-1">Crea tu primera oferta en la sección Gestión.</p>
                </div>
            )}
        </div>
    );
}
