import https from 'https';
import { generateWAMessageFromContent, delay as baileysDelay } from '@whiskeysockets/baileys';
import axios from 'axios';

async function sendAlbumMessage(conn, jid, medias, quoted = null, caption = '') {
    if (typeof jid !== 'string') throw new TypeError('jid debe ser string');
    if (!Array.isArray(medias) || medias.length < 1) throw new RangeError('Se requieren al menos 1 imagen o video');

    const mappedMedias = medias.map(m => ({
        type: m.type,
        data: { url: m.url }
    }));
    
    const album = await generateWAMessageFromContent(
        jid,
        {
            albumMessage: {
                expectedImageCount: mappedMedias.filter(m => m.type === 'image').length,
                expectedVideoCount: mappedMedias.filter(m => m.type === 'video').length,
            }
        },
        { quoted }
    );

    await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

    for (let i = 0; i < mappedMedias.length; i++) {
        const { type, data } = mappedMedias[i];
        
        const messageContent = {
            [type]: data,
            ...(i === 0 ? { caption } : {})
        };

        const imgMsg = await conn.generateMessage(
            jid,
            messageContent,
            { upload: conn.waUploadToServer }
        );

        imgMsg.message.messageContextInfo = {
            messageAssociation: { associationType: 1, parentMessageKey: album.key }
        };

        await conn.relayMessage(imgMsg.key.remoteJid, imgMsg.message, { messageId: imgMsg.key.id });
        await baileysDelay(500);
    }

    return album;
}

async function sendCustomPedido(m, conn, texto, title = 'Pinterest Bot') {
    const defaultThumbUrl = 'https://telegra.ph/file/173981882d2f1f0a20463.jpg';
    
    try {
        const thumbRes = await axios.get(defaultThumbUrl, { responseType: 'arraybuffer' });
        const thumbBuffer = Buffer.from(thumbRes.data);

        const orderMessage = {
            orderId: 'FAKE-' + Date.now(),
            thumbnail: thumbBuffer,
            itemCount: 1,
            status: 1,
            surface: 1,
            message: texto,
            orderTitle: title,
            totalAmount1000: '0',
            totalCurrencyCode: 'USD',
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: '',
                    thumbnailUrl: defaultThumbUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        };

        const msg = generateWAMessageFromContent(m.chat, { orderMessage }, { quoted: m });
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (err) {
        console.error('Error en sendCustomPedido:', err);
        m.reply('⚠️ Error enviando la respuesta personalizada.', m);
    }
}

const getInitialAuth = () => new Promise((resolve, reject) => {
    const options = {
        hostname: 'id.pinterest.com',
        path: '/',
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    https.get(options, res => {
        const cookies = res.headers['set-cookie'];
        if (cookies) {
            const csrfCookie = cookies.find(c => c.startsWith('csrftoken='));
            const pinterestSessCookie = cookies.find(c => c.startsWith('_pinterest_sess='));

            if (csrfCookie && pinterestSessCookie) {
                const csrftoken = csrfCookie.split(';')[0].split('=')[1];
                const sess = pinterestSessCookie.split(';')[0];
                resolve({ csrftoken, cookieHeader: `csrftoken=${csrftoken}; ${sess}` });
                return;
            }
        }
        reject(new Error('No se pudo obtener el token CSRF o la cookie de sesión de Pinterest.'));
    }).on('error', e => reject(new Error(`Fallo en la solicitud inicial a Pinterest: ${e.message}`)));
});

const searchPinterestAPI = async (query, limit) => {
    try {
        const { csrftoken, cookieHeader } = await getInitialAuth();
        let results = [], bookmark = null, keepFetching = true;
        const maxPages = 5;

        for (let page = 0; page < maxPages && keepFetching && results.length < limit; page++) {
            const postData = { options: { query, scope: 'pins', bookmarks: bookmark ? [bookmark] : [] }, context: {} };
            const sourceUrl = `/search/pins/?q=${encodeURIComponent(query)}`;
            const dataString = `source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(JSON.stringify(postData))}`;

            const options = {
                hostname: 'id.pinterest.com',
                path: '/resource/BaseSearchResource/get/',
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/javascript, */*, q=0.01',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrftoken,
                    'X-Pinterest-Source-Url': sourceUrl,
                    Cookie: cookieHeader
                }
            };

            const responseBody = await new Promise((resolve, reject) => {
                const req = https.request(options, res => {
                    if (res.statusCode !== 200) {
                        return reject(new Error(`Pinterest API respondió con estado ${res.statusCode}`));
                    }
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => resolve(body));
                });
                req.on('error', e => reject(e));
                req.write(dataString);
                req.end();
            });

            const jsonResponse = JSON.parse(responseBody);
            const resource = jsonResponse.resource_response;

            if (resource?.data?.results) {
                const pins = resource.data.results;
                pins.forEach(pin => {
                    const imageUrl = pin.images?.['orig']?.url || pin.images?.['736x']?.url;
                    if (imageUrl) results.push(imageUrl);
                });
                
                bookmark = resource.bookmark;

                if (!bookmark || pins.length === 0 || results.length >= limit) {
                    keepFetching = false;
                }

            } else {
                keepFetching = false;
            }
        }
        return results.slice(0, limit);
    } catch (e) {
        console.error('Error en searchPinterestAPI:', e.message);
        throw new Error(`Fallo en la búsqueda de Pinterest: ${e.message}`);
    }
};

let handler = async (m, { conn, args, rcanal }) => {
    const chatId = m.chat; 

    try {
        const text = args.join(' ');
        
        if (!text) {
            return sendCustomPedido(m, conn, '*ⓘ* `Por favor, ingresa lo que deseas buscar en Pinterest. Ejemplo: !pin gatos,5`');
        }

        const parts = text.split(',');
        const query = parts[0].trim();
        const limit = parts[1] ? Math.min(parseInt(parts[1].trim()) || 1, 12) : 12;

        await conn.reply(chatId, `🔍 Buscando ${limit} resultados para "${query}" en Pinterest...`, m);

        const resUrls = await searchPinterestAPI(query, limit);

        if (!resUrls || !resUrls.length) {
            return sendCustomPedido(m, conn, `⚠️ No se encontraron resultados para "${query}". Intenta con otra palabra clave.`, 'Búsqueda Fallida');
        }

        const medias = resUrls.map(url => ({ type: 'image', url: url }));
        
        const caption = `✨ **Resultados de Pinterest** - _"${query}"_
        
*Total encontrados:* ${medias.length}
        `;
        
        await sendAlbumMessage(conn, chatId, medias, m, caption);

    } catch (e) {
        console.error('Error en el handler de Pinterest:', e);
        return sendCustomPedido(m, conn, `⚠️ Se produjo un error durante la búsqueda:\n\`${e.message}\``, 'Error en Pinterest');
    }
};

handler.help = ['pin <query>,[limit]', 'pinterest <query>,[limit]'];
handler.tags = ['buscador'];
handler.command = ['pin', 'pinterest'];
export default handler;
