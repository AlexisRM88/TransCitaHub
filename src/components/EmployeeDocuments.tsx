import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CheckCircle2, Circle, FileText, AlertCircle, BadgeCheck } from "lucide-react";

export function EmployeeDocuments({ userId }: { userId: string }) {
    const documents = useQuery(api.documents.getDocuments, { userId });

    if (!documents) {
        return (
            <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                    <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                </div>
            </div>
        );
    }

    const docsList = [
        { key: "ley300", label: "Ley 300", value: documents.ley300 },
        { key: "cpr", label: "Certificado de CPR", value: documents.cpr },
        { key: "recordChoferil", label: "Récord Choferil", value: documents.recordChoferil },
        { key: "antecedentes", label: "Antecedentes Penales", value: documents.antecedentes },
        { key: "licenciaCat4", label: "Licencia Cat 4", value: documents.licenciaCat4 },
    ];

    const autorizacion = { key: "autorizacionOperador", label: "Autorización de Operador de Cuidado Médico", value: documents.autorizacionOperador };


    const completedCount = docsList.filter(d => d.value).length;
    const progressPerc = Math.round((completedCount / docsList.length) * 100);

    return (
        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" /> Documentos Requisitos
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Requeridos para el puesto de RSP</p>
                </div>
                <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                    {progressPerc}%
                </div>
            </div>

            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-700 ${progressPerc === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${progressPerc}%` }}
                />
            </div>

            <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pre-requisitos</p>
                {docsList.map((doc, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border ${doc.value ? 'bg-green-50/30 border-green-100' : 'bg-gray-50 border-gray-100/50'}`}>
                        <span className={`text-sm font-bold ${doc.value ? 'text-gray-900' : 'text-gray-500'}`}>
                            {doc.label}
                        </span>
                        {doc.value ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                            <div className="flex items-center gap-1.5 text-orange-400">
                                <span className="text-[10px] font-black uppercase tracking-wider">Pendiente</span>
                                <AlertCircle size={16} />
                            </div>
                        )}
                    </div>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Estado Final</p>
                    <div className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${autorizacion.value ? 'bg-primary/5 border-primary shadow-lg shadow-green-100' : 'bg-gray-50 border-dashed border-gray-200 opacity-60'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-xl flex items-center justify-center ${autorizacion.value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <BadgeCheck size={20} />
                            </div>
                            <span className={`text-xs font-black leading-tight max-w-[150px] ${autorizacion.value ? 'text-gray-900' : 'text-gray-400'}`}>
                                {autorizacion.label}
                            </span>
                        </div>
                        {autorizacion.value ? (
                            <span className="bg-primary text-gray-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">AUTORIZADO</span>
                        ) : (
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">EN PROCESO</span>
                        )}
                    </div>
                </div>
            </div>
            
            {progressPerc < 100 && !autorizacion.value && (
                <p className="text-[10px] text-gray-400 font-medium mt-4 text-center">
                    Comunícate con Recursos Humanos para entregar los documentos o solicitar tu autorización.
                </p>
            )}
        </div>
    );
}
