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

function clockString(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

let handler = async (m, { conn, usedPrefix }) => {
    let userId = m.mentionedJid?.[0] || m.sender
    let categories = {}
    
    let nombre = await conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    let premium = user?.premium ? 'sɪ́' : 'ɴᴏ'; 
    let totalreg = Object.keys(global.db.data.users).length;
    let groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length;
    let uptime = clockString(process.uptime());
    
    const fixedTitle = 'Shadow - Bot';
    const fixedBody = '𝑺𝒉𝒂𝒅𝒐𝒘`𝑺 - 𝑩𝒐𝒕';

    for (let plugin of Object.values(global.plugins)) {
        if (!plugin.help || !plugin.tags) continue
        for (let tag of plugin.tags) {
            if (!categories[tag]) categories[tag] = []
            categories[tag].push(...plugin.help.map(cmd => `${usedPrefix}${cmd}`))
        }
    }

    let infoMenu = `
❐ 𝖧𝗈𝗅𝖺, 𝖲𝗈🧋y *_𝖲𝗁𝖺𝖽𝗈𝗐 - 𝖡𝗈𝗍_* 🌱 

╰┈□ 𝖨𝖭𝖥𝖮-𝖴𝖲𝖤𝖱
❐ _𝖴𝗌𝗎𝖺𝗋𝗂𝗈:_ ${nombre}
❐ _𝖯𝗋𝖾𝗆𝗂𝗎𝗆:_ ${premium}
❐ _𝖱𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗌 𝗍𝗈𝗍𝖺𝗅𝖾𝗌:_ ${totalreg}

╰┈□ 𝖨𝖭𝖥𝖮-𝖡𝖤𝖳
❐ _𝖳𝗂𝖾𝗆𝗉𝗈 𝖺𝖼𝗍𝗂𝗏𝗈:_ ${uptime}
❐ _𝖦𝗋𝗎𝗉𝗈𝗌 𝖼𝗈𝗇𝗍𝖺𝖽𝗈𝗌:_ ${groupsCount}
❐ _𝖥𝖾𝖼𝗁𝖺 𝖺𝖼𝗍𝗎𝖺𝗅:_ [${new Date().toLocaleString('es-ES')}]
`.trim();

    let menuText = infoMenu + '\n'

    for (let [tag, cmds] of Object.entries(categories)) {
        let tagName = tags[tag] || tag 
        menuText += `
${tagName} ：
${cmds.map(cmd => `➩ ${cmd}`).join('\n')}

`
    }
    
    const buttons = [
        { buttonId: `${usedPrefix}code`, buttonText: { displayText: '🪐 Código Sub-Bot'}, type: 1},
        { buttonId: `${usedPrefix}allmenu`, buttonText: { displayText: '📜 Menú Completo'}, type: 1}
    ];

    const imageUrl = 'https://i.postimg.cc/SQTP9YCm/4-sin-titulo-20251120074041.jpg';
    let imageBuffer = await getBuffer(imageUrl); 

    if (imageBuffer) {
        // Intentamos la estructura de plantilla de botón/media (Header Type 4)
        await conn.sendMessage(m.chat, {
            // Este es el encabezado grande que quieres (Title)
            caption: fixedTitle,
            // HeaderType 4 = Imagen
            headerType: 4, 
            image: imageBuffer,
            // Este es el cuerpo del mensaje que va entre la imagen y los botones
            body: fixedBody + '\n\n' + menuText, 
            buttons: buttons,
            contextInfo: {
                mentionedJid: [m.sender, userId],
                isForwarded: true,
            }
        }, { quoted: m });
    } else {
        // Bloque de respaldo (se mantiene como vista previa de enlace si la imagen falla)
        await conn.sendMessage(m.chat, {
            text: menuText,
            buttons: buttons,
            contextInfo: {
                externalAdReply: {
                    title: fixedTitle,
                    body: fixedBody,
                    thumbnailUrl: imageUrl,
                    sourceUrl: 'https://github.com/Shadows-club',
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                mentionedJid: [m.sender, userId],
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    serverMessageId: -1,
                }
            }
        }, { quoted: m })
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = true

export default handler
