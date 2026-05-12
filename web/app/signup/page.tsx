import RegisterForm from "../components/RegisterForm";

export default function SignupPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-8">
            <div className="w-full max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                        Cadastro
                    </h1>
                    <p className="mt-4 text-slate-300">
                        Crie sua conta para acessar o painel e começar a
                        monitorar ofertas.
                    </p>
                </div>
                <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
                    <RegisterForm />
                </div>
            </div>
        </main>
    );
}
