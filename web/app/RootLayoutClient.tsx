"use client";

import NotificationContainer from "./components/NotificationContainer";
import { NotificationProvider } from "./context/NotificationContext";

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <NotificationContainer />
            {children}
        </NotificationProvider>
    );
}
