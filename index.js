import { Client } from 'discord.js'
import ini from 'ini'
import { readFileSync } from 'fs'
import axios from 'axios'

const bot = new Client()
const { token } = ini.parse(readFileSync('./config.ini', 'utf-8'))

bot.on("message", message => {
    // If the message is "ping"
    if (message.content === '!standings') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
});

bot.login(token)
