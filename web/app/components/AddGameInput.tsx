"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddGameInput() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Para recarregar a página após salvar

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);

        try {
            // Bate no nosso backend Java
            // Atenção: Aqui no Client (Navegador), usamos localhost:8080 normal
            const res = await fetch("http://localhost:8080/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (res.ok) {
                setUrl(""); // Limpa o input
                router.refresh(); // Recarrega os dados da página (GameList) sem F5
            } else {
                alert(
                    "Erro ao adicionar jogo. Verifique o link ou o console do Backend."
                );
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alert("Falha ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl mb-8 flex gap-2"
        >
            <input
                type="url"
                placeholder="Cole o link da loja Steam aqui..."
                className="flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded focus:outline-none focus:border-emerald-500 transition-colors"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Adicionando..." : "Rastrear"}
            </button>
        </form>
    );
}
