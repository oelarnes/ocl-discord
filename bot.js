const Discord = require('discord.js')
const {
  getStandings,  getDraftlog
} = require('./get')

const bot = new Discord.Client()


function executeLogCommand(message, parsed) {
  const eventId = parsed.namedArgs.event || parsed.orderedArgs[0]
  const discordHandle = parsed.namedArgs.user || parsed.orderedArgs[1] || message.author.username
  
  getDraftlog(eventId, discordHandle).then((data) => {
      const content = `${data.matchWins || 0}-${data.matchLosses || 0} draftlog for ${discordHandle}, event ${data.eventId}:
${data.draftlogURL}`
      message.channel.send(content)
  })
}

const commandRe = /^!(.*)$/;
bot.on("message", message => {
  if (commandRe.test(message.content)) {
    const parsed = parseCommand(message.content)
    if (parsed.command === '!standings') {
      getStandings().then((data) => {
          console.log(data)
          message.channel.send(new Discord.MessageEmbed().setImage(data))
      })
    }
    if (parsed.command === '!log') {
      executeLogCommand(message, parsed)
    }
  }
});

module.exports = bot

function parseCommand(message) {
  const split = message.split(' ')
  const finalSplit = split.reduce((prevSplit, curr) => {
    if (prevSplit.length >= 1) {
      const lastElement = prevSplit.pop()
      if (lastElement[0] === '"') {
        const newElement = [lastElement, curr].join(' ')
        if (newElement[newElement.length - 1] === '"') {
          prevSplit.push(newElement.slice(1, -2))
        } else {
          prevSplit.push(newElement)
        }
      } else {
        prevSplit.push(lastElement)
        prevSplit.push(curr)
      }
    } else {
      prevSplit.push(curr)
    }
    return prevSplit
  }, [])
  const command = finalSplit[0]
  const args = finalSplit.slice(1)
  const namedArgs = args.filter(arg => arg.includes(':')).reduce((prev, curr) => {
    const split = curr.split(':', 2)
    prev[split[0]] = split[1]
    return prev
  }, {})
  const orderedArgs = args.filter(arg => !arg.includes(':'))
  return {
    command,
    namedArgs,
    orderedArgs
  }
}
