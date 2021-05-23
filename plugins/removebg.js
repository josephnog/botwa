/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../events');
const {MessageType, Mimetype} = require('@adiwajshing/baileys');
const Config = require('../config');
const fs = require('fs');
const got = require('got');
const FormData = require('form-data');
const stream = require('stream');
const {promisify} = require('util');

const pipeline = promisify(stream.pipeline);

const Language = require('../language');
const Lang = Language.getString('removebg');

Asena.addCommand({pattern: 'removebg ?(.*)', fromMe: false, desc: Lang.REMOVEBG_DESC}, (async (message, match) => {    
    if (message.reply_message === false || message.reply_message.image === false) return await message.sendMessage(Lang.NEED_PHOTO);
    if (!message.reply_message.image) return await message.sendMessage(Lang.NEED_PHOTO);
    //if (Config.RBG_API_KEY === false) return await message.sendMessage(Lang.NO_API_KEY);

    var r_text = new Array ();

        r_text[0] = "6EA2u7rRsYN17omiZyPWALgB";
        r_text[1] = "oXuksHp8zu544jovWDGsGtjW";
        r_text[2] = "UQ7YV8jWf5V4c2RHfiU5gsr8";
        r_text[3] = "NZyscVWb6gL5zRDjrJz8bKzx";
        r_text[4] = "YxnncMubWGoL5CVJMuNsTpRQ";
        r_text[5] = "anh4WHEDUpkfb7LhaqRkJ6Y3";
        r_text[6] = "oXuksHp8zu544jovWDGsGtjW";
        r_text[7] = "sjsdd4jo7hNJrNqRZrQZEH9N";
        r_text[8] = "xk9WfUTdHQTBC6zVCrSXyJ77";
        r_text[9] = "irMuRdXid3fJvssTncRjsYQJ";
        r_text[10] = "cxFDy26Qgtvmns3R8VQA4J3j";
        r_text[11] = "h2t9uC821DtAKWsFN1WJ18r4";
        r_text[12] = "DeFVbqqiWjUrUKxx7fFeREji";
        r_text[13] = "GAwPw6oYob3uEwUuv94xx3ff";
        r_text[14] = "stWEb7xcDB8JsCfhv57QYmJJ";
        r_text[15] = "jAXhkqnWeSo5LBYTFYirUQQA";
        r_text[16] = "xxwmZStF7WdFu5dEq6EqC6GW";
        r_text[17] = "MuRJrpd3BZYKzBqhsC4uqq5w";

        var i = Math.floor(17*Math.random())

        console.log(r_text[i])
    
    var load = await message.reply(Lang.RBGING);
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    var form = new FormData();
    form.append('image_file', fs.createReadStream(location));
    form.append('size', 'auto');

    var rbg = await got.stream.post('https://api.remove.bg/v1.0/removebg', {
        body: form,
        headers: {
            'X-Api-Key': r_text[i]
        }
    }); 
    
    await pipeline(
		rbg,
		fs.createWriteStream('rbg.png')
    );
    
    await message.sendMessage(fs.readFileSync('rbg.png'), MessageType.document, {filename: 'removebg.png', mimetype: Mimetype.png});
    await load.delete();
}));
