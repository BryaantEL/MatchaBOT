const mineflayer = require('mineflayer')

// --- CONFIGURATION ---
const CONFIG = {
    host: 'us.freegamehost.xyz', // Ganti jadi '0.0.0.0' kalau satu project Railway
    port: 26770,
    username: 'MatchaLord',
    password: 'boba123',
    version: '1.21.4'
}

let bot;

function createBot() {
    console.log(`[BOT] Mencoba koneksi ke ${CONFIG.host}:${CONFIG.port}...`)
    
    bot = mineflayer.createBot({
        host: CONFIG.host,
        port: CONFIG.port,
        username: CONFIG.username,
        version: CONFIG.version,
        auth: 'offline',
        checkTimeoutInterval: 60000
    })

    // Handle Login & Spawn
    bot.once('spawn', () => {
        console.log('[BOT] Berhasil masuk ke server!')
        
        // Delay login/register biar gak instan kena kick
        setTimeout(() => {
            bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`)
            bot.chat(`/login ${CONFIG.password}`)
        }, 5000)

        // Anti-AFK: Lompat tiap 30 detik
        setInterval(() => {
            bot.setControlState('jump', true)
            setTimeout(() => bot.setControlState('jump', false), 500)
        }, 30000)
    })

    // Biar gak spam reconnect kalau error
    bot.on('error', (err) => console.log('[BOT] Error:', err.message))
    
    bot.on('kicked', (reason) => console.log('[BOT] Dikick:', reason))

    bot.on('end', () => {
        console.log('[BOT] Terputus. Menunggu 30 detik sebelum mencoba lagi...')
        setTimeout(createBot, 30000) // Jeda 30 detik biar gak nyepam log
    })
}

createBot()
