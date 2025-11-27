"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddReviewPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Estados del formulario
    const [bookTitle, setBookTitle] = useState("");
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(5);
    const [mood, setMood] = useState("Intelectual");

    // Opciones creativas para el Bonus
    const moodOptions = [
        { value: "alucinante", label: "Alucinante" },
        { value: "relajante", label: "Relajante" },
        { value: "emotivo", label: "Emotivo" },
        { value: "intelectual", label: "Intelectual" },
        { value: "inspirador", label: "Inspirador" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookTitle, review, rating, mood }),
        });

        if (res.ok) {
            router.push("/reviews");
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.error || "Error al publicar");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200 p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl w-full max-w-lg shadow-2xl">

                <h1 className="text-2xl font-bold text-white mb-6">Publicar Reseña</h1>

                {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Título del Libro</label>
                        <input
                            type="text"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-white outline-none placeholder-zinc-700"
                            placeholder="Ej: Cien años de soledad"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Estrellas</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white outline-none"
                            >
                                {[5, 4, 3, 2, 1].map(num => (
                                    <option key={num} value={num}>{num} ⭐</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Atmósfera (Mood)</label>
                            <select
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white outline-none"
                            >
                                {moodOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Tu Opinión</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={4}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-white outline-none resize-none placeholder-zinc-700"
                            placeholder="¿Qué te pareció la historia?"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-transparent border border-zinc-700 text-zinc-300 py-3 rounded-lg hover:bg-zinc-800 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition"
                        >
                            {loading ? "Publicando..." : "Publicar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}