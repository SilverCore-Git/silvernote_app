import { api_url } from "@/assets/ts/backend_link";
import { io, type Socket } from "socket.io-client";
import { ref, type Ref } from "vue";


// Le serveur bun (app.bun.ts), utilisé en dev comme en prod, intègre Socket.io
// directement sur le même port que l'API REST (voir app.bun.ts). Le port 3434
// correspondait à l'ancien serveur WebSocket séparé (wsocket/ws.ts), utilisé
// uniquement par l'entrypoint Node (app.ts), qui n'est plus celui exécuté.
const wsocketHost: string = api_url;

// Au-delà de cette durée en arrière-plan, la connexion est considérée comme
// suspecte au retour (mobile : le socket peut se croire connecté alors que la
// connexion TCP est morte, jusqu'au timeout de ping ~45s).
const HIDDEN_RECONNECT_THRESHOLD_MS = 5_000;

const socket = ref<Socket | null>(null);
let hiddenAt: number | null = null;

const reconnectIfNeeded = () => {
    const s = socket.value;
    if (!s || s.connected || s.active) return;
    s.connect();
};

const onVisibilityChange = () => {

    if (document.visibilityState === 'hidden')
    {
        hiddenAt = Date.now();
        return;
    }

    const s = socket.value;
    const wasHiddenLong = hiddenAt !== null && Date.now() - hiddenAt > HIDDEN_RECONNECT_THRESHOLD_MS;
    hiddenAt = null;

    if (s?.connected && wasHiddenLong)
    {
        // Force une reconnexion propre plutôt que d'écrire dans une connexion
        // potentiellement morte. La fermeture du transport déclenche la
        // reconnexion automatique de socket.io.
        s.io.engine?.close();
        return;
    }

    reconnectIfNeeded();

};

const useWSocket = async (): Promise<Ref<Socket | null>> => {

    // Un seul socket pour toute l'app : en recréer un orphelinerait les
    // listeners déjà attachés à l'ancien (EditorProvider, useNoteEditing...).
    if (socket.value)
    {
        reconnectIfNeeded();
        return socket as Ref<Socket | null>;
    }

    socket.value = io(wsocketHost, {
        path: "/socket",
        // Forme fonction : réévaluée à chaque (re)connexion. Les tokens Clerk
        // expirent en ~60s, un token figé à la création fait rejeter toutes les
        // reconnexions ultérieures par le middleware serveur.
        auth: (cb) => {
            const session = window.Clerk?.session;
            if (!session) return cb({});
            session.getToken()
                .then((token) => cb({ token }))
                .catch(() => cb({}));
        },
        reconnection: true,
        autoConnect: true,
    });

    socket.value.on("connect", () => {
        console.log("[WS] Connected with ID:", socket.value?.id);
    });

    socket.value.on("connect_error", (err) => {
        console.error("[WS] Connection Error:", err.message);
        // Un refus du middleware serveur (ex. token invalide) désactive la
        // reconnexion automatique de socket.io (`active` passe à false) :
        // on relance nous-mêmes, le token sera regénéré par `auth`.
        if (!socket.value?.active) setTimeout(reconnectIfNeeded, 2_000);
    });

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", reconnectIfNeeded);

    return socket as Ref<Socket | null>;

};

export default useWSocket;
