//require('dotenv').config()
const { Client } = require('discord.js-selfbot-v13')
const client = new Client()

const DISBOARD_BOT_ID = '302050872383242240' // Disboard bot ID
const DISSOKU_BOT_ID = '761562078095867916' // Dissoku bot ID

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)

    if (!process.env.BUMP_CHANNELS) {
        console.error('Please set the BUMP_CHANNELS environment variable.')
        return;
    }

    const channels = process.env.BUMP_CHANNELS.split(',')

    if (!channels.length) {
        console.error('No channels specified in BUMP_CHANNELS environment variable.')
        return;
    }
        
    async function bump() {
        for (const channelId of channels) {
            const channel = await client.channels.fetch(channelId.trim());
            if (!channel) {
                console.error(`Channel not found: ${channelId}`);
                continue;
            }

            const disboard = await channel.guild.members.fetch(DISBOARD_BOT_ID).catch(() => null);
            if (disboard) {
                await channel.sendSlash(DISBOARD_BOT_ID, 'bump');
                console.count('Disboard Bumped!');
            }

            const dissoku = await channel.guild.members.fetch(DISSOKU_BOT_ID).catch(() => null);
            if (dissoku) {
                await channel.sendSlash(DISSOKU_BOT_ID, 'up');
                console.count('Dissoku Bumped!');
            }
        }
    }

    function loop() {
        // send bump message every 2-3 hours, to prevent detection.
        var randomNum = Math.round(Math.random() * (9000000 - 7200000 + 1)) + 7200000
        setTimeout(function () {
            bump()
            loop()
        }, randomNum)
    }
    
    bump()
    loop()
})

client.login(process.env.TOKEN)
