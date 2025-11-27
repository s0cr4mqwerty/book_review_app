"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { logoutAction, getMyUserId } from "../actions";

interface Review {
    id: string;
    bookTitle: string;
    review: string;
    rating: number;
    mood: string;
    userId: string;
    users: { name: string };
}


const MOOD_THEMES: Record<string, { badge: string; gradient: string }> = {
    "alucinante": {
        badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        gradient: "from-purple-900/80 via-purple-900/10 to-transparent",
    },
    "relajante": {
        badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        gradient: "from-orange-900/80 via-orange-900/10 to-transparent",
    },
    "emotivo": {
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        gradient: "from-blue-900/80 via-blue-900/10 to-transparent",
    },
    "intelectual": {
        badge: "bg-teal-500/20 text-teal-300 border-teal-500/30",
        gradient: "from-teal-900/80 via-teal-900/10 to-transparent",
    },
    "inspirador": {
        badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        gradient: "from-yellow-900/80 via-yellow-900/10 to-transparent",
    },
    default: {
        badge: "bg-zinc-800/50 text-zinc-400 border-zinc-800",
        gradient: "from-zinc-900 via-transparent to-transparent",
    },
};

export default function ReviewsPage() {
    const router = useRouter();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [myUserId, setMyUserId] = useState<string | null>(null);

    useEffect(() => {

        fetch("/api/reviews", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                setReviews(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));


        getMyUserId().then((id) => setMyUserId(id));
    }, []);


    const handleDelete = async (reviewId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta reseña?")) return;


        const res = await fetch(`/api/reviews/${reviewId}`, {
            method: "DELETE",
        });

        if (res.ok) {

            setReviews(reviews.filter((r) => r.id !== reviewId));
            router.refresh();
        } else {
            alert("Hubo un error al intentar borrar.");
        }
    };

    const filteredReviews = reviews.filter((r) =>
        r.bookTitle.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 p-8">
            {/* HEADER */}
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-zinc-800 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Muro de Reseñas</h1>
                    <p className="text-zinc-500 text-sm mt-1">Descubre qué está leyendo la comunidad</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <input
                        type="text" placeholder="🔍 Buscar libro..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 w-full md:w-64 transition-colors"
                    />
                    <button onClick={() => logoutAction()} className="text-sm text-zinc-400 hover:text-white whitespace-nowrap">Salir</button>
                    <button onClick={() => router.push("/add-review")} className="bg-white text-black px-4 py-2 rounded-md font-bold text-sm hover:bg-zinc-200 transition whitespace-nowrap">+ Reseñar</button>
                </div>
            </div>


            <div className="max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20"><p className="text-zinc-500 animate-pulse">Cargando biblioteca...</p></div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                        <p className="text-zinc-400 mb-2">{search ? "No encontramos libros." : "Aún no hay reseñas."}</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredReviews.map((review) => {
                            const theme = MOOD_THEMES[review.mood] || MOOD_THEMES.default;

                            return (
                                <div key={review.id} className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:border-zinc-600 transition-all hover:-translate-y-1 shadow-lg flex flex-col">


                                    <div className={clsx("absolute inset-0 pointer-events-none bg-gradient-to-t opacity-40", theme.gradient)} />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="overflow-hidden">
                                                <h3 className="text-lg font-bold text-white truncate" title={review.bookTitle}>{review.bookTitle}</h3>
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Por {review.users.name}</p>
                                            </div>
                                            <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20 whitespace-nowrap">★ {review.rating}/5</span>
                                        </div>

                                        <p className="text-zinc-300 text-sm leading-relaxed mb-4 line-clamp-4 flex-grow">"{review.review}"</p>

                                        <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4 mt-auto">


                                            <div className={clsx("inline-flex items-center text-xs px-3 py-1 rounded-full border capitalize font-medium tracking-wide", theme.badge)}>
                                                {review.mood}
                                            </div>

                                            {myUserId === review.userId && (
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="text-red-500 hover:text-red-400 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition-colors z-20"
                                                >
                                                    Borrar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}