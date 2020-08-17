const path = require('path');
const express = require('express');
const favicon = require('express-favicon');

const app = new express();
console.log('I am running!');

app.use('/scripts', express.static('./scripts/'));
app.use(express.static("public"));
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'views/index.html'));
});

app.get('/perraco', (req, res) => {
  res.send('putarraca');
  insertarBoton(req.query.boton);
});

app.get('/obtenerBotones', async (req, res) => {
  var resultado = await leerBotones();
  await res.send(resultado);
});

app.get('/guardarArticulo', (req, res) => {
  
  res.send("CULO");
  guardarArticulo(req.query)
  //var resultado = await guardarArticulo();
  //await res.send(resultado);
});

app.listen(4000, () => {
});

async function insertarBoton(nombreBoton)
{
  var mongoClient = require('mongodb').MongoClient;
  try
  {
    var cliente = await crearConexion(mongoClient);
    await insertarZura(cliente,nombreBoton);
  }
  catch(e)
  {
    console.error(e);
  }
  finally
  {
    await cliente.close();
  }
  
};

async function leerBotones()
{
  var mongoClient = require('mongodb').MongoClient;
  try
  {
    var cliente = await crearConexion(mongoClient);
    return await obtenerBotones(cliente);
  }
  catch(e)
  {
    console.error(e);
  }
  finally
  {
    await cliente.close();
  }
  
};

async function crearConexion(mongoClient) 
{
  
  const uri = 'mongodb+srv://ChemardoPrueba:corta123@perraco.bg9hv.gcp.mongodb.net/test?retryWrites=true&w=majority';
  const cliente = new mongoClient(uri);
  
  try {
      // Connect to the MongoDB cluster
      await cliente.connect();
      
      return await cliente;
  } catch (e) {
      console.error(e);
      await cliente.close();
  }
  
};

async function insertarZura(cliente,nombreBoton){
  var dbo = cliente.db("Botonazos");
  
  var query = { nombreBoton: nombreBoton };
  
  var result = await dbo.collection("botonContador").find(query).toArray();
  if(result[0])
  {
    var actualizarContador = {$set: {contador: result[0].contador + 1} };
    await dbo.collection("botonContador").updateMany(query, actualizarContador);
  }
  //var script = { nombreBoton: "MiraiZura", contador: 0 };
  //await dbo.collection('botonContador').insertOne(script);
};

async function obtenerBotones(cliente){
  var dbo = cliente.db("Botonazos");
  
  var result = await dbo.collection("botonContador").find().sort({nombreBoton:1}).toArray();
  
  return await result;
  //var script = { nombreBoton: "MiraiZura", contador: 0 };
  //await dbo.collection('botonContador').insertOne(script);
};

async function guardarArticulo(articulo){
  var mongoClient = require('mongodb').MongoClient;
  try{
    var cliente = await crearConexion(mongoClient);
    return await guardarArticuloDA(cliente, articulo);
  }
  catch(e){
    console.error(e);
  }
  finally{
    console.log("fainali");
    await cliente.close();
  }
};

async function guardarArticuloDA(cliente, articulo){
  var resultado;
  var idArt = {idArticulo: articulo.idArticulo};
  var articulo2 = articulo;
  console.log(1);
  var dbo = cliente.db("Tienda00001");
  console.log(articulo);
  return new Promise((resolve, reject) => {
    dbo.collection("Inventario").find(idArt).toArray(async function(err, result){    
      console.log(articulo2);
      console.log(2);
      if(err) throw err;    
      console.log(3);
      if(!result[0]){
        await dbo.collection("Inventario").insertOne(articulo2, async function(err, res){
          console.log(articulo2);
          console.log(4);
          if(err) throw err;
          console.log(5);
          resolve( res );
        });
      }
      else{
        console.log(6);
        var suma = parseInt(result[0].cantidadArticulo) + parseInt(articulo.cantidadArticulo);
        var actualizarExistencia = {$set: {cantidadArticulo: suma}};
        await dbo.collection("Inventario").updateMany(idArt, actualizarExistencia, function(err, res){
          console.log(7);
          if(err) throw err;
          console.log(8);          
          resolve( res );
        });
        
      }
      console.log("Picul");
      //db.close();    
  })});
};

async function guardarArticuloDA2(cliente, articulo){
  var idTienda = "00001";
  var resultado;
  var logsito= 1;
  var articulo2 = articulo;
  console.log(1);
  var dbo = cliente.db("Tienda00001");
  console.log(articulo);
 
      await dbo.collection("Inventario").insertOne(articulo2, async function(err, res){
        console.log(articulo2);
        console.log(4);
        if(err) throw err;
        console.log(5);
        resultado = await res;
      });
    console.log("Picul");
    //db.close();
    return resultado;
};
















