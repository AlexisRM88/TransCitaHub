import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Check, X, FileText } from "lucide-react";

export function AdminDocumentManager({ userId }: { userId: string }) {
    const documents = useQuery(api.documents.getDocuments, { userId });
    const toggleDoc = useMutation(api.documents.toggleDocument);

    if (!documents) {
        return (
            <div className="mt-4 p-4 rounded-2xl bg-gray-50 animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        );
    }

    const docsList = [
        { key: "ley300", label: "Ley 300", value: documents.ley300 },
        { key: "cpr", label: "Certificado de CPR", value: documents.cpr },
        { key: "recordChoferil", label: "Récord Choferil", value: documents.recordChoferil },
        { key: "antecedentes", label: "Antecedentes Penales", value: documents.antecedentes },
        { key: "licenciaCat4", label: "Licencia Cat 4", value: documents.licenciaCat4 },
    ] as const;

    const autorizacion = { key: "autorizacionOperador", label: "Autorización de Operador de Cuidado Médico", value: documents.autorizacionOperador };

    const handleToggle = (key: any) => {
        toggleDoc({ userId, documentKey: key });
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                <FileText size={12} /> Pre-requisitos (Validación)
            </h4>
            <div className="grid grid-cols-1 gap-2">
                {docsList.map((doc, idx) => (
                    <div 
                        key={idx} 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(doc.key);
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                            doc.value ? 'bg-green-50/50 border-green-200 hover:bg-green-100' : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <span className={`text-xs font-bold ${doc.value ? 'text-green-800' : 'text-gray-600'}`}>
                            {doc.label}
                        </span>
                        
                        <div className={`size-6 rounded-md flex items-center justify-center transition-colors ${
                            doc.value ? 'bg-green-500 text-white' : 'bg-gray-100 text-transparent hover:text-gray-300'
                        }`}>
                            <Check size={14} fill="currentColor" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Acción Final</h4>
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(autorizacion.key);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        autorizacion.value ? 'bg-primary border-primary text-white' : 'bg-white border-dashed border-gray-300 text-gray-400'
                    }`}
                >
                    <span className="text-xs font-black uppercase tracking-wide">
                        {autorizacion.label}
                    </span>
                    <div className={`size-6 rounded-full flex items-center justify-center ${autorizacion.value ? 'bg-white text-primary' : 'bg-gray-100 text-transparent'}`}>
                        <Check size={14} fill="currentColor" />
                    </div>
                </div>
            </div>

            <p className="text-[9px] text-gray-400 font-bold mt-4 text-center">
                Presiona los documentos para validar. La autorización es el paso final.
            </p>
        </div>
    );
}
