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

let handler = async (m, { conn, usedPrefix}) => {
  let nombre = await conn.getName(m.sender);

  let tags = {
    info: '𓂂𓏸  𐅹੭੭   *`𝖨𝗇ẜᨣ`* 🪐 ᦡᦡ',
    anime: '𓂂𓏸  𐅹੭੭   *`𝖠𝗇ı𝗆ᧉ`* 🥞 ᦡᦡ',
    buscador: '𓂂𓏸  𐅹੭੭   *`Ｓᧉ𝖺ꭇ𝖼𝗁`* 🌿 ᦡᦡ',
    downloader: '𓂂𓏸  𐅹੭੭   *`𝖣ᨣ𝗐𝗇𝗅ᨣ𝖺𝖽ᧉꭇ𝗌`* 🍇 ᦡᦡ',
    economy: '𓂂𓏸  𐅹੭੭   *`𝖾𝖼𝗈𝗆𝗈𝗆𝗂𝖺`* 🌵 ᦡᦡ',
    fun: '𓂂𓏸  𐅹੭੭   *`𝖥𝗎𝗇`* 🌱 ᦡᦡ',
    group: '𓂂𓏸  𐅹੭੭   *`Gꭇußꭇ𝗎𝗉ᨣ𝗌`* ☕ ᦡ',
    ai: '𓂂𓏸  𐅹੭੭   *`𝖨𝗇ƚᧉ𝖨ı𝗀ᧉ𝗇𝖼ı𝖺𝗌`* 🧋 ᦡᦡ',
    game: '𓂂𓏸  𐅹੭੭   *`Game`* 🥞 ᦡᦡ',
    serbot: '𓂂𓏸  𐅹੭੭   *`𝖩𝖺𝖽ı-ᗷᨣƚ𝗌`* 🍂 ᦡᦡ',
    main: '𓂂𓏸  𐅹੭੭   *`𝖯ꭇ𝗂𝗇𝖼𝗂𝗉𝖺𝗅`* ☁️ ᦡᦡ',
    nable: '𓂂𓏸  𐅹੭੭   *`𝖮𝗇-𝖮ẜẜ`* 🍭 ᦡᦡ',
    nsfw: '𓂂𓏸  𐅹੭੭   *`𝖭𝗌ẜɯ`* 🪼 ᦡᦡ',
    owner: '𓂂𓏸  𐅹੭੭   *`Oɯ𝗇ᧉꭇ`* 🧇 ᦡᦡ',
    sticker: '𓂂𓏸  𐅹੭੭   *`𝖲ƚ𝗂𝖼𝗄ᧉꭇ`* ☘ ᦡᦡ',
    herramientas: '𓂂𓏸  𐅹੭੭   *`𝖨𝗇ƚᧉꭇ𝗇ᧉƚ`* 🌻 ᦡᦡ'
};

  let header = '> ໒( %category)७';
  let body = '> ➩ *_%cmd_*';
  let footer = '';
  let after = ``;

  let user = global.db.data.users[m.sender];
  let premium = user.premium? 'sɪ́': 'ɴᴏ';
  let limit = user.limit || 0;
  let totalreg = Object.keys(global.db.data.users).length;
  let groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length;
  let uptime = clockString(process.uptime());

  const userId = conn.user.jid;

  function clockString(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

  const menuTitle = `⊱┊ Shadow Bot - Menú Principal ❦`;
  const menuBody = `Hola *${nombre}*, selecciona una opción. El bot está activo por ${uptime}.`;

  let infoUser = `
${menuTitle}
${menuBody}

╰┈□ 𝖨𝖭𝖥𝖮-𝖴𝖲𝖤𝖱
❐ _𝖴𝗌𝗎𝖺𝗋𝗂𝗈:_ ${nombre}
❐ _𝖯𝗋𝖾𝗆𝗂𝗎𝗆:_ ${premium}
❐ _𝖱𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗌 𝗍𝗈𝗍𝖺𝗅𝖾𝗌:_ ${totalreg}

╰┈□ 𝖨𝖭𝖥𝖮-𝖡𝖤𝖳
❐ _𝖳𝗂𝖾𝗆𝗉𝗈 𝖺𝖼𝗍𝗂𝗏𝗈:_ ${uptime}
❐ _𝖦𝗋𝗎𝗉𝗈𝗌 𝖼𝗈𝗇𝗍𝖺𝖽𝗈𝗌:_ ${groupsCount}
❐ _𝖥𝖾𝖼𝗁𝖺 𝖺𝖼𝗍𝗎𝖺𝗅:_ [${new Date().toLocaleString('es-ES')}]
`.trim();

  let commands = Object.values(global.plugins).filter(v => v.help && v.tags && v.command).map(v => ({
    help: Array.isArray(v.help)? v.help: [v.help],
    tags: Array.isArray(v.tags)? v.tags: [v.tags],
    command: Array.isArray(v.command)? v.command: [v.command]
}));

  let menu = [];
  for (let tag in tags) {
    let comandos = commands
.filter(command => command.tags.includes(tag))
.map(command => command.command.map(cmd => body.replace(/%cmd/g, usedPrefix + cmd)).join('\n'))
.join('\n');
    if (comandos) {
      menu.push(header.replace(/%category/g, tags[tag]) + '\n' + comandos + '\n' + footer);
}
}

  let menuText = infoUser + '\n\n' + menu.join('\n\n') + '\n' + after;

  await m.react('🌱');
  
  const imageUrl = 'https://files.catbox.moe/0dvlsr.jpg';
  let imageBuffer = await getBuffer(imageUrl); 
  
  const buttons = [
      { buttonId: `${usedPrefix}code`, buttonText: { displayText: '🪐 sᴇʀ sᴜʙ-ʙᴏᴛ'}, type: 1},
      { buttonId: `${usedPrefix}ping`, buttonText: { displayText: '⚡ ᴠᴇʟᴏᴄɪᴅᴀᴅ ᴅᴇʟ ʙᴏᴛ'}, type: 1}
  ];

  if (imageBuffer) {
      await conn.sendMessage(m.chat, {
          image: imageBuffer, 
          caption: menuText,
          contextInfo: {
              mentionedJid: [m.sender, userId],
              isForwarded: true,
          },
          buttons: buttons 
      }, { quoted: m});
  } else {
      const externalAdReply = {
          title: menuTitle,
          body: menuBody,
          thumbnailUrl: imageUrl,
          sourceUrl: 'https://github.com/Shadows-club',
          mediaType: 2, 
          renderLargerThumbnail: true
      };
      
      await conn.sendMessage(m.chat, {
          text: menuText,
          contextInfo: {
              externalAdReply: externalAdReply,
              mentionedJid: [m.sender, userId],
              isForwarded: true,
          },
          buttons: buttons
      }, { quoted: m});
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menú'];
handler.register = true;

export default handler;
