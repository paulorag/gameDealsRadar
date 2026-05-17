import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-start justify-center bg-slate-950 text-white p-8 pt-16">
            <div className="w-full max-w-2xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Login
                    </h1>
                    <p className="mt-4 text-slate-300">
                        Acesse o painel com sua conta para começar a rastrear
                        jogos.
                    </p>
                </div>
                <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
