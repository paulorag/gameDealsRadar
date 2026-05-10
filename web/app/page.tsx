import SecureDashboard from "./components/SecureDashboard";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center bg-slate-950 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                Game Deals Radar 🎯
            </h1>

            <p className="mb-8 text-slate-400">
                Monitorando preços em tempo real com Next.js 15 & Spring Boot
            </p>

            <SecureDashboard />
        </main>
    );
}
