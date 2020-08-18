const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const multer = require("multer");

const app = new express();
console.log('I am running!');

app.use('/scripts', express.static('./scripts/'));
app.use(express.static("public"));
app.use(favicon(__dirname + '/favicon.ico'));

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var mongoScript = require('./scripts/mongo.js');


var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images"); //here we specify the destination. in this case i specified the current directory
  },
  filename: function(req, file, cb) {
    console.log(file); //log the file object info in console
    cb(null, file.originalname);//here we specify the file saving name. in this case. 
//i specified the original file name .you can modify this name to anything you want
  }
});

var uploadDisk = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'views/index.html'));
});

app.post("/subirImagen", uploadDisk.single("image"), (req, res) => {
  console.log(" file disk uploaded");
  res.send("file disk upload success");
});


app.get('/perraco', (req, res) => {
  res.send('');
  mongoScript.insertarBoton(req.query.boton);
});

app.get('/obtenerBotones', async (req, res) => {
  var resultado = await mongoScript.leerBotones();
  await res.send(resultado);
});

app.get('/guardarArticulo', (req, res) => {
  
  res.send("");
  mongoScript.guardarArticulo(req.query);
  //var resultado = await guardarArticulo();
  //await res.send(resultado);
});

app.get('/crearBaseDeDatos', (req, res) => {
  res.send("");
  mongoScript.nuevaBaseDeDatos(req.query.nombreDataBase, req.query.nombreTabla);
  //mongoScript.nuevaBaseDeDatos('Imagenes','Imagenes');

});

app.get('/obtenerInventario', async (req, res) => {
  console.info(req.query);
  var resultado = await mongoScript.obtenerInventario(req.query);
  await res.send(resultado);
});

app.get('/crearBaseDeDatos', (req, res) => {
  res.send("");  
  mongoScript.nuevaBaseDeDatos('Imagenes','Imagenes');
});

app.listen(4000, () => {
});

