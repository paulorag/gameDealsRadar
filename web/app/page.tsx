import { Suspense } from "react";

// Componente que vai buscar os dados (Server Component)
async function GameList() {
    // ATENÇÃO: No Next 15, o fetch precisa ser tratado com carinho
    // URL absoluta é necessária no server-side docker/node
    // Para teste local do navegador (client), usamos relativa, mas aqui é Server Component.
    // Vamos deixar hardcoded localhost:8080 por enquanto para testar a comunicação container-to-host ou local.

    try {
        // Tenta bater na API.
        // 'no-store': garante que sempre pegue o preço atual (Real-time), sem cache velho.
        const res = await fetch("http://localhost:8080/games", {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Falha ao buscar jogos");
        }

        const games = await res.json();

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                {games.map((game: any) => (
                    <div
                        key={game.id}
                        className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all"
                    >
                        {game.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={game.imageUrl}
                                alt={game.title}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        ) : (
                            <div className="w-full h-48 bg-slate-700 rounded mb-4 flex items-center justify-center text-slate-500">
                                Sem Imagem
                            </div>
                        )}

                        <h2
                            className="text-xl font-bold text-white mb-2 truncate"
                            title={game.title}
                        >
                            {game.title}
                        </h2>

                        <div className="flex justify-between items-end mt-4">
                            <span className="text-sm text-slate-400">
                                ID Steam: {game.steamAppId}
                            </span>
                            {/* Vamos tratar o preço no futuro, por enquanto exibe o objeto ou nada */}
                            <button className="text-emerald-400 font-bold border border-emerald-400 px-3 py-1 rounded hover:bg-emerald-400/10">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    } catch (error) {
        return (
            <div className="p-4 border border-red-500 bg-red-500/10 rounded text-red-200">
                Erro ao conectar com o Backend. O Java está rodando?
            </div>
        );
    }
}

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center bg-slate-950 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                Game Deals Radar 🎯
            </h1>

            <p className="mb-8 text-slate-400">
                Monitorando preços em tempo real com Next.js 15 & Spring Boot
            </p>

            {/* Suspense: Mostra "Carregando..." enquanto o fetch do GameList não termina */}
            <Suspense
                fallback={
                    <p className="text-yellow-400 animate-pulse">
                        Buscando ofertas...
                    </p>
                }
            >
                <GameList />
            </Suspense>
        </main>
    );
}
