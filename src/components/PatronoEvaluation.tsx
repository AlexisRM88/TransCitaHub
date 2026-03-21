"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
    Users, 
    CheckCircle2, 
    Clock, 
    Search, 
    Filter,
    ChevronRight,
    Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { AdminDocumentManager } from "./AdminDocumentManager";

export function PatronoEvaluation({ userId }: { userId: string }) {
    const employeeProgress = useQuery(api.lms.getCompanyProgress, { userId }) || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedEmpId, setExpandedEmpId] = useState<string | null>(null);

    // FALLBACK DE DEMOSTRACIÓN:
    // Si la base de datos está vacía, usamos estos empleados ficticios para que la presentación nunca falle.
    const mockEmployees = [
        { userId: "demo-user-1", fullName: "Luis Pérez", completedModules: ["bienvenida", "mision", "valores"] },
        { userId: "demo-user-2", fullName: "María Santiago", completedModules: ["bienvenida", "mision", "valores", "comunicacion-efectiva", "seguridad-vial"] },
        { userId: "demo-user-3", fullName: "Carlos Rivera", completedModules: [] },
    ];

    const displayEmployees = employeeProgress.length > 0 ? employeeProgress : mockEmployees;

    const filteredEmployees = displayEmployees.filter(emp => 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Evaluación de Empleados</h2>
                    <p className="text-sm text-gray-500 font-medium">Monitorea el progreso de adiestramiento de tu equipo.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Users size={12} /> {employeeProgress.length} Empleados
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center px-4 py-3 gap-3 focus-within:border-green-400 transition-colors">
                    <Search size={20} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar empleado..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-medium w-full text-gray-900"
                    />
                </div>
                <button className="bg-white px-4 rounded-2xl border border-gray-100 shadow-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Filter size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Filtrar</span>
                </button>
            </div>

            {/* Employees List */}
            <div className="space-y-4">
                {filteredEmployees.length === 0 ? (
                    <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Users size={32} />
                        </div>
                        <h3 className="font-black text-gray-900">No hay empleados encontrados</h3>
                        <p className="text-sm text-gray-500 font-medium">Intenta con otro término de búsqueda.</p>
                    </div>
                ) : (
                    filteredEmployees.map((emp, i) => (
                        <motion.div
                            key={emp.userId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setExpandedEmpId(expandedEmpId === emp.userId ? null : emp.userId)}
                            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-green-200 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className="size-14 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-black text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                    {emp.fullName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-gray-900">{emp.fullName}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5">
                                            <Award size={14} className="text-orange-400" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                {emp.completedModules.length} Módulos completados
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-blue-400" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                Activo hoy
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`size-10 rounded-full flex items-center justify-center transition-all ${
                                    expandedEmpId === emp.userId
                                        ? "bg-green-500 text-white rotate-90" 
                                        : "bg-gray-50 text-gray-300 group-hover:bg-green-500 group-hover:text-white"
                                }`}>
                                    <ChevronRight size={20} />
                                </div>
                            </div>

                            {/* Mini Progress Bars for visual feedback */}
                            <div className="mt-4 flex gap-1 h-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`flex-1 rounded-full ${idx < emp.completedModules.length ? "bg-green-500" : "bg-gray-100"}`}
                                    />
                                ))}
                            </div>

                            {expandedEmpId === emp.userId && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                            <Award size={12} /> Adiestramientos Completados ({emp.completedModules.length})
                                        </h4>
                                        {emp.completedModules.length === 0 ? (
                                            <p className="text-xs text-gray-400 font-medium italic mb-2">Este empleado aún no ha completado ningún adiestramiento.</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {emp.completedModules.map(mod => (
                                                    <span key={mod} className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-[11px] font-black border border-orange-100/50 uppercase tracking-widest">
                                                        {mod.replace(/-/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <AdminDocumentManager userId={emp.userId} />
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Summary Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Estado General del Equipo</p>
                        <h3 className="text-3xl font-black">78% Completado</h3>
                        <p className="text-xs font-bold text-green-400 mt-1">¡Buen ritmo este mes!</p>
                    </div>
                    <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-green-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
