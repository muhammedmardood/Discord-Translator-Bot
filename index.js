const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "!";
const translate = require('@iamtraction/google-translate');
const JishoApi = require('unofficial-jisho-api');
const jisho = new JishoApi();

bot.on("ready" , () => {
    console.log("ready");
    bot.user.setActivity('translate channels', { type: 'WATCHING' });
})

bot.on("message", msg => {
  if(msg.author.bot) return;
  let args = msg.content.substring(prefix.length).split(" ");
  const tt = msg.content.substring(
    msg.content.lastIndexOf("!translate ") + 11, 
    msg.content.lastIndexOf(' to')
    );
    const kunyomi = msg.content.substring(
      msg.content.lastIndexOf("!kunyomi ") + 9 );
    const onyomii = msg.content.substring(
      msg.content.lastIndexOf("!onyomi ") + 8 );
    const lan = msg.content.substring(
      msg.content.lastIndexOf("to ") +3
    );
    
    if (msg.channel.name == "translate") {

      switch (args[0]) {
        case "ping":
          msg.channel.send("Pong");
          break;
        case 'translate':
          if(translate.languages.isSupported(lan)){
            translate(tt, {to : lan}).then(re => {
              const tembed = new Discord.MessageEmbed()
              .setTitle('Translation')
              .setDescription('From: '+re.from.language.iso+'\nTo: '+lan+'\nResult:\n```'+re.text+'```')
              .setFooter("Bot developed by Mardood")
              .setColor(0x00FF33);
              msg.channel.send(tembed);
              msg.react("✅");
            });
          }else{
            msg.channel.send("Language is not supported!");
            msg.react("❌");
          }
          break;
        case 'help':
          const hembed = new Discord.MessageEmbed()
          .setTitle('Help')
          .setDescription("Welcome to the Translator Bot\nI translate every thing to any language\nalso i have a Jisho so i can give you information of Kanji\nType !commands to get Commands")
          .setFooter("Bot developed by Mardood")
          .setColor(0x00FF33);
          msg.channel.send(hembed);
          break;
        case 'commands':
          const cembed = new Discord.MessageEmbed()
          .setTitle('Commands')
          .setDescription("Translation command: !translate.\nusage: !translate Hello world to Japanese\nJisho commands: !kanjiinfo, !kunyomi, !onyomi.\nusage: !kanjiinfo 日, !kunyomi 日, !onyomi 日.")
          .setFooter("Bot developed by Mardood")
          .setColor(0x00FF33);
          msg.channel.send(cembed);
          break;
        case 'kanjiinfo':
          jisho.searchForKanji(args[1]).then(resu =>{
            if(!resu.found){
              msg.channel.send('There should be one Kanji');
              msg.react("❌");
            }else{
              const Embed = new Discord.MessageEmbed()
              .setTitle("information of: "+args[1])
              .setDescription('Taught in: ' + resu.taughtIn+'\nJLPT level: ' + resu.jlptLevel+'\nStroke count: ' + resu.strokeCount+'\nMeaning: ' + resu.meaning+'\nKunyomi: ' + JSON.stringify(resu.kunyomi)+'\nKunyomi example: ' + JSON.stringify(resu.kunyomiExamples[0])+'\nOnyomi: ' + JSON.stringify(resu.onyomi)+'\nOnyomi example: ' + JSON.stringify(resu.onyomiExamples[0])+'\nRadical: ' + JSON.stringify(resu.radical)+'\nParts: ' + JSON.stringify(resu.parts))
              .setFooter('Bot developed by Mardood')
              .setColor(0x00FF33);
              msg.channel.send(Embed);
              msg.react("✅");
            }
          });
           break;
        
        case 'kunyomi':
          jisho.searchForKanji(args[1]).then(r =>{
            if(!r.found){
              msg.channel.send("Sorry can't find the Kanji, There should be only one kanji");
              msg.react("❌");
            }else{
              const kembed = new Discord.MessageEmbed()
              .setTitle("Kunyomi of: "+args[1])
              .setDescription('Kunyomi: ' + JSON.stringify(r.kunyomi)+"\n"+'Kunyomi example: ' + JSON.stringify(r.kunyomiExamples[0])+"\nmeaning: "+r.meaning)
              .setFooter('Bot developed by Mardood')
              .setColor(0x00FF33);
              msg.channel.send(kembed);
              msg.react("✅");
            }
           });
           break;
        case 'onyomi':
          jisho.searchForKanji(args[1]).then(result =>{
            if (!result.found) {
              msg.channel.send("Sorry can't find the Kanji, There should be only one kanji");
              msg.react("❌");
            }else{
              const oembed = new Discord.MessageEmbed()
              .setTitle("Onyomi of: "+args[1])
              .setDescription('Onyomi: ' + JSON.stringify(result.onyomi)+"\n"+'Onyomi example: ' + JSON.stringify(result.onyomiExamples[0])+"\nmeaning: "+result.meaning)
              .setFooter('Bot developed by Mardood')
              .setColor(0x00FF33);
              msg.channel.send(oembed);
              msg.react("✅");
            }
           });
           break;
          default:
            msg.react("❌");
            msg.channel.send("Couldn't find the command\nType the command !help to see the commands") 
         break;
    }
  } else {
    if (msg.content == "!help") {
      msg.reply('This bot works only in a channel named as "translate"');
    }
  } 
});

bot.login("Enter Your Bot Token Here");
