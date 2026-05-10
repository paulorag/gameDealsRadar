import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-8">
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Login
                    </h1>
                    <p className="mt-4 text-slate-300">
                        Acesse o painel com sua conta para começar a rastrear
                        jogos.
                    </p>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
