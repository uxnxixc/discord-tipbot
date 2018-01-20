
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')

const db = low(adapter)
db.defaults({ accounts: [], recentTx:[]}).write();
module.exports = {
    loadAccounts: () => {

  /*
        connection.query("SELECT * FROM " + table, (err, rows) => {
            if (err) {
                console.log(err);
            }

            var accounts = {};
            rows.forEach((row) => {
                accounts[row.name] = {balance: row.balance, withdraws: row.withdraws, check: row.notify, last: 0, depoAmount: 0, depoTime: 0};
            });
            module.exports.accountLoader.emit("loaded", accounts);
        });
      */
      var accounts = {};
      var rows = db.get('accounts').value();
      rows.forEach((row) => {
	accounts[row.id] = {address: row.address,balance: row.balance, withdraws: row.withdraws, language: row.language, check: row.notify, last: 0, depoAmount: 0, depoTime: 0};
	});

      var tx = {};
      var rows1 = db.get('recentTx').value();
      rows1.forEach((row1) => {
	tx[row1.hash] = "1"; 	       
        });


      module.exports.accountLoader.emit("loaded", accounts, tx);
//      console.log(accounts);
    },

    addNewUser: (usrid) => {
	const numacc =  db.get('accounts').find({ id: usrid }).size().value();
        //connection.query("INSERT INTO " + table + " VALUES(\"" + id + "\", 0, 0, 2)", (err)=>{});
	if (numacc != 0)
		{
		 console.log("conflict writing ");
			return;
		}
	console.log("add new user " + usrid);
        db.get('accounts')
          .push({ id:usrid, balance: 0, withdraws:0, notify:2 })
          .write();

    },

    update: (usrid, account) => {
      //  connection.query("UPDATE " + table + " SET balance=" + account.balance + " WHERE name=\"" + id + "\"", (err)=>{});
      //  connection.query("UPDATE " + table + " SET withdraws=" + account.withdraws + " WHERE name=\"" + id + "\"", (err)=>{});
      //  connection.query("UPDATE " + table + " SET notify=" + account.check + " WHERE name=\"" + id + "\"", (err)=>{});
        db.get('accounts')
          .find({ id: usrid })
          .assign({ balance:  account.balance ,withdraws: account.withdraws,notify:account.check, address:account.address, language:account.language })
          .write();
        console.log('db update');
//        console.log(db.get('accounts'))
      },
    saveTx:(txhash) => {
       const numtx =  db.get('recentTx').find({ hash: txhash }).size().value();
        //connection.query("INSERT INTO " + table + " VALUES(\"" + id + "\", 0, 0, 2)", (err)=>{});
        if (numtx != 0)
                {
                 console.log("conflict writing ");
                        return;
                }
	console.log("add new tx " + txhash);
          db.get('recentTx')
          .push({ hash:txhash})
          .write();
	
	},
    removeTx:(txhash) => {
	db.get('recentTx')
	  .remove({ hash: txhash })
	  .write()

	},
    accountLoader: new (require("events"))()
};
