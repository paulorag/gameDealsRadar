"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-emerald-500 text-slate-950 hover:bg-emerald-400 border border-transparent shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30",
    secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 shadow-lg shadow-slate-950/20 hover:shadow-slate-950/30",
    danger: "bg-red-500 text-white hover:bg-red-600 border border-red-500/70 shadow-lg shadow-red-500/20 hover:shadow-red-500/30",
    ghost: "bg-transparent text-emerald-300 hover:bg-emerald-400/15 border border-emerald-400/50 shadow-none",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: ReactNode;
}

export default function Button({
    variant = "primary",
    className = "",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
