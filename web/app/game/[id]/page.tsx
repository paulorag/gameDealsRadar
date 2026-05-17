import GameDetailsClient from "./GameDetailsClient";

export default async function GameDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <GameDetailsClient id={id} />;
}
