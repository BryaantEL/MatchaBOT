const mineflayer = require('mineflayer')

// Config
const BOT_PASSWORD = 'boba123'
const BOT_USERNAME = 'MatchaLord'
const SERVER_HOST = 'us.freegamehost.xyz'
const SERVER_PORT = 26770

let isFirstLogin = true

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: '1.21.4',
    auth: 'offline'
  })

  bot.on('login', () => {
    console.log('[BOT] Login berhasil ke server!')
  })

  bot.on('spawn', () => {
    console.log('[BOT] Bot spawn di server!')

    if (isFirstLogin) {
      console.log('[BOT] Attempting to register...')
      setTimeout(() => {
        bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`)
      }, 2000)
      setTimeout(() => {
        bot.chat(`/login ${BOT_PASSWORD}`)
        isFirstLogin = false
      }, 4000)
    } else {
      console.log('[BOT] Attempting to login...')
      setTimeout(() => {
        bot.chat(`/login ${BOT_PASSWORD}`)
      }, 2000)
    }

    // Anti-AFK: Jump setiap 25 detik
    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => {
        bot.setControlState('jump', false)
      }, 500)
    }, 25000)

    // Gerak random setiap 1 menit
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2
      bot.look(yaw, 0)
    }, 60000)
  })

  bot.on('kicked', (reason) => {
    console.log('[BOT] Bot dikick:', reason)
    console.log('[BOT] Reconnecting dalam 60 detik...')
    setTimeout(createBot, 60000)
  })

  bot.on('error', (err) => {
    console.log('[BOT] Error:', err.message)
    console.log('[BOT] Reconnecting dalam 60 detik...')
    setTimeout(createBot, 60000)
  })

  bot.on('end', () => {
    console.log('[BOT] Disconnect dari server')
    console.log('[BOT] Reconnecting dalam 60 detik...')
    setTimeout(createBot, 60000)
  })

  bot.on('message', (message) => {
    const msg = message.toString()
    console.log('[CHAT]', msg)

    if (msg.includes('successfully registered') || msg.includes('berhasil terdaftar')) {
      console.log('[BOT] ✅ Register berhasil!')
    }
    if (msg.includes('successfully logged in') || msg.includes('berhasil login')) {
      console.log('[BOT] ✅ Login berhasil!')
    }
  })
}

console.log(`[BOT] Starting ${BOT_USERNAME} KeepAlive Bot...`)
console.log(`[BOT] Server: ${SERVER_HOST}:${SERVER_PORT}`)
createBot()
