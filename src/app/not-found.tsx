"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center shadow-lg border border-gray-800">
          <AlertCircle size={48} className="text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Página no encontrada</h1>
          <p className="text-gray-400 font-medium">La ruta que intentas buscar no existe o no tienes acceso.</p>
        </div>
        <Link 
          href="/"
          className="inline-block py-3 px-8 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl transition-all"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
