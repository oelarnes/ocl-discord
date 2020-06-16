const ini = require('ini')
const { readFileSync } = require('fs')
const { discord } = ini.parse(readFileSync('./discord.ini', 'utf-8'))
const bot = require('./bot')

bot.login(discord.token)
