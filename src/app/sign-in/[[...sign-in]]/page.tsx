"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn("password", { email, password, flow: "signIn" });
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 text-white font-sans overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-2xl border border-gray-800 rounded-[2.5rem] shadow-2xl p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-4">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">TransCita Hub</h1>
            <p className="text-sm text-gray-400 font-medium">Bienvenido de vuelta, compañero.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Correo Electrónico</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@transcita.com"
                  className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 px-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(34,197,94,0.2)] flex justify-center items-center gap-2 group disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            ¿No tienes cuenta en el hub?{" "}
            <Link href="/sign-up" className="text-green-400 hover:text-green-300 font-bold transition-colors">
              Pide acceso
            </Link>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-600 mt-6 font-medium">
          Sistema Seguro TransCita • Solo Personal Autorizado
        </p>
      </div>
    </div>
  );
}
