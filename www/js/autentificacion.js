
function Login(){
  var datosUsuario = $('#nombredeusuario').val()
  var datosPassword = $('#clave').val()

  var WSurl = 'http://serviciosnullpointer.azurewebsites.net/WSCliente.svc/autenticacion?correo='+datosUsuario+'&contr='+datosPassword;

  var req = $.ajax({
    url: WSurl,
    timeout: 1000,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {Inicio(datos)},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });
  return false;
}
//informacion de incio
function Inicio(datos)
{
  $.mobile.changePage("#home")
  var nombre = datos[0]._nombre;

  $('#correoS').attr("value", datos[0]._correo);
  $('#nombreS').attr("value", datos[0]._nombre);
  $('#direcciondeusuarioS').attr("value", datos[0]._direccion);
  $('#claveS').attr("value", 	$('#clave').val());

  $('#usuario-home').append(nombre);
  $('#usuario-carrito').append(nombre);
  $('#usuario-pedido').append(nombre);

  var WSurl2 = 'http://serviciosnullpointer.azurewebsites.net/WSPlato.svc/buscar?nombre=';

  var req = $.ajax({
    url: WSurl2,
    timeout: 1000,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {ProcesarPlatos(datos)},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });

  var correo = $('#correoS').val()
  var WSurl3 = 'http://serviciosnullpointer.azurewebsites.net/WSPedido.svc/PedidoActual?correo=' + correo;

  var req1 = $.ajax({
    url: WSurl3,
    timeout: 1000,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {cargarPedido(datos)},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });
}
//carga platos del pedido
function cargarPedido(datos) {
  var total = datos[0]._total+ "";
  $('#noe').empty()
  $('#TotalS').attr("value", total);

  $.each(datos[0]._lista,function(){

    var nuevoA = document.createElement("a");
    var id = this._codigo;
    nuevoA.href = "#home"
    nuevoA.setAttribute("id", id);
    nuevoA.setAttribute("onclick", "eliminarPlato(this.id)");
    nuevoA.innerHTML = this._nombre + " $" + this._precio;

    var newli = document.createElement("li");
    newli.appendChild(nuevoA);
    $('#noe').append(newli);
  });
  $('#noe').listview("refresh");
}
//carga el pedido actual
function cargarActual(){
  var correo = $('#correoS').val()
  var WSurl3 = 'http://serviciosnullpointer.azurewebsites.net/WSPedido.svc/PedidoActual?correo=' + correo;

  var req1 = $.ajax({
    url: WSurl3,
    timeout: 1000,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {cargarPedido(datos)},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });

}
//anula el pedido que estaba creando
function anular() {
  var correo = $('#correoS').val()
  var WSurl3 = 'http://serviciosnullpointer.azurewebsites.net/WSPedido.svc/AnularPedido?correo=' + correo;
  var req1 = $.ajax({
    url: WSurl3,
    timeout: 3000,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {test()},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });
}

function test() {
  cargarActual();
}
//elimina el plato selccionado
function eliminarPlato (id) {
  var correo = $('#correoS').val()

  var WSurl3 = 'http://serviciosnullpointer.azurewebsites.net/WSPedido.svc/ModificarPedido?correo=' + correo + '&plato=' + id;

  var req1 = $.ajax({
    url: WSurl3,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {platoEliminado()},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });
} 
//luego de eliminar lo carga el pedido
function platoEliminado(){ 
  cargarActual();
}
//mensaje error
function MensajeError(x, t, m)
{
  $.mobile.changePage("#pagetwo")
}

function agregarPlato() {
  var mail = $('#correoS').val()
  var plato = $('#codigoPlato').val()
  var WSurlf = 'http://serviciosnullpointer.azurewebsites.net/WSPedido.svc/AgregarPlato?correo=' + mail + "&plato= " + plato;

  var req = $.ajax({
    url: WSurlf,
    contentType: 'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {test()},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });

  location.href= "#shop"
}

function ProcesarPlatos(datos) {

  $('#platos-home').empty()

  $.each(datos,function() {

    var nuevoA = document.createElement("a");
    var ref = "http://serviciosnullpointer.azurewebsites.net/WSPlato.svc/buscar?nombre=" + this._nombre;
    nuevoA.href = "#platos"
    nuevoA.setAttribute("id", ref);
    nuevoA.setAttribute("onclick", "cargarPlatos(this.id)");
    nuevoA.innerHTML = this._nombre + " $" + this._precio;

    var newli = document.createElement("li");
    newli.appendChild(nuevoA);
    $('#platos-home').append(newli);
  });
  $('#platos-home').listview("refresh");
}

function cargarPlatos(id){
  var wsurl3 = id;

  var req= $.ajax({
    url: wsurl3,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",

    success: function(datos){MostrarPlato(datos)}

  });
}

function MostrarPlato(datos){
  $('#codigoPlato').attr("value", datos[0]._codigo)
  $('#nombrePlato').attr("value", datos[0]._nombre);
  $('#precioPlato').attr("value", datos[0]._precio);
  $('#descPlato').attr("value", datos[0]._descripcion);
  var foto = "http://nullpointerrest.azurewebsites.net" + datos[0]._image;
  alert(foto);
  var fp =  document.getElementById("fotoPlato");
  fp.src = foto;
  //$('#fotoPlato').attr("value", foto);

  }

$('#registrarse').submit(function() {

  var datosUsuario = $("#nombreR").val()
  var datosPassword = $("#claveR").val()
  var datosDireccion = $("#direcciondeusuario").val()
  var datosCorreo = $("#correoR").val()

  var WSurl = 'http://serviciosnullpointer.azurewebsites.net/WSCliente.svc/registro?corr='+datosCorreo+'&nom='+datosUsuario + '&dirr=' + datosDireccion + '&contr=' + datosPassword;

  var req = $.ajax({
    url: WSurl,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {Inicio(datos)},
    error: function(x, t, m) {MensajeError(x, t, m)}
  });
  return false;
})

$('#modificar').submit(function() {

  var datosUsuario = $("#nombreR").val()
  var datosPassword = $("#claveR").val()
  var datosDireccion = $("#direcciondeusuario").val()

  //usar el WS para validar usuarios. Hacerle un update a los datos.

  $.mobile.changePage("#home")

  return false;
})

function confirmar() {
  var mail = $('#correoS').val()
  var urlt = 'http://serviciosnullpointer.azurewebsites.net/WSPedido.svc/ConfirmarPedido?correo=' + mail;
  alert("" + urlt);
  var req =  $.ajax({
    url: urlt,
    contentType:'text/json; charset:UTF-8',
    dataType: "jsonp",
    success: function(datos) {test()},
    error: function(x, t, m) {MensajeError(x, t, m)}

  });
  
}

$('#VerPlatos').submit(function() {

  var datosPlato = $("#nombrePlato").val()

  //usar el WS para validar usuarios. Hacerle un update a los datos.

  $.mobile.changePage("#agregarM")


  return false;
})

function cerrarSesion() {

  $.mobile.changePage("#sesion")
}

function CancelarPedido() {
  $.mobile.changePage("#CancelarPedido")
}