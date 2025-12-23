import type { AppError } from "./types";
const DISCORD_WEBHOOK = import.meta.env.VITE_DISCORD_ISSUE_WH;

export default async function
(error: AppError): Promise<void>
{
    if (!DISCORD_WEBHOOK) return;

    try {
        await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                embeds: [
                    {
                        title: "🚨 Nouvelle erreur client Silvernote",
                        color: 15158332, // rouge
                        fields: [
                            {
                                name: "Message",
                                value: `\`\`\`${error.message ?? "—"}\`\`\``,
                            },
                            {
                                name: "Code",
                                value: error.error ?? "unknown",
                                inline: true,
                            },
                            {
                                name: "Origine",
                                value: error.place ?? "non précisée",
                                inline: true,
                            },
                        ],
                        footer: {
                            text: `ID: ${error.id}`,
                        },
                        timestamp: error.timestamp.toISOString(),
                        description: error.more ?? undefined,
                    },
                ],
            }),
        });
    } catch (e) {
        console.warn("Impossible d'envoyer l'erreur à Discord", e);
    }
};