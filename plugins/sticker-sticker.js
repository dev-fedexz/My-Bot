import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'
import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import { sendCustomPedido } from '../lib/sendCustomPedido.js' 

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''

  try {
    if (/webp|image|video/g.test(mime)) {
      
      if (/video/g.test(mime) && (q.msg || q).seconds > 15) {
        return conn.reply(m.chat, '🚫 El video no puede durar más de *15 segundos* para sticker.', m)
      }

      let data = await q.download?.()
      if (!data) return conn.reply(m.chat, '📌 Error al obtener los datos del archivo.', m)

      let reducedNoteSent = false

      if (/image/.test(mime) || (/webp/.test(mime) && !/video/.test(mime))) {
        try {
          const { buffer: reducedBuffer, reduced } = await tryAutoReduce(data)
          if (reduced) {
            data = reducedBuffer
            reducedNoteSent = true
            try { await conn.reply(m.chat, '🔄 Tu imagen era muy grande/alta — se redujo automáticamente antes de crear el sticker.', m) } catch (e) {}
          }
        } catch (err) {
          console.warn('No se pudo reducir la imagen:', err)
        }
      }

      let out
      try {
        let userId = m.sender
        let packstickers = global.db?.data?.users?.[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker
        let texto2 = packstickers.text2 || global.packsticker2

        stiker = await sticker(data, false, texto1, texto2)
      } finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(data)
          else if (/image/g.test(mime)) out = await uploadImage(data)
          else if (/video/g.test(mime)) out = await uploadFile(data)
          if (typeof out !== 'string') out = await uploadImage(data)
          stiker = await sticker(false, out, global.packsticker, global.packsticker2)
        }
      }
      
    } else if (args[0] && isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packsticker, global.packsticker2)

    } else {
        return sendCustomPedido(m, conn, `*☃️ Por favor, responde a una imagen, video (máx 15s) o GIF para crear un sticker.*`, 'Crear Sticker')
    }
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Ocurrió un error creando el sticker.', m)
  } finally {
    if (stiker) {
      try {
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
      } catch (e) {
        try { await conn.sendMessage(m.chat, { sticker: fs.readFileSync(stiker) }, { quoted: m }) } catch (err) {}
      }
    }
  }
}

handler.help = ['stiker <img>', 'sticker <url>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

function tryAutoReduce(buffer) {
  const img = Jimp.read(buffer)
  const width = img.bitmap.width
  const height = img.bitmap.height

  const MAX_DIM = 1000
  const TALL_RATIO = 1.8
  const MUST_REDUCE = (height > MAX_DIM || width > MAX_DIM || height > width * TALL_RATIO || width > height * TALL_RATIO)

  if (!MUST_REDUCE) {
    return { buffer, reduced: false }
  }

  const scale = Math.min(MAX_DIM / width, MAX_DIM / height, 1)
  const newW = Math.max(1, Math.round(width * scale))
  const newH = Math.max(1, Math.round(height * scale))

  img.resize(newW, newH)
  const outBuffer = img.quality(80).getBufferAsync(Jimp.MIME_JPEG)

  console.log(`autoReduce: ${width}x${height} -> ${newW}x${newH}`)

  return { buffer: outBuffer, reduced: true }
}

function isUrl(text) {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|webp)/, 'gi'))
}
