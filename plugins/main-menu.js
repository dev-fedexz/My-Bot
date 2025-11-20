import fs from 'fs';

global.db.data.settings = global.db.data.settings || {};
global.db.data.settings.menuBanner = global.db.data.settings.menuBanner || 'https://files.catbox.moe/0dvlsr.jpg';
global.db.data.settings.menuTitle = global.db.data.settings.menuTitle || 'Shadow bot';
global.db.data.settings.menuBody = global.db.data.settings.menuBody || '⊱┊ MαყBσƚ ᵇʸ ˢᵒʸᵐᵃყᶜᵒˡ ❦';

function clockString(seconds) {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor(seconds % 3600 / 60);
  let s = Math.floor(seconds % 60);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

let handler = async (m, { conn, usedPrefix, command, text, isOwner }) => {

  const isSubBotController = !!global.db.data.users[m.sender]?.jadibot;
  
  let target = global.db.data.settings;
  let senderType = 'el Bot Principal'; 
  
  if (!isOwner && isSubBotController) {
    target = global.db.data.users[m.sender];
    senderType = 'tu Sub-Bot';
    
    target.menuBanner = target.menuBanner || global.db.data.settings.menuBanner;
    target.menuTitle = target.menuTitle || global.db.data.settings.menuTitle;
    target.menuBody = target.menuBody || global.db.data.settings.menuBody;
  }
  
  switch (command.toLowerCase()) {
    
    case 'setbanner': {
      if (!isOwner && !isSubBotController) {
          throw `❌ Este comando solo puede ser usado por el *Owner* del Bot Principal o por un usuario con un *Sub-Bot* activo.`;
      }
      
      if (!text) throw `*❗️ ERROR*\nUsa: ${usedPrefix}setbanner <url.jpg>`;
      
      if (!text.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/i)) {
          throw '*❗️ ERROR*\nLa URL debe terminar en .jpg, .jpeg o .png.';
      }

      target.menuBanner = text;
      await conn.reply(m.chat, `✅ *BANNER ACTUALIZADO*\nEl banner de *${senderType}* ha sido actualizado a:\n${text}`, m);
      return;
    }

    case 'setname': {
      if (!isOwner && !isSubBotController) {
          throw `❌ Este comando solo puede ser usado por el *Owner* del Bot Principal o por un usuario con un *Sub-Bot* activo.`;
      }
      
      if (!text) throw `*❗️ ERROR*\nUsa: ${usedPrefix}setname <Nuevo Título> | <Nuevo Cuerpo>`;
      
      const parts = text.split('|').map(p => p.trim());
      
      if (parts.length < 2) {
          throw `*❗️ ERROR*\nDebes proporcionar el Título y el Cuerpo separados por '|'.\nEjemplo: ${usedPrefix}setname Mi Bot | Creado por Maycol`;
      }

      const newTitle = parts[0];
      const newBody = parts[1];

      target.menuTitle = newTitle;
      target.menuBody = newBody;

      await conn.reply(m.chat, `✅ *NOMBRE Y CUERPO ACTUALIZADOS*\nDe *${senderType}*:\n\n*Título (Title):* ${newTitle}\n*Cuerpo (Body):* ${newBody}`, m);
      return;
    }

    case 'menu':
    case 'help':
    case 'menú':
    default: {
      let nombre = await conn.getName(m.sender);
      
      let currentBanner = global.db.data.settings.menuBanner;
      let currentTitle = global.db.data.settings.menuTitle;
      let currentBody = global.db.data.settings.menuBody;
      
      if (isSubBotController) {
        currentBanner = target.menuBanner;
        currentTitle = target.menuTitle;
        currentBody = target.menuBody;
      }

      let tags = {
        info: '𓂂𓏸  𐅹੭੭   *`𝖨𝗇ẜᨣ`* 🪐 ᦡᦡ',
        anime: '𓂂𓏸  𐅹੭੭   *`𝖠𝗇ı𝗆ᧉ`* 🥞 ᦡᦡ',
        buscador: '𓂂𓏸  𐅹੭੭   *`Ｓᧉ𝖺ꭇ𝖼𝗁`* 🌿 ᦡᦡ',
        downloader: '𓂂𓏸  𐅹੭੭   *`𝖣ᨣ𝗐𝗇𝗅ᨣ𝖺𝖽ᧉꭇ𝗌`* 🍇 ᦡᦡ"',
        economy: '𓂂𓏸  𐅹੭੭   *`𝖾𝖼𝗈𝗆𝗈𝗆𝗂𝖺`* 🌵 ᦡᦡ',
        fun: '𓂂𓏸  𐅹੭੭   *`𝖥𝗎𝗇`* 🌱 ᦡᦡ',
        group: '𓂂𓏸  𐅹੭੭   *`Gꭇ𝗎𝗉ᨣ𝗌`* ☕ ᦡ',
        ai: '𓂂𓏸  𐅹੭੭   *`𝖨𝗇ƚᧉ𝖨ı𝗀ᧉ𝗇𝖼ı𝖺𝗌`* 🧋 ᦡᦡ",',
        game: '𓂂𓏸  𐅹੭੭   *`Game`* 🥞 ᦡᦡ',
        serbot: '𓂂𓏸  𐅹੭੭   *`𝖩𝖺𝖽ı-ᗷᨣƚ𝗌`* 🍂 ᦡᦡ',
        main: '𓂂𓏸  𐅹੭੭   *`𝖯ꭇ𝗂𝗇𝖼𝗂𝗉𝖺𝗅`* ☁️ ᦡᦡ',
        nable: '𓂂𓏸  𐅹੭੭   *`𝖮𝗇-𝖮ẜẜ`* 🍭 ᦡᦡ',
        nsfw: '𓂂𓏸  𐅹੭੭   *`𝖭𝗌ẜɯ`* 🪼 ᦡᦡ',
        owner: '𓂂𓏸  𐅹੭੭   *`Oɯ𝗇ᧉꭇ`* 🧇 ᦡᦡ',
        sticker: '𓂂𓏸  𐅹੭੭   *`𝖲ƚ𝗂𝖼𝗄ᧉꭇ`* ☘ ᦡᦡ',
        herramientas: '𓂂𓏸  𐅹੭੭   *`𝖨𝗇ƚᧉꭇ𝗇ᧉƚ`* 🌻 ᦡᦡ'
      };
        
      let header = '> ໒( %category )७';
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

      let infoUser = `
❐ 𝖧𝗈𝗅𝖺, 𝖲𝗈𝗒 *_${currentTitle}_* 🌱

╰┈□ 𝖨𝖭𝖥𝖮-𝖴𝖲𝖤𝖱
❐ _𝖴𝗌𝗎𝖺𝗋𝗂𝗈:_ ${nombre}
❐ _𝖯𝗋𝖾𝗆𝗂𝗎𝗆:_ ${premium}
❐ _𝖱𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗌 𝗍𝗈𝗍𝖺𝗅𝖾𝗌:_ ${totalreg}

╰┈□ 𝖨𝖭𝖥𝖮-𝖡𝖮𝖳
❐ _𝖳𝗂𝖾𝗆𝗉𝗈 𝖺𝖼𝗍𝗂𝗏𝗈:_ ${uptime}
❐ _𝖦𝗋𝗎𝗉𝗈𝗌 𝖺𝖼𝗍𝗂𝗏𝗈𝗌:_ ${groupsCount}
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

      await conn.sendMessage(m.chat, {
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: currentTitle, 
                    body: currentBody,
                    thumbnailUrl: currentBanner,
                    sourceUrl: 'https://mayapi.ooguy.com',
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                mentionedJid: [m.sender, userId],
                isForwarded: true,
            },
            buttons: [
              { buttonId: `${usedPrefix}code`, buttonText: { displayText: '🪐 sᴇʀ sᴜʙ-ʙᴏᴛ'}, type: 1},
              { buttonId: `${usedPrefix}ping`, buttonText: { displayText: '⚡ ᴠᴇʟᴏᴄɪᴅᴀᴅ ᴅᴇʟ ʙᴏᴛ'}, type: 1}
            ]
        }, { quoted: m });
    }
  }
};

handler.help = ['menu', 'setbanner', 'setname']; 
handler.tags = ['main', 'owner']; 
handler.command = ['menu', 'help', 'menú', 'setbanner', 'setname'];
handler.register = true;

export default handler;
