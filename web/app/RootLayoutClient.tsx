"use client";

import NotificationContainer from "./components/NotificationContainer";
import { NotificationProvider } from "./context/NotificationContext";
import { ServerProvider } from "../app/context/ServerContext";

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <NotificationContainer />
            <ServerProvider>{children}</ServerProvider>
        </NotificationProvider>
    );
}
