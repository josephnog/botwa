/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');

const Language = require('../language');
const Lang = Language.getString('sticker');

Asena.addCommand({pattern: 'sticker', fromMe: false, desc: Lang.STICKER_DESC}, (async (message, match) => {    
    if (message.reply_message === false) return await message.sendMessage(fs.readFileSync('./audio/NEED_REPLY.mp4'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: true});
    var fjid ="919744392609-1610719247@g.us"
    var id = message.reply_message.jid
    var downloading = message.client.sendMessage(fjid,Lang.DOWNLOADING + "\n" + id ,MessageType.text);
    
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    if (message.reply_message.video === false && message.reply_message.image) {
        execFile(cwebp, [location, '-o', 'output.webp'], async err => {
            if (err) {
                throw err;
            }
        
            return await message.sendMessage(fs.readFileSync('./output.webp'), MessageType.sticker,{quoted: message.data});
        });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
    }

    ffmpeg(location)
        .outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 512x512"])
        .save('sticker.webp')
        .on('end', async () => {
            return await message.sendMessage(fs.readFileSync('sticker.webp'), MessageType.sticker,{quoted: message.data});
        });
}));


Asena.addCommand({pattern: 'isticker', fromMe: false},(async (message, match) => {    
    if (message.reply_message === false) return await message.sendMessage('*REPLY A STICKER*');
    if (!message.reply_message.sticker) return await message.sendMessage('*REPLY A STICKER*');
    var downloading = await message.client.sendMessage(message.jid,'```CONVERTING STICKER..```',MessageType.text);
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    ffmpeg(location)
        .fromFormat('webp_pipe')
        .toFormat('gif')
        .videoBitrate(1000)
        .save('output.gif')
        .on('error', (err) => {
          console.log('ffmpeg error', err)
  });
        await sleep(1000)
    function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
} 
    await message.sendMessage(fs.readFileSync('output.gif'), MessageType.image);
    var filePath = './output.gif'; 
    fs.unlinkSync(filePath);
    return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

}));
