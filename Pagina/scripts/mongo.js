const { query } = require('express');

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
    await cliente.close();
  }
};

async function guardarArticuloDA(cliente, articulo){
  var resultado;
  var idArt = {idArticulo: articulo.idArticulo};
  var articulo2 = articulo;
  var dbo = cliente.db("Tienda00001");
  return new Promise((resolve, reject) => {
    dbo.collection("Inventario").find(idArt).toArray(async function(err, result){
      if(err) throw err;
      if(!result[0]){
        await dbo.collection("Inventario").insertOne(articulo2, async function(err, res){
          if(err) throw err;
          resolve( res );
        });
      }
      else{
        var suma = parseInt(result[0].cantidadArticulo) + parseInt(articulo.cantidadArticulo);
        var actualizarExistencia = {$set: {cantidadArticulo: suma}};
        await dbo.collection("Inventario").updateMany(idArt, actualizarExistencia, function(err, res){
          if(err) throw err;
          resolve( res );
        });
        
      }
      console.log("Picul");
  })});
};

async function guardarArticuloDA2(cliente, articulo){
  var idTienda = "00001";
  var resultado;
  var logsito= 1;
  var articulo2 = articulo;
  var dbo = cliente.db("Tienda00001");
 
      await dbo.collection("Inventario").insertOne(articulo2, async function(err, res){
        if(err) throw err;
        resultado = await res;
      });
    console.log("Picul");
    return resultado;
};

async function crearBaseDeDatos(client, nombreBaseDeDatos){
    
    const newDB = await client.db("Tienda"+nombreBaseDeDatos);
    await newDB.createCollection("Secuencias");
    await newDB.collection("Secuencias").insert({
      "_id":"SecuenciaFamilia",
      "sequence_value": 0
    })

    await newDB.collection("Secuencias").insert({
      "_id":"SecuenciaSubFamilia",
      "sequence_value": 0
    })
    
}

async function nuevaBaseDeDatos(nombreBaseDeDatos){
    var mongoClient = require('mongodb').MongoClient;
    try
    {
      var client = await crearConexion(mongoClient);
      return await crearBaseDeDatos(client, nombreBaseDeDatos);
    }
    catch(e)
    {
      console.error(e);
    }
    finally
    {
      await client.close();
    }
}

async function agregarFamilia(query){
  var mongoClient = require('mongodb').MongoClient;
  console.info(query);
  try
  {
    var client = await crearConexion(mongoClient);
    return await agregarFamiliaTienda(client,query);
  }
  catch(e)
  {
    console.error(e);
  }
  finally
  {
    await client.close();
  }

}

async function agregarSubFamilia(query){
  var mongoClient = require('mongodb').MongoClient;
  console.info(query);
  try
  {
    var client = await crearConexion(mongoClient);
    return await agregarSubFamiliaTienda(client,query);
  }
  catch(e)
  {
    console.error(e);
  }
  finally
  {
    await client.close();
  }

}

async function obtenerInventario(query){
  var mongoClient = require('mongodb').MongoClient;
  try
  {
    var client = await crearConexion(mongoClient);
    return await obtenerInventarioTienda(client,query);
  }
  catch(e)
  {
    console.error(e);
  }
  finally
  {
    await client.close();
  }
}

async function obtenerInventarioTienda(client, queary){
  var dbo = client.db("Tienda"+queary.tienda);
  
  return await dbo.collection("Inventario").find().toArray();
}

async function agregarFamiliaTienda(client, query){

  var dbo = client.db("Tienda"+query.tienda);

  var id = await getNextSequenceValue(dbo,'SecuenciaFamilia');

  return await dbo.collection("Familia").insertOne({
    "familiaId":id,
    "nombreFamilia": query.nombreFamilia
  })
}

async function agregarSubFamiliaTienda(client, query){

  var dbo = client.db("Tienda"+query.tienda);

  var id = await getNextSequenceValue(dbo,'SecuenciaSubFamilia');

  return await dbo.collection("SubFamilia").insertOne({
    "subFamiliaId":id,
    "nombreSubFamilia": query.nombreSubFamilia,
    "FamiliaId":query.idFamilia
  })
}

async function getNextSequenceValue(dbo,sequenceName){

  return new Promise((resolve, reject) => {
    var document = dbo.collection("Secuencias").findOneAndUpdate(
      {_id: sequenceName},
      {
        $inc: {
        sequence_value:1
        }
      }
    ).then(function(result){
      resolve(result.value.sequence_value);
    })
  });
}

async function ConsultarFamilias(query){
  var mongoClient = require('mongodb').MongoClient;
  try
  {
    var client = await crearConexion(mongoClient);
    return await obtenerFamilias(client,query);
  }
  catch(e)
  {
    console.error(e);
  }
  finally
  {
    await client.close();
  }
}

async function obtenerFamilias(client,query){

  var dbo = client.db("Tienda"+query.tienda);

  return new Promise((resolve, reject) => {
    dbo.collection("Familia").find().sort({nombreFamilia:1}).toArray()
    .then(async function(result){
      await resolve(result);
    });
  });
}

async function ConsultarSubFamilias(query){
  var mongoClient = require('mongodb').MongoClient;
  try
  {
    var client = await crearConexion(mongoClient);
    return await obtenerSubFamilias(client,query);
  }
  catch(e)
  {
    console.error(e);
  }
  finally
  {
    await client.close();
  }
}

async function obtenerSubFamilias(client,query){

  var dbo = client.db("Tienda"+query.tienda);

  var query2 = {FamiliaId: parseInt(query.subFamiliaId)}

  return new Promise((resolve, reject) => {
    dbo.collection("SubFamilia").find(query2).sort({nombreSubFamilia:1}).toArray()
    .then(async function(result){
      console.log(result);
      await resolve(result);
    });
  });
}
  

module.exports = {
    insertarBoton: insertarBoton,
    leerBotones: leerBotones,
    guardarArticulo: guardarArticulo,
    nuevaBaseDeDatos: nuevaBaseDeDatos,
    obtenerInventario: obtenerInventario,
    agregarFamilia: agregarFamilia,
    agregarSubFamilia: agregarSubFamilia,
    ConsultarFamilias: ConsultarFamilias,
    ConsultarSubFamilias: ConsultarSubFamilias
}


