// main-allmenu.js

import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js' 
import moment from 'moment-timezone'

const defaultMenu = {
    before: `
👋 ¡Hola, **%name**! Soy **%botName**, tu asistente.

---
📅 **Fecha:** %date
⏰ **Hora:** %time
⬆️ **Activo:** %uptime
---

👤 **User info:**
| Nombre : %name
| Tag : @%numericId
| Rol : %role
| Nivel : %level (%exp / %maxexp)
| Límite : %limit
| Money : S/.%money
| Premium : %premium
---

**Comandos Disponibles:**
*(Usa el prefijo **%prefix** antes de cada comando)*
`,
    header: '--- ❰ %category ❱ ---',
    body: '• %prefix%command %isLimit %isPremium',
    footer: '\n',
    after: `
`,
}

let handler = async (m, { conn, usedPrefix: prefix, command }) => {
    try {
        let _package = JSON.parse(await promises.readFile(join(process.cwd(), './package.json')).catch(_ => ({}))) || {}
        let { exp, limit, level, role, registered, money, premium } = global.db.data.users[m.sender]
        let { min, max } = xpRange(level, global.multiplier)

        if (['code', 'codes'].includes(command)) {
            let codeInfo = `
*--- 🗝️ INFO DEL CÓDIGO ---*
*Si el creador ha especificado un código de uso, puedes verlo aquí:*
\`\`\`
I LOVE BRAYANX330
\`\`\`
`
            return conn.reply(m.chat, codeInfo, m)
        } else if (!['menu', 'help', 'allmenu', 'menulist'].includes(command)) {
            return
        }
        
        let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)
        let numericId = m.sender.split('@')[0]
        
        let d = new Date(new Date + 3600000)
        let locale = 'es' 
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
        let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

        let premiumUser = global.db.data.users[m.sender].premiumTime > 0
        let _muptime = process.uptime() * 1000
        let muptime = clockString(_muptime)

        let tags = {}
        for (let plugin of Object.values(global.plugins)) {
            if (plugin.tags && !plugin.disabled) {
                for (let tag of plugin.tags) {
                    tags[tag] = tags[tag] || capitalize(tag)
                }
            }
        }
        
        let menu = _package.menu || defaultMenu
        let str = menu.before

            .replace(/%numericId/g, numericId)
            .replace(/%botName/g, conn.user.name.toUpperCase())
            .replace(/%name/g, name)
            .replace(/%date/g, date)
            .replace(/%time/g, time)
            .replace(/%uptime/g, muptime)
            .replace(/%exp/g, exp)
            .replace(/%maxexp/g, max)
            .replace(/%level/g, level)
            .replace(/%role/g, role)
            .replace(/%limit/g, limit)
            .replace(/%money/g, money) 
            .replace(/%premium/g, premiumUser ? '✅' : '❌')
            .replace(/%prefix/g, prefix)

        for (let tag in tags) {
            str += menu.header.replace(/%category/g, tags[tag])
            for (let plugin of Object.values(global.plugins)) {
                if (plugin && plugin.tags && plugin.tags.includes(tag))
                    if (plugin.help) {
                        let isL = plugin.limit ? 'Ⓛ' : '' 
                        let isP = plugin.premium ? 'Ⓟ' : '' 
                        
                        str += menu.body
                            .replace(/%prefix/g, prefix)
                            .replace(/%command/g, plugin.help.join(' '))
                            .replace(/%isLimit/g, isL)
                            .replace(/%isPremium/g, isP)
                    }
            }
            str += menu.footer
        }
        
        let urlImage = 'https://files.catbox.moe/4fel4e.png' 

        await conn.sendFile(m.chat, urlImage, 'menu.png', str, m)
        
    } catch (e) {
        conn.reply(m.chat, '❌ Ocurrió un error al cargar el menú. ' + e.message, m)
        throw e
    }
}

handler.help = ['list']
handler.tags = ['main']
handler.command = ['list']

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
                                        }
