import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = "" //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = ["5491124918653"]
global.suittag = [] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = "Baileys"
global.vs = "Latest"
global.sessions = "Shadow/Principal"
global.jadi = "Shadow/Subbots"
global.ShadowJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botname = "𝑺𝒉𝒂𝒅𝒐𝒘`𝑺 - 𝑩𝒐𝒕"
global.textbot = "© Տհαժօա - Ⴆօէ • 𝘍𝘦𝘥𝘦 𝘜𝘤𝘩𝘪𝘩𝘢"
global.dev = "𝐅𝐞𝐝𝐞 𝐔𝐜𝐡𝐢𝐡𝐚"
global.author = "𝘍𝘦𝘥𝘦 𝘜𝘤𝘩𝘪𝘩𝘢"
global.etiqueta = "𝘍𝘦𝘥𝘦 𝘜𝘤𝘩𝘪𝘩𝘢"
global.currency = "Yenes"
global.banner = "https://files.catbox.moe/x8xyh8.jpeg"
global.icono = "https://files.catbox.moe/s4aorc.jpg"
global.catalogo = fs.readFileSync('./lib/catalogo.png')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.group = "https://chat.whatsapp.com/JNQMGcG9jl00jYBM1iV8Jn"
global.community = "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY"
global.channel = "https://whatsapp.com/channel/0029VbBBNfH4Y9ltpS4C8w3c"
global.github = "https://github.com/SoySapo6/MayBot"
global.gmail = "soymaycol.cn@gmail.com"
global.ch = {
ch1: "120363406779062566@newsletter"
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.APIs = {
xyro: { url: "https://api.xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null },
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null },
adonix: { url: "https://api-adonix.ultraplus.click", key: 'Destroy-xyz' },
mayapi: { url: "https://mayapi.ooguy.com", key: 'soymaycol' }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'config.js'"))
import(`${file}?update=${Date.now()}`)
})
