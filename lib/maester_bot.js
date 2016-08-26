var RtmClient         = require('@slack/client').RtmClient
var MemoryDataStore   = require('@slack/client').MemoryDataStore
var RTM_EVENTS        = require('@slack/client').RTM_EVENTS
var CLIENT_EVENTS     = require('@slack/client').CLIENT_EVENTS
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM

var token = process.env.SLACK_API_TOKEN || require('../secrets/token')

var rtm = new RtmClient(token, {
  logLevel: 'warn',
  dataStore: new MemoryDataStore()
})

rtm.start()

// BOT AUTHS
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
  console.log(rtmStartData)
})

// BOT CONNECTS
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
  rtm.sendMessage("WHASSUP BITCHES!", 'C250J6ZHC', function messageSent() {
    // optionally, you can supply a callback to execute once the message has been sent
  })
})

// BOT DISCONNECTS - Not working yet
rtm.on(RTM_CLIENT_EVENTS.DISCONNECT, function () {
  rtm.sendMessage("WHASSUP BITCHES!", 'C250J6ZHC', function messageSent() {
    // optionally, you can supply a callback to execute once the message has been sent
  })
})

// GENERIC MESSAGE RESPONSE
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  data = rtm.dataStore
  console.log(data)
  if (message.text.includes('maester_aemon') || message.text.includes(data.users.U251QV8MP.id)) {  //TEMP
    rtm.sendMessage('Ah, yes, yes... I believe ' + rtm.dataStore.getUserById(message.user).name + ' needs to go fuck themselves.', message.channel, function messageSent() {
    })
  }
  console.log('------------------------------------------------')
  console.log('Message:', message)
})

// DM RESPONSE - Not even sure if this'll be usefull, but whatever
rtm.on(RTM_EVENTS.MESSAGE, function(message) {
  var user = rtm.dataStore.getUserById(message.user)
  var dm = rtm.dataStore.getDMByName(user.name);

  rtm.sendMessage('Hello ' + user.name + '!', dm.id);
})

rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
  console.log('Reaction added:', reaction)
})

rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
  console.log('Reaction removed:', reaction)
})
