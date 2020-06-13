const Discord = require('discord.js')
const ini = require('ini')
const { readFileSync } = require('fs')
const axios = require('axios').default;

const bot = new Discord.Client()
const { discord, port } = ini.parse(readFileSync('./config.ini', 'utf-8'))

async function getStandings() {
    const {data} = await axios.post(`http://localhost:${port}/api/data`, {query: 
    `{events{standingsJpgURL}}`
    }).catch(console.log)

    return data.data.events.filter(r => r.standingsJpgURL)[0].standingsJpgURL
}

bot.on("message", message => {
    // If the message is "ping"
    if (message.content === '!standings') {
        // Send "pong" to the same channel
        getStandings().then((data) => {
            console.log(data)
            message.channel.send(new Discord.MessageEmbed().setImage(data))
        })
    }
}); 

bot.login(discord.token)
