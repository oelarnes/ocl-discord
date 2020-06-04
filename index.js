const Discord = require('discord.js')
const ini = require('ini')
const { readFileSync } = require('fs')
const axios = require('axios').default;

const bot = new Discord.Client()
const { token } = ini.parse(readFileSync('./config.ini', 'utf-8'))

async function getStandings(season) {
    const {data} = await axios.post('http://onlinecubeleague.com/api/data', {query: 
    `{standings(season: "${season}"){player{discordHandle}qps,matchWins,matchLosses,allTimeRank}}`
    }).catch(console.log)

    return data.data.standings
}

bot.on("message", message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        getStandings("2020").then((data) => {
            const standingsEmbed = data.reduce((embed, row) => {
                return embed.addFields(
                    {name: 'Player', value: row.player.discordHandle},
                    {name: 'QPs', value: row.qps, inline: true},
                )
            }, new Discord.MessageEmbed())
            message.channel.send(standingsEmbed)
        })
        
    }
}); 

bot.login(token)
