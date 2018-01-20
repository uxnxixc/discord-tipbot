

var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8293"));
var eth = web3.eth;
var bot_address = "your bot address";
var bot_privatekey = " your bot privatekey";//signing tx directly in this app,  

console.log(web3.eth.blockNumber);
var account = bot_address.toLowerCase();
var myaccount = account;
var key = new Buffer(bot_privatekey, 'hex')
const gasPrice = web3.eth.gasPrice;
const gasPriceHex = web3.toHex(gasPrice);
const gasLimitHex = web3.toHex(30000);

var fs = require("fs");
function getTransactionsByAccount(myaccount,callback) {

  var  endBlockNumber = web3.eth.blockNumber;
  console.log("Using endBlockNumber: " + endBlockNumber);
  var result = [];

  var startBlockNumber = endBlockNumber - 5;
  for (var i = endBlockNumber; i >= startBlockNumber; i--) {
    if(i == startBlockNumber){
      callback(null, result);
    }
    //    return result;
    var block = eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach( function(e) {
//	console.log(e.hash);
        if (myaccount == e.to) {
                result.push({   "hash":e.hash,
                                "from":e.from,
                                "to": e.to,
                                "value":e.value ,
                                "confirmations":web3.eth.BlockNumber-e.blockNumber
                                });
		           console.log(e.hash);

          }
      })
    }
  }
}
module.exports = {
    address: account,
    send: (to, amount, chatInterface, refund) => {
       // amount = amount;
//console.log("sned to " + to);
var number = web3.eth.getTransactionCount(account);
var tra = {
	nonce:web3.toHex(number),
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    value: web3.toHex(web3.toWei(amount,"ether")),
    data: 0x0,
    from: account,
    to: to
};
        var tx = new Tx(tra);
        tx.sign(key);

        var stx = tx.serialize();
        web3.eth.sendRawTransaction('0x' + stx.toString('hex'), (err, hash) => {
    //    client.sendToAddress(to, amount, (err, hash, headers) => {
            if (err) {
                console.log("refund amount " + amount);
                refund(chatInterface.author.toString(), amount);
                chatInterface.reply("Error! " + err);
                return;
            }
            chatInterface.reply("Success! " + "http://nekonium.network/tx/"+hash);
        });
    },
    scheduler: new(require("events"))()
};

var hashes = [];/*
client.listReceivedByAddress((err, res, headers) => {
    return;
    hashes = res[0].txids;
});

*/

function handleResult(err,results){
  results.forEach(function(element) {
    console.log("get tx");
    console.log(element.hash);
	
    if (hashes.indexOf(element.hash) > -1) {
        return;
    }
	console.log("pass this " + element.confirmations);
	if( element.confirmations == null)
	{
		console.log("null confirmation ");
		return;
	}
    if (element.confirmations <= 1) {
        return;
    }
  
    hashes.push(element.hash);
    console.log('passed all ' + element.from + " " + web3.fromWei(element.value, 'ether'));
    var value = web3.fromWei(element.value, 'ether');
    module.exports.scheduler.emit("deposit",element.from,parseFloat(value),element.hash);
  });

};

setInterval(() => {
  getTransactionsByAccount(myaccount,handleResult);



}, 10000);
