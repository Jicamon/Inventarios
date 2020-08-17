
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';

mongo.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("perraco");
  var query = { nombre: "topcomandos" };
  /*dbo.collection("Comandos").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
  });*/
  var myquery = { nombre: 'dsadsadsaads' };
  dbo.collection("Comandos").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
  });
  /*dbo.collection("Comandos").find().sort({contador:1}).limit(10).toArray(function(err, result) {
  	console.info(result);
  });*/
  db.close();
});


//Comandos
//nombre, contador
//play, 1