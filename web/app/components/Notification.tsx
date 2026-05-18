"use client";

import { useEffect, useState } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationMessage {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number;
}

const notificationStyles = {
    success: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-200",
        icon: "✓",
        iconColor: "text-emerald-400",
    },
    error: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-200",
        icon: "✕",
        iconColor: "text-red-400",
    },
    warning: {
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-200",
        icon: "⚠",
        iconColor: "text-orange-400",
    },
    info: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        text: "text-yellow-200",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
        ),
        iconColor: "text-yellow-400",
    },
};

export default function Notification({
    notification,
    onClose,
}: {
    notification: NotificationMessage;
    onClose: () => void;
}) {
    const [isVisible, setIsVisible] = useState(true);
    const style = notificationStyles[notification.type];

    useEffect(() => {
        const displayDuration = notification.duration || 5000;
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, displayDuration);

        return () => clearTimeout(timer);
    }, [onClose, notification.duration]);

    return (
        <div
            className={`transform transition-all duration-300 ${
                isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            }`}
        >
            <div
                className={`rounded-2xl border ${style.bg} ${style.border} p-4 shadow-lg shadow-slate-950/50 max-w-md`}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`shrink-0 text-xl font-bold mt-0.5 ${style.iconColor}`}
                    >
                        {style.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-semibold ${style.text}`}>
                            {notification.title}
                        </h3>
                        {notification.message && (
                            <p
                                className={`mt-1 text-sm ${style.text} opacity-80`}
                            >
                                {notification.message}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className={`shrink-0 cursor-pointer text-lg opacity-60 hover:opacity-100 transition ${style.text}`}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}
