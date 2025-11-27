"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/reviews");
                router.refresh(); //actualizamos el middleware
            } else {
                setError(data.error || "Error al iniciar sesión");
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200 p-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl w-full max-w-md shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-white mb-1">Book Review App</h1>
                    <p className="text-zinc-500 text-sm">Ingresa a tu cuenta</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder-zinc-600 sm:text-sm"
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder-zinc-600 sm:text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-zinc-200 transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Entrando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-500">
                    ¿No tienes cuenta?{" "}
                    <a href="/signup" className="text-white hover:underline underline-offset-4 font-medium">
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </div>
    );
}