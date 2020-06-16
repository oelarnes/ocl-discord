const axios = require('axios').default;
const { readFileSync } = require('fs')
const ini = require('ini')

const { port } = ini.parse(readFileSync('./config.ini', 'utf-8'))
const OCL_API = `http://onlinecubeleague.com/api/data`

async function getStandings() {
    const {data} = await axios.post(OCL_API, {
        query:`{
            events{
                standingsJpgURL
            }
        }`
    }).catch(console.log)

    return data.data.events.filter(r => r.standingsJpgURL)[0].standingsJpgURL
}

async function getDraftlog(eventId, discordHandle) {
  if (eventId === undefined) {
    const {data} = await axios.post(OCL_API, {
      query: `{
          playerSearch(byHandle: "${discordHandle}"){
              eventEntries(howMany:1){
                  eventId
                  draftlogURL
                  matchWins
                  matchLosses
              }
          }
      }`
    }).catch(console.log)
    return data.data.playerSearch[0].eventEntries[0]
  } else {
    if (eventId[0] === '#') {
      eventId = eventId.slice(1)
    }
    const playerResult = await axios.post(OCL_API, {
      query: `{
        playerSearch(byHandle: "${discordHandle}"){
          id
        }
      }`
    })

    const {data} = await axios.post(OCL_API, {
      query: `{
        entry(playerId: "${playerResult.data.data.playerSearch[0].id}", eventId: "${eventId}"){
          eventId
          draftlogURL
          matchWins
          matchLosses
        }
      }`
    }).catch(console.log)
    return data.data.entry
  }
}

module.exports = {
  getStandings,
  getDraftlog
}