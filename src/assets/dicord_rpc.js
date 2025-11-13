const RPC = require("discord-rpc");
const clientId = '1390336653125484555';


module.exports = function initializeDiscordRPC() {

    return new Promise((resolve, reject) => {

        console.log('Init RPC')
        const rpc = new RPC.Client({ transport: "ipc" });
        const startTimestamp = Date.now();

        rpc.on("ready", () => {

            function setActivity (state) 
            {

                rpc.setActivity({
                    details: "Silvercore Inc.",
                    state,
                    startTimestamp,
                    largeImageKey: "logo",
                    smallImageKey: state.endsWith('- Silvernote edit') ? 'pencil' : 'none' || 'none',
                    buttons: [
                        { label: "Découvrir silvernote", url: "https://www.silvernote.fr" }
                    ],
                    instance: false,
                });

            }

            console.log('RPC OK')
            resolve({ rpc, setActivity })
        });

        rpc.login({ clientId }).catch((err) => {
            console.error("❌ Erreur de connexion RPC :", err);
            reject(err);
        });

    });

}