/*var defaultHelp = `Welcome to the nuko Tip Bot! Here you can tip other people on Discord with no tipping fees!
COMMANDS:
-- 1st step: tipnuko init | Activates your account.
-- 2nd step: Read this help message then tipnuko init your_address
-- 3rd step: Use your_address to send fund to [bot address](http://nekonium.network/account/0x219c8ad16caccf141bd02be063b221bf1ac0bdd9) or QR code below to topup your account after init
-- tipnuko tip PERSON AMOUNT | Sends Y NUKO to person X from your balance.
-- tipnuko withdraw  AMOUNT | Withdraws Y NUKO to X address. Please withdraw as soon as you have enough (>5 NUKO)
-- tipnuko balance | Returns your balance.
-- tipnuko address | Returns your address.
-- tipnuko address new_address | update your address.
Run "tipnuko help COMMAND" for more info on a command.
This bot uses minimum tip & withdraw amount of (0.01 NUKO).
By running tipnuko init, you agree to release the coder, owner, and other parties related to this bot, from any and all liability. This is BETA software. You may lose money.`;
*/
var defaultHelp1 = `
[How to use \'tipnuko\' :cat2:]\n
\n
**To receive tip from others**\n
You don\'t have to do anything!! :smiley_cat: \n
I\'ll keep track of your balance until you *withdraw*\n
Type \`tipnuko balance\` to check how much you own!\n
\n
**To send tip or withdraw  NUKO**\n
If this is your first time, you must tell me your Nekonium Address. If you don't have one, please create one from a Wallet.\n
\n
Three simple steps...\n
1) \`tipnuko init\`\n
   Displays confirmation text.\n
2) \`tipnuko init YOUR_NUKO_ADDRESS\`\n
   Accept confirmation & Set up your account using [YOUR_ADDRESS]
3) Using a Wallet, send me some NUKOs from [YOUR_ADDRESS] to my address (QR code below)
   [0x219c8ad..](http://nekonium.network/account/0x219c8ad16caccf141bd02be063b221bf1ac0bdd9)
*Make sure you send it __**AFTER**__ you tell me [YOUR_ADDRESS]*

Now you\'re ready!
`
var defaultHelp2 = `
__List of commands__
- *tipnuko balance* to check how much you own.
- *tipnuko tip @name VALUE* to tip others.
 *ex) tipnuko tip @somediscorduser 0.22*
- *tipnuko withdraw VALUE* Transfer NUKOs from my balance to [YOUR_ADDRESS]
 *ex) tipnuko withdraw 1.11*
- *tipnuko address* to check [YOUR_ADDRESS]
- *tipnuko address [NEW_ADDRESS]* to CHANGE [YOUR_ADDRESS] to [NEW_ADDRESS]
- *tipnuko config ja* to change language to japanese. 
__Additional Notes__
I can only understand values greater than 0.01. Please don't keep too much NUKOs on your balance :warning:  Try to *withdraw* periodically, I may crash :red_car: and lose track of who owns how much :exclamation:  **This is BETA software**. You may lose money :money_with_wings:  . Donations are always welcome! *tipnuko tip @tipnuko 1000*

`;
var defaultHelp = [defaultHelp1, defaultHelp2];

var defaultHelpJa1 = `
tipnukoはみんなから預かったNUKOを元に動くニャン :cat2:

**tip を受け取るには？**
何もしなくて大丈夫だニャン！届いたtipは自動的に記録されるニャン。*tipnuko balance* で残高を確認出来るニャン。

**tipを贈りたい or withdraw で引き出したい**
初めて使う場合、あなたのNekoniumアドレスを教えるんだニャン。持ってない場合はWalletで作ってから出直すんだニャン

３ステップで設定するんだニャン
1) *tipnuko init*
   注書きが出るからちゃんと読むんだニャン。
2) *tipnuko init [Nekoniumアドレス]*
   注意書きに同意したことになるニャン。
   これでtipnukoがあなたのアドレスを覚えるんだニャン。
3) Walletを使ってあなたの[Nekoniumアドレス]からtipnukoにNUKOを送るんだニャン。QR CODE below
   [0x219c8ad..](http://nekonium.network/account/0x219c8ad16caccf141bd02be063b221bf1ac0bdd9)

*NUKOを送るのは 2)の後じゃないとダメだにゃん*

これで準備OKだニャン　:checkered_flag:
`;

var defaultHelpJa2 = `
__コマンド一覧__
- *tipnuko balance* 残高が表示されるんだニャン
- *tipnuko tip @name VALUE* tipを贈るんだニャン
 *例) tipnuko tip @somediscorduser 0.22*
- *tipnuko withdraw VALUE* tipnukoからNUKOを引き出すんだニャン
 *例) tipnuko withdraw 1.11*
- *tipnuko address* 登録されてるNekoniumアドレスを表示するんだニャン
- *tipnuko address [新しいアドレス]* 登録されたNekoniumアドレスを更新するんだニャン


__tipnukoの注意書き__
最低単位は0.01だニャン。残高にあまり多くのNUKOを置くと危ないニャン。適時 *withdraw* で引き出すんだニャン。もしかしたら壊れて残高が消えちゃうかもしれないニャン :warning: BETA版だから気をつけるんだニャン :exclamation: 
`;


var defaultHelp_ja = [defaultHelpJa1, defaultHelpJa2];

var helpStrings = {
    "address": "\"tipnuko address\" show your current address. \"tipnuko address your_new_address\"  update your address.\r\n",
    "deposit": "send fund to http://nekonium.network/account/0x219c8ad16caccf141bd02be063b221bf1ac0bdd9 to topup your account after init",
    "tip": "\"tipnuko tip <@332150942319378432> 5\" Running that will send 5 nuko to me, the creator of this bot. If you do run it, thanks!",
    "withdraw": "\"tipnuko withdraw 10\" Running that would send 10 NUKO to your registered account.\r\n",
    "balance": "Returns your balance. Use it as so: \"tipnuko balance\"",
    "init": "Signals your agreeance to the Terms of Service/Conditions this bot employs and allows you to use this bot. \"tipnuko init\"",
    "help": "The help command details how the bot works and provides examples of commands. For instance, \"tipnuko help\", the command you just entered. Seriously. Why are you running help on help?"
}

var helpStrings_ja = {
    "address": "\"tipnuko address\"は現在のアドレスを表示します。 \"tipnuko address your_new_address\" あなたの住所を更新する\r\n",
    "deposit": "initの後であなたのアカウントの上にnukoを送るhttp://nekonium.network/account/0x219c8ad16caccf141bd02be063b221bf1ac0bdd9",
    "tip": "\"tipnuko tip <@332150942319378432> 5\"実行すると、5NUKOが私に送られます。 あなたがそれを実行する場合は、ありがとう！",
    "withdraw": "\"tipnuko withdraw 10\"あなたの登録addressに10 NUKOを送る\r\n",
    "balance": "あなたのバランス。 この方法を使用してください： \"tipnuko balance\"",
    "init": "このボットが採用している利用規約/条件に同意し、このボットを使用できるようにします \"tipnuko init\"",
    "help": "helpコマンドは、ボットの動作の詳細とコマンドの例を提供します。 たとえば、 \"tipnuko help\"は、あなたが今入力したコマンドです。 真剣に。 なぜあなたは助けに助けをしていますか？"
}




module.exports = {
    help: (command) => {
        if (command) {
            if (helpStrings[command]) {
                return helpStrings[command];
            }
        }
        return defaultHelp;
    },

    help_ja: (command) => {
        if (command) {
            if (helpStrings_ja[command]) {
                return helpStrings_ja[command];
            }
        }
        return defaultHelp_ja;
    },
    help_msg: (command,language) => {
        if (command) {
	    if(language =="ja"){
            	if (helpStrings_ja[command]) {
                return helpStrings_ja[command];
            	}
	    }
	    else{
		if (helpStrings[command]) {
                return helpStrings[command];
                }
		}
        }
	if(language =="ja")
          return "分かりません => \"tipnuko help\"";
	else
	  return "I don\'t understand, please type \"tipnuko help\"";
    }
  
}
