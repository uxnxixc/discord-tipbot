const db = require("./db.js");
const btcNode = require("./nuko.js");
const withdrawFee = 0.0001;
const Discord = require('discord.js');
const token = "your discord token";
//const token = "Mzg5Njg1MTA3ODIyMjk3MDkx.DTXzbQ.lelW7fLQ2HOfjH775A7Nj8QxSIA";//test
var client = new(require("discord.js")).Client();
var accounts = [];
var recentTx = [];
var addr_dict = {};
var lastTx = "";
db.accountLoader.on("loaded", (loaded, txs) => {
    if (loaded === undefined || loaded === null)
      return;

    accounts = loaded;
    console.log(accounts);
    for (var a in accounts) {
        if (accounts[a].address !== null) {
            addr_dict[accounts[a].address] ="1";
        }
    }
	// bot address. 
    addr_dict["0x219c8ad16caccf141bd02be063b221bf1ac0bdd9"] = "1";

    recentTx = txs;	
    console.log(addr_dict);
    console.log(recentTx);	
});
db.loadAccounts();


function check_duplicate_address(check_address){
if(addr_dict.hasOwnProperty(check_address))
	return true;
else
	return false;	
}



//console.log(accounts);

function refund(sender, amount) {
    accounts[sender].balance += amount;
    accounts[sender].withdrawls++;
    db.update(sender, accounts[sender]);
}

function check(sender, msg, items, msgObj) {
    if (accounts[sender].check > 0 || (!accounts[sender].address)) {
        if(accounts[sender].language == "ja")
	  msgObj.reply("このボットの使用を開始する前に \"tipnuko init \" を実行する必要があります。");
	else
          msgObj.reply("You need to run \"tipnuko init\" before you can start using this bot.");

        return true;
    }

	
    if ((items !== 0) && (msg.length !== items)) {
	if(accounts[sender].language == "ja")
	  msgObj.reply("あなたは正しい数のargumentsを含んでいませんでした。");
	else
          msgObj.reply("You didn't include the correct number of arguments.");
        return true;
    }

    if ((accounts[sender].last + 30000) > Date.now()) {
	 if(accounts[sender].language == "ja")
	    msgObj.reply("もう一度ボットを使用する前に" + Math.round((0-(Date.now()-(accounts[sender].last+30000)))/1000) + "秒待ってください。");
         else
            msgObj.reply("Please wait " + Math.round((0-(Date.now()-(accounts[sender].last+30000)))/1000) + " seconds before using the bot again.");
         return true;
    }
    accounts[sender].last = Date.now();

    return false;
}

var help = require("./help.js").help;
var help_ja = require("./help.js").help_ja;
var help_msg = require("./help.js").help_msg;
//console.log(help());


function parseMsg(msg, sender, msgObj) {
    switch (msg[0]) {
        case "tip":
            if (check(sender, msg, 0, msgObj)) {
                break;
            }

	    msg[1] = msg[1].replace("!","");
            if ((msg[1].substr(0, 2) !== "<@") ||
                (msg[1].substr(msg[1].length-1) !== ">") ||
                (Number.isNaN(parseInt(msg[1].substring(2, msg[1].length-1))))) {
		if(accounts[sender].language == "ja")
                 msgObj.reply("あなたは正当な人に TIP していません。 名前の前に@を付け、Discordが提供するポップアップをクリックしてください。");
		else
                 msgObj.reply("You are not tipping to a valid person. Please put @ in front of their name and click the popup Discord provides.");
                break;
            }

            msg[2] = parseFloat(parseFloat(msg[2]).toFixed(2));
            if (Number.isNaN(msg[2])) {
		if(accounts[sender].language == "ja")
		  msgObj.reply("あなたは番号を入力しませんでした。");
		else
                  msgObj.reply("You didn't enter a number.");
            } else if (msg[2] <= 0.01) {
		if(accounts[sender].language == "ja")
		msgObj.reply("あなたは額<0.01をTIPすることはできません");
		else
		msgObj.reply("You cannot tip an amount < 0.01");
		}
		else if (msg[2] <= 0) {
		if(accounts[sender].language == "ja")
			msgObj.reply("正の金額だけtipすることができます。")
		else
                	msgObj.reply("You can only tip positive amounts.");
            }  else if ((accounts[sender].balance - msg[2]) < 0) {
		 if(accounts[sender].language == "ja")
 		  msgObj.reply("あなたはそれをTIPるのに十分なお金がありません。 あなたは"+ accounts[sender].balance.toFixed(2)+ "NUKOを持っています");
		else
                  msgObj.reply("You don't have enough money to tip that. You have " + accounts[sender].balance.toFixed(2) + " NUKO");
            } else if (sender === msg[1]) {
		if(accounts[sender].language == "ja")
		msgOnj.reply("自分に送ることはできません。");
                else msgObj.reply("You cannot send to yourself.");
            } else {
                accounts[sender].balance -= msg[2];
                db.update(sender, accounts[sender]);
                if (!(accounts[msg[1]])) {
                    accounts[msg[1]] = {balance: msg[2], last: 0, check: 2, withdraws: 0, depoAmount: 0, depoTime: 0};
                } else {
                    accounts[msg[1]].balance += msg[2];
                }
                db.update(msg[1], accounts[msg[1]]);
		if(accounts[sender].language == "ja")
		  msgObj.reply("Sent " + msg[2] + " NUKO =>  " + msg[1] + ".");
		else
                msgObj.reply("Sent " + msg[2] + " NUKO =>  " + msg[1] + ".");
            }
            break;
        case "address":
              console.log(msg);
              if (msg.length !== 2){
              //msgObj.author.send("You have " + accounts[sender].balance + " BTC tenths.");
		if(accounts[sender].language == "ja")
		msgObj.reply("登録されたアドレス"  + "http://nekonium.network/account/"+accounts[sender].address + "");
                else msgObj.reply("Your registered address " + "http://nekonium.network/account/"+accounts[sender].address + "");
              }else{
		if(msg[1].length <38)
		{
			if(accounts[sender].language == "ja")
		   	  msgObj.reply("それは有効なNUKOアドレスでなければならない")
			else
			  msgObj.reply("it must be a valid nuko address");
			break;
		}
		if(check_duplicate_address(msg[1].toLowerCase()))
		{
			if(accounts[sender].language == "ja")
			  msgObj.reply("このアドレスは他の人が使用します。 別のアドレスを使用してください");
			else 
			  msgObj.reply("this address is used by someone else, please use another address");
			break;
		}
		if(accounts[sender].language == "ja")
		msgObj.reply("アドレスを " +  "http://nekonium.network/account/"+msg[1]+ " に更新しました");
                else 
		msgObj.reply("You updated the address to " + "http://nekonium.network/account/"+msg[1]);
                //accounts[sender].address = msg[1].toLowerCase();
		if (addr_dict.hasOwnProperty(accounts[sender].address)) {
 			 
		  delete addr_dict[accounts[sender].address];
		}
		accounts[sender].address = msg[1].toLowerCase();
		addr_dict[accounts[sender].address] = "1";

                db.update(sender, accounts[sender]);
              }

              break;

        case "withdraw":
            if (check(sender, msg, 2, msgObj)) {
                break;
            }

            msg[1] = parseFloat(parseFloat(msg[1]).toFixed(2));
          /*  if (msg[1] === btcNode.address) {
                msgObj.reply("You cannot withdraw to me. It's just network spam...");
            } else*/ if (Number.isNaN(msg[1])) {
		if(accounts[sender].language == "ja")
                  msgObj.reply("あなたは番号を入力しませんでした。");
                else
                  msgObj.reply("You didn't enter a number.");

            } else if (msg[1] <= 0.01) {
		if(accounts[sender].language == "ja")
                msgObj.reply("あなたは額<0.01をwithdrawすることはできません");
                else
                msgObj.reply("You cannot withdraw an amount < 0.01");

            } else if (msg[1] < 0) {
		if(accounts[sender].language == "ja")
                        msgObj.reply("正の金額だけwithdrawすることができます。")
                else    
                        msgObj.reply("You can only withdraw positive amounts.");

            } else if (accounts[sender].balance < (msg[1])) {
		if(accounts[sender].language == "ja")
		msgObj.reply("あなたはそれをwithdrawするのに十分ではありません。" +accounts[sender].balance.toFixed(2)+ " NUKO があり、小数点以下2桁を正しく丸めるには0.01 NUKOを残す必要があります。");
		else
                msgObj.reply("You don't have enough to withdraw that. You have " + accounts[sender].balance.toFixed(2) + " NUKO and must leave 0.01 NUKO for correct rounding of 2 decimal places.");
            } else {
               /* if (accounts[sender].withdraws === 0) {
                    accounts[sender].balance -= withdrawFee;
                    accounts[sender].withdraws = 10;
                }*/
                accounts[sender].withdraws--;
                accounts[sender].balance -= msg[1];
                db.update(sender, accounts[sender]);
              	console.log("message " + msg[1]); 
                btcNode.send(accounts[sender].address, msg[1], msgObj, refund);
            }
            break;

        case "balance":
          //msgObj.author.send("You have " + accounts[sender].balance + " BTC tenths.");
            console.log("balance");
  	    //console.log(accounts);
	    console.log(sender);
	    if (accounts[sender].balance > 10){
		if(accounts[sender].language == "ja")
		msgObj.reply("あなたは"+ accounts[sender].balance.toFixed(2) +"NUKOを持っています。 「tipnuko withdraw」の使用を検討してください。");
		else
	        msgObj.reply("You have " + accounts[sender].balance.toFixed(2) + " NUKO, please consider using \"tipnuko withdraw\" because it is dangerous to keep too much NUKO on the bot");
        	}
	    else{
		if(accounts[sender].language == "ja")
		msgObj.reply("あなたは"+accounts[sender].balance.toFixed(2) +"NUKOを持っています");	
		else
            	msgObj.reply("You have " + accounts[sender].balance.toFixed(2) + " NUKO ");
	    }
            break;

        case "init":
            switch (accounts[sender].check) {
                case 0:
			if(accounts[sender].language == "ja")
		    msgObj.reply("既にアカウントを作成しています。");
			else
                    msgObj.reply("You already initialized your account.");
                    break;

                case 1:
                    console.log(msg);
                    if (msg.length !== 2) {
			if(accounts[sender].language == "ja")
		 	msgObj.reply("預金と払い出しのために使用するNUKOのaddressで初期化する必要があります");
                      else msgObj.reply("You need to init with your nuko address that you will use for deposit & widrawal");
                      break;
                    }
		if(msg[1].length <38)
                {
                  if(accounts[sender].language == "ja")
                          msgObj.reply("それは有効なNUKOアドレスでなければならない");
		  else
		          msgObj.reply("it must be a valid nuko address");
                        break;
                }

		if(check_duplicate_address(msg[1].toLowerCase()))
                {      
			if(accounts[sender].language == "ja")
                          msgObj.reply("このアドレスは他の人が使用します。 別のアドレスを使用してください");
			else 
                        msgObj.reply("this address is used by someone else, please use another address");
                        break;
                }
                    accounts[sender].check--;

                
                   
                    accounts[sender].address = msg[1].toLowerCase();
  		    addr_dict[accounts[sender].address] = "1";
			if(accounts[sender].language == "ja")
		    msgObj.reply("あなたのアカウントは初期化されました！ address: http://nekonium.network/account/" + msg[1] );	
			else
                    msgObj.reply("Account initialized! with address http://nekonium.network/account/" + msg[1] );
                    db.update(sender, accounts[sender]);
                    break;

                case 2:
                    accounts[sender].check--;
			if(accounts[sender].language == "ja")
		    msgObj.reply("「tipnuko init Your_Nuko_Address」をもう一度実行すると、 「tipnuko help」のステートメントを読んで、botの作成者、所有者、およびすべての保守担当者を法的責任から解放することに同意したことになります。 あなたはお金を失うかもしれません。 何も保証されていません");
			else
                    msgObj.reply("By running \"tipnuko init Your_Nuko_Address\" again, you agree that you've read the statements in \"tipnuko help\", to release the creator, owner, and all maintainers of the bot from any legal liability, and that you undertsand this is beta software. You may lose money. Nothing is guaranteed.");
                    break;
            }
            break;

        case "help":


            if (msg.length > 1) {
                msgObj.reply(help_msg(msg[1],accounts[sender].language));

            } else {
                //msgObj.reply(help_embed);
		//console.log(help_embed);
  if(accounts[sender].language == "ja"){	
const help_embed = new Discord.RichEmbed()
  .setTitle("Nekonium Discord tip bot <:nukojab:398819601552769024>")
  /*.setAuthor("Mike", "https://i.imgur.com/0yEvL3b.jpg")*/
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(0x00AE86)
  .setImage("https://i.imgur.com/IU0eQJU.png")
  .setThumbnail("https://i.imgur.com/0yEvL3b.jpg")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setFooter("Created by @mike_theminer, with the help of translation from @unic")
  .setTimestamp()
  .setURL("http://nekonium.network/account/0x219c8ad16caccf141bd02be063b221bf1ac0bdd9")
  .addField("Usage <:nukojab:398819601552769024>",
    help_ja()[0])
  .addField("Commands <:nukojab:398819601552769024> <:syurikenb:398382669584662529> <:syurikenb:398382669584662529>",
    help_ja()[1]);

		msgObj.channel.send({ embed: help_embed});
}
else{

const help_embed = new Discord.RichEmbed()
  .setTitle("Nekonium Discord tip bot <:nukojab:398819601552769024>")
  /*.setAuthor("Mike", "https://i.imgur.com/0yEvL3b.jpg")*/
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(0x00AE86)
  .setImage("https://i.imgur.com/IU0eQJU.png")
  .setThumbnail("https://i.imgur.com/0yEvL3b.jpg")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setFooter("Created by @mike_theminer, with the help of translation from @unic")
  .setTimestamp()
  .setURL("http://nekonium.network/account/0x219c8ad16caccf141bd02be063b221bf1ac0bdd9")
  .addField("Usage <:nukojab:398819601552769024>",
    help()[0])
  .addField("Commands <:nukojab:398819601552769024> <:syurikenb:398382669584662529> <:syurikenb:398382669584662529>",
    help()[1]);

                msgObj.channel.send({ embed: help_embed});




}
            }
            break;
       case "config":
	    if (msg.length > 1) {
                if (msg[1] == "ja") 
		{
			msgObj.reply("私はあなたに日本語を話す");
		}
		else 
			msgObj.reply("I will speak with you in English");

		console.log("update language " + msg[1]);		
		accounts[sender].language = msg[1];
		db.update(sender, accounts[sender]);
            } else {
                //msgObj.reply(help_embed);
                //console.log(help_embed);
                msgObj.reply("tipnuko config ja => 日本語 ;;; tipnuko config en => english");
		
            }
            break;

        default:
	    if(accounts[sender].language == "ja")	
	      msgObj.reply("それはコマンドではありません。 \"tipnuko help\" を実行してコマンドのリストを取得するか、最後のメッセージを編集します。");
            else
	      msgObj.reply("That is not a command. Run \"tipnuko help\" to get a list of commands or edit your last message.");
    }
}

function handleMessage(msg) {
	console.log(msg.content);
    if (msg.content.toLowerCase().substr(0, 7) !== "tipnuko") {
//	console.log(msg.content.toLowerCase().substr(0, 7) );
//	console.log("meme");
        return;
    }

    var sender = msg.author.toString();
    if ( !(accounts)|| !(accounts[sender])) {
        accounts[sender] = {balance: 0, withdraws: 0, check: 2, last: 0, depoAmount: 0, depoTime: 0};
        db.addNewUser(sender);
    }

    var message = msg.content.substring(7, msg.content.length).toLowerCase().split(" ").filter((item, index, inputArray) => {
       return item !== "";
    });
    for (var i = 0; i < message.length; i++) {
        message[i] = message[i].split("\r")[0].split("\n")[0];
    }
//    console.log(msg);
    parseMsg(message, sender, msg);
}

var listen_channel = ["398378192924049408","399890730287366145","400288284917366805","389690383908601867"];
client.on("message", (msg) => {
//    console.log(msg.channel.id);
    if (msg.content.toLowerCase().substr(0, 7) !== "tipnuko") {
       return;
    }
    console.log(msg.author.username);
    if (msg.author.username == "tipnuko")
	return;
    if(listen_channel.indexOf(msg.channel.id) > -1)
    	handleMessage(msg);
    else
	msg.reply("Please chat with me on <#400288284917366805> channel. ( <#400288284917366805> チャンネルで私とチャットしてください)");
});
client.on("messageUpdate", (oldMsg, msg) => {

//    handleMessage(msg);

});
client.login(token);

function handleDeposit(address,amount,txhash) {
console.log("handle deposit " + address + " " +amount);
    if(recentTx[txhash] == "1"){
	console.log("conflict deposit");
	 return;
	} 
    for (var a in accounts) {
        if (accounts[a].address !== address) {
            continue;
        }
	if(lastTx!= txhash){
		db.removeTx(lastTx);
		db.saveTx(txhash);
		lastTx = txhash;
	}
        accounts[a].depoAmount = 0;
        accounts[a].depoTime = 0;
        accounts[a].balance += amount;
        db.update(a, accounts[a]);

        break;
    }
}
btcNode.scheduler.on("deposit", handleDeposit);
