var audio = document.createElement('audio');
var contador = 0;
var botonHanamaru = 0;
var botonYoshiko = 0;

/*
setTimeout(function() {
  generarMovimientos();
}, 1000);
*/
function btnSonidoHanamaru() {
  procesarBtn('sonidos/mirai_zura.mp3','kunikida_hanamaru');
}

function btnSonidoYoshiko() {
  procesarBtn('sonidos/yohane.mp3','tsushima_yoshiko');
}

function btnAgregarArticuloAlInventario() {
  var articuloID = parseInt(document.getElementById("idArticulo").value);
  var articuloNom = document.getElementById("nombreArticulo").value;
  var articuloCos = Number(document.getElementById("costoArticulo").value);
  var articuloCan = parseInt(document.getElementById("cantidadArticulo").value);
  var articuloPre = Number(document.getElementById("precioArticulo").value);
  var articuloFam = parseInt(3);//document.getElementById("familiaArticulo").value;

  var articulo = {
    idArticulo: articuloID,
    nombreArticulo: articuloNom,
    costoArticulo: articuloCos,
    cantidadArticulo: articuloCan,
    precioArticulo: articuloPre,
    familiaArticulo: articuloFam
  }
  agregarArticuloInventario(articulo);
}

async function procesarBtn(sonido,nombre) {
  audio.src = sonido;
  await audio.play();
  
  mongoPrueba(nombre); 
  //generarImagenCarrusel(nombre);
}

function mongoPrueba(str) {
  var user = {
    boton: str
  };
  
  $.ajax({
    type: 'GET',
    url: '/perraco',
    data: user,
    sucess: function(data) {
    }
  });
}

async function obtenerBotones() {
  return new Promise(resolve => {
  
    $.ajax({
      type: 'GET',
      url: '/obtenerBotones',
    }).done(function( data) {
      resolve(data);
    })
  
  });
}

async function generarMovimientos() {
  var resultado = await obtenerBotones();
  
  if(botonHanamaru == 0 || botonYoshiko == 0)
  {
    botonHanamaru = resultado[0].contador;
    botonYoshiko = resultado[1].contador;
    
    setTimeout(function() {
      generarMovimientos();
    }, 2000);
  }
  else
  {
    var diferenciaHanamaru = resultado[0].contador - botonHanamaru;
    var diferenciaYoshiko = resultado[1].contador - botonYoshiko;
    
    do
    {
      
      if(diferenciaHanamaru > 0)
      {        await new Promise(resolve => setTimeout(resolve, 300));
        generarImagenCarrusel('kunikida_hanamaru');
        diferenciaHanamaru--;
      }
      
      if(diferenciaYoshiko > 0)
      {        await new Promise(resolve => setTimeout(resolve, 300));
        generarImagenCarrusel('tsushima_yoshiko');
        diferenciaYoshiko--;
      }
      
    }while((diferenciaHanamaru+diferenciaYoshiko) > 0);
    
    botonHanamaru = resultado[0].contador;
    botonYoshiko = resultado[1].contador;
    
    setTimeout(function() {
      generarMovimientos();
    }, 2000);
    
  }  
}

function generarImagenCarrusel(nombre) {
  var nombreDiv = 'div'+contador++;
  var div = document.createElement('div');
  var classDiv = document.getElementById("carrusel");
  div.setAttribute("id", nombreDiv);
  div.setAttribute("class", nombre);
  classDiv.appendChild(div);
  var elem = document.getElementById(nombreDiv);   
  var pos = 0;
  var id = setInterval(frame, 3);
  function frame() {
    if (pos >= window.innerWidth-150) {
      clearInterval(id);
      classDiv.removeChild(classDiv.childNodes[1]);
    } else {
      pos++; 
      elem.style.left = pos + 'px'; 
    }
  }
}

function agregarArticuloInventario(articulo){  
  $.ajax({
    type: 'GET',
    url: '/guardarArticulo',
    data: articulo,
    sucess: function(data) {
    }
  }); 
}


