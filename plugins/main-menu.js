import fs from 'fs';
import fetch from 'node-fetch';

const getBuffer = async (url) => {
    try {
        const res = await fetch(url);
        if (res.status!== 200) {
            console.error(`Error al descargar la imagen: Código de estado ${res.status}`);
            return null;
}
        return await res.buffer();
} catch (e) {
        console.error("Error en getBuffer:", e);
        return null;
}
};

let tags = {
    info: '╭─「 𝖨𝗇ẜᨣ 」─╮',
    anime: '╭─「 𝖠𝗇ı𝗆ᧉ 」─╮',
    buscador: '╭─「 Ｓᧉ𝖺ꭇ𝖼𝗁 」─╮',
    downloader: '╭─「 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗌 」─╮',
    economy: '╭─「 𝖤𝖼𝗈𝗇𝗈𝗆𝗂𝖺 」─╮',
    fun: '╭─「 𝖥𝗎𝗇 」─╮',
    group: '╭─「 𝖦𝗋𝗎𝗉𝗈𝗌 」─╮',
    ai: '╭─「 𝖨𝗇ƚ𝖾𝗅𝗂𝗀𝖾𝗇𝖼𝗂𝖺 」─╮',
    game: '╭─「 𝖦𝖺𝗆𝖾𝗌 」─╮',
    serbot: '╭─「 𝖩𝖺𝖽ı-ᗷ𝗈𝗍𝗌 」─╮',
    main: '╭─「 𝖯𝗋𝗂𝗇𝖼𝗂𝗉𝖺𝗅 」─╮',
    nable: '╭─「 𝖮𝗇-𝖮𝖿𝖿 」─╮',
    nsfw: '╭─「 𝖭𝗌𝖿𝗐 」─╮',
    owner: '╭─「 𝖮𝗐𝗇𝖾𝗋 」─╮',
    sticker: '╭─「 𝖲𝗍𝗂𝖼𝗄𝖾𝗋𝗌 」─╮',
    herramientas: '╭─「 𝖧𝖾𝗋𝗋𝖺𝗆𝗂𝖾𝗇𝗍𝖺𝗌 」─╮'
};

function clockString(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

let handler = async (m, { conn, args}) => {
    let userId = m.mentionedJid?.[0] || m.sender;
    let categories = {};

    let nombre = await conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    let premium = user?.premium? 'sɪ́': 'ɴᴏ';
    let totalreg = Object.keys(global.db.data.users).length;
    let groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length;
    let uptime = clockString(process.uptime());

    for (let plugin of Object.values(global.plugins)) {
        if (!plugin.help ||!plugin.tags) continue;
        for (let tag of plugin.tags) {
            if (!categories[tag]) categories[tag] = [];
            categories[tag].push(...plugin.help.map(cmd => `${cmd}`));
}
}

    let infoUser = `
❐ 𝖧𝗈𝗅𝖺, 𝖲𝗈𝗒 *_𝖲𝗁𝖺𝖽𝗈𝗐 - 𝖡𝗈𝗍_* 🌱

╰┈□ 𝖨𝖭𝖥𝖮-𝖴𝖲𝖤𝖱
❐ _𝖴𝗌𝗎𝖺𝗋𝗂𝗈:_ ${nombre}
❐ _𝖯𝗋𝖾𝗆𝗂𝗎𝗆:_ ${premium}
❐ _𝖱𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗌:_ ${totalreg}

╰┈□ 𝖨𝖭𝖥𝖮-𝖡𝖮𝖳
❐ _𝖳𝗂𝖾𝗆𝗉𝗈 𝖺𝖼𝗍𝗂𝗏𝗈:_ ${uptime}
❐ _𝖦𝗋𝗎𝗉𝗈𝗌 𝖺𝖼𝗍𝗂𝗏𝗈𝗌:_ ${groupsCount}
❐ _𝖥𝖾𝖼𝗁𝖺:_ ${new Date().toLocaleString('es-ES')}
`.trim();

    let menuText = infoUser + '\n\n';

    for (let [tag, cmds] of Object.entries(categories)) {
        let tagName = tags[tag] || `╭─「 ${tag.toUpperCase()} 」─╮`;
        menuText += `${tagName}\n${cmds.map(cmd => `➩ ${cmd}`).join('\n')}\n\n`;
}

    await conn.sendMessage(m.chat, {
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: global.canalNombreM[0],
                body: '𝖲𝗁𝖺𝖽𝗈𝗐 - 𝖡𝗈𝗍',
                thumbnailUrl: 'https://files.catbox.moe/4fel4e.png',
                sourceUrl: 'https://github.com/Shadows-club',
                mediaType: 1,
                renderLargerThumbnail: true
},
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.canalIdM[0],
                newsletterName: '𝖲𝗁𝖺𝖽𝗈𝗐 - 𝖡𝗈𝗍',
                serverMessageId: -1
}
}
}, { quoted: m});
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help', 'ayuda'];
handler.register = true;

export default handler;
