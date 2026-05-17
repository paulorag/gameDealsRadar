"use client";

import NotificationContainer from "./components/NotificationContainer";
import { NotificationProvider } from "./context/NotificationContext";
import { ServerProvider } from "../app/context/ServerContext";
import Header from "./components/Header";

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <NotificationContainer />
            <Header />
            <div className="min-h-screen pt-28">
                <ServerProvider>{children}</ServerProvider>
            </div>
        </NotificationProvider>
    );
}
