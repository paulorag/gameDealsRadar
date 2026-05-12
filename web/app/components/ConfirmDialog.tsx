"use client";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={onCancel}
            ></div>
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/40">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                        {description}
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="inline-flex justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
