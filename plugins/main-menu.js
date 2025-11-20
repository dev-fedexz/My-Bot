import fs from 'fs';
import fetch from 'node-fetch';

const getBuffer = async (url) => {
    try {
        const res = await fetch(url);
        if (res.status !== 200) {
            console.error(`Error al descargar la imagen: Código de estado ${res.status}`);
            return null;
        }
        return await res.buffer();
    } catch (e) {
        console.error("Error en getBuffer:", e);
        return null;
    }
};

let tags = { info: '𓂂𓏸 𐅹੭੭ *`𝖨𝗇ẜᨣ`* 🪐 ᦡᦡ', anime: '𓂂𓏸 𐅹੭੭ *`𝖠𝗇ı𝗆ᧉ`* 🥞 ᦡᦡ', buscador: '𓂂𓏸 𐅹੭੭ *`Ｓᧉ𝖺ꭇ𝖼𝗁`* 🌿 ᦡᦡ', downloader: '𓂂𓏸 𐅹੭੭ *`𝖣ᨣ𝗐𝗇𝗅ᨣ𝖺𝖽ᧉꭇ𝗌`* 🍇 ᦡᦡ', economy: '𓂂𓏸 𐅹੭੭ *`𝖾𝖼𝗈𝗆𝗈𝗆𝗂𝖺`* 🌵 ᦡᦡ', fun: '𓂂𓏸 𐅹੭੭ *`𝖥𝗎𝗇`* 🌱 ᦡᦡ', group: '𓂂𓏸 𐅹੭੭ *`Gꭇußꭇ𝗎𝗉ᨣ𝗌`* ☕ ᦡ', ai: '𓂂𓏸 𐅹੭੭ *`𝖨𝗇ƚᧉ𝖨ı𝗀ᧉ𝗇𝖼ı𝖺𝗌`* 🧋 ᦡᦡ', game: '𓂂𓏸 𐅹੭੭ *`Game`* 🥞 ᦡᦡ', serbot: '𓂂𓏸 𐅹੭੭ *`𝖩𝖺𝖽ı-ᗷᨣƚ𝗌`* 🍂 ᦡᦡ', main: '𓂂𓏸 𐅹੭੭ *`𝖯ꭇ𝗂𝗇𝖼𝗂𝗉𝖺𝗅`* ☁️ ᦡᦡ', nable: '𓂂𓏸 𐅹੭੭ *`𝖮𝗇-𝖮ẜẜ`* 🍭 ᦡᦡ', nsfw: '𓂂𓏸 𐅹੭੭ *`𝖭𝗌ẜɯ`* 🪼 ᦡᦡ', owner: '𓂂𓏸 𐅹੭੭ *`Oɯ𝗇ᧉꭇ`* 🧇 ᦡᦡ', sticker: '𓂂𓏸 𐅹੭੭ *`𝖲ƚ𝗂𝖼𝗄ᧉꭇ`* ☘ ᦡᦡ', herramientas: '𓂂𓏸 𐅹੭੭ *`𝖨𝗇ƚᧉꭇ𝗇ᧉƚ`* 🌻 ᦡᦡ' };

let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid?.[0] || m.sender
    let categories = {}
    
    for (let plugin of Object.values(global.plugins)) {
        if (!plugin.help || !plugin.tags) continue
        for (let tag of plugin.tags) {
            if (!categories[tag]) categories[tag] = []
            categories[tag].push(...plugin.help.map(cmd => `#${cmd}`))
        }
    }

    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
    let menuText = `•——————•°•✿•°•——————•
╰┈➤ MαყBσƚ ⌇°•
⊱┊ ᴴᵉᶜʰᵒ ᵖᵒʳ ${global.etiqueta}
●～●～●～●～●～●～●～●～

➮ 𝐇𝐨𝐫𝐚: °❀ *${global.hora}*
➮ 𝐅𝐞𝐜𝐡𝐚: °❀ *${global.fecha}*
➮ 𝐓𝐢𝐩𝐨: °❀ *${(conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')}*
➮ 𝐔𝐬𝐮𝐚𝐫𝐢𝐨𝐬: °❀ *${totalreg.toLocaleString()}*
ׂ╰┈➤ *${totalCommands}* ℂ𝕠𝕞𝕒𝕟𝕕𝕠𝕤 𝕕𝕚𝕤𝕡𝕠𝕟𝕚𝕓𝕝𝕖𝕤.\n`.trim()

    for (let [tag, cmds] of Object.entries(categories)) {
        let tagName = tags[tag] || tag 
        menuText += `
ೃ‧₊› ${tagName} ：
${cmds.map(cmd => `╰┈➤ ${cmd}`).join('\n')}

↶*ೃ✧˚. ❃ ↷ ˊ-↶*ೃ✧˚. ❃ ↷ ˊ-
`
    }

    await conn.sendMessage(m.chat, {
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: global.canalNombreM[0],
                body: '⊱┊ MαყBσƚ ᵇʸ ˢᵒʸᵐᵃყᶜᵒˡ ❦',
                thumbnailUrl: 'https://i.postimg.cc/SQTP9YCm/4-sin-titulo-20251120074041.jpg',
                sourceUrl: 'https://mayapi.ooguy.com',
                mediaType: 1,
                renderLargerThumbnail: true
            },
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.canalIdM[0],
                newsletterName: global.canalNombreM[0],
                serverMessageId: -1,
            }
        }
    }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = true

export default handler
