#!/usr/bin/env node

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var axios = require('axios');
var cheerio = require('cheerio');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
                // !test
            case 'test':
                bot.sendMessage({
                    to: channelID,
                    message: 'This is all I can do right now. Radical doesnt know shit about nodejs'
                });
                break;
                // !help
            case 'who':
                // get page html
                axios.post("http://multiplayerrobot.com/Game/Details?id=26578")
                    .then(response => {
                        console.log(response.data);
                        const $ = cheerio.load(response.data);
                        let whoseTurn = $('.game-host>.tooltip')[0].attribs.alt
                        console.log(`it's ${whoseTurn}'s turn`);
                        bot.sendMessage({
                            to: channelID,
                            message: `it's ${whoseTurn}'s turn`
                        });
                        // Just add any case commands if you want to..
                    }).catch( err => {
                        console.log(err);
                        console.log(err.stack);
                    })
                break;


        }
    }
});

// vim: et ts=4 sw=4
