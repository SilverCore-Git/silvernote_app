const RPC = require("discord-rpc");
const clientId = '1390336653125484555';


module.exports = function initializeDiscordRPC() {

    const rpc = new RPC.Client({ transport: "ipc" });
    const startTimestamp = Date.now();

    async function setActivity(state = "Accueil") {
        if (!rpc) return;

        rpc.setActivity({
            details: "App de prise de note simple et intuitive",
            state,
            startTimestamp,
            largeImageKey: "logo",
            smallImageKey: state.startsWith('Silvernote') ? '' : 'pencil',
            buttons: [
                { label: "Découvrir silvernote", url: "https://www.silvernote.fr" }
            ],
            instance: false,
        });
    }

    rpc.on("ready", () => {
        setActivity();
    });

    rpc.login({ clientId }).catch(console.error);

    return { setActivity };

}