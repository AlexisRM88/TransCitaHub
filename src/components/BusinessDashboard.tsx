"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
    BarChart3, 
    Eye, 
    MousePointerClick, 
    Gift, 
    Clock, 
    TrendingUp, 
    TrendingDown,
    ArrowUpRight,
    Info
} from "lucide-react";
import { motion } from "framer-motion";

export function BusinessDashboard({ clerkId }: { clerkId: string }) {
    // In a real scenario, we would fetch real analytics from Convex/Google Analytics
    // For now, we simulate the data as planned
    const stats = [
        { label: "Vistas Totales", value: "1,284", icon: <Eye className="text-blue-500" />, trend: "+12%", trendUp: true },
        { label: "Clicks", value: "456", icon: <MousePointerClick className="text-purple-500" />, trend: "+5%", trendUp: true },
        { label: "Redenciones", value: "89", icon: <Gift className="text-green-500" />, trend: "-2%", trendUp: false },
        { label: "Tiempo Promedio", value: "2:45m", icon: <Clock className="text-orange-500" />, trend: "+18s", trendUp: true },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Dashboard de Negocio</h2>
                    <p className="text-sm text-gray-500 font-medium">Análisis de impacto y rendimiento de tus beneficios.</p>
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
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
                        className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm"
                    >
                        <div className="size-10 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-500">
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{stat.value}</h3>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                            {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {stat.trend} des. mes pasado
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Chart Placeholder */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                            <BarChart3 className="text-green-500" size={20} />
                            Actividad Semanal
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">Frecuencia de uso de cupones por día.</p>
                    </div>
                    <button className="text-[10px] font-black uppercase text-gray-400 border-2 border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        Octubre 2024
                    </button>
                </div>

                {/* Simulated Chart Bars */}
                <div className="flex items-end justify-between h-40 gap-2 mb-4">
                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                            <div className="w-full relative">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                                    className="bg-green-100 rounded-t-xl group-hover:bg-green-500 transition-colors cursor-pointer relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}
                                    </div>
                                </motion.div>
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Google Analytics Footer */}
            <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Info size={16} className="text-blue-500" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Resultados impulsados por <span className="text-gray-900">Google Analytics</span>
                </p>
                <ArrowUpRight size={14} className="text-gray-400" />
            </div>
        </div>
    );
}
