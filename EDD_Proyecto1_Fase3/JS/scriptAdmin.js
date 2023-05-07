import { ArbolAvl } from "./ArbolAVL/arbol.js";
import HashTable from "./TablaHash/HashTable.js";
import { nodoEstudiante } from "./TablaHash/Nodos.js";

const botonCarga = document.querySelector("#btnCarga");
const botonCerrar = document.querySelector("#btnCerrarSesion");
const tablaEstudiantes = document.querySelector("#tablaEstudiantes");
const tablaPermisos = document.querySelector("#tablaPermisos");
const btnMensajes = document.querySelector('#btnMensajes');
let bloque = null
//const botonMostrar = document.querySelector("#btnMostrar");
//const botonRecorrido = document.querySelector("#btnRecorrido");

document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("isLoggedIn") == "false") {
    location.href = "index.html";
  }
  if (localStorage.getItem("tablaHash")) {
    mostrarEstudiantes(JSON.parse(localStorage.getItem("tablaHash")));
    mostrarPermisos(JSON.parse(localStorage.getItem("tablaHash")))
  }
  if (localStorage.getItem("blockchain") != null) {
    bloque = JSON.parse(localStorage.getItem("blockchain"))
  }
  e.stopPropagation();
});

botonCarga.addEventListener("click", cargarArchivo);
async function cargarArchivo(e) {
  e.preventDefault();
  e.stopPropagation();
  // obtener los datos del json
  const archivo = document.getElementById("archivosJson").files[0];
  if (archivo == null) {
    alert("Seleccione un archivo");
    return;
  }
  let nuevoArbol = new ArbolAvl();
  let users = new HashTable(7);
  let estudiantes = JSON.parse(await readFile(archivo));
  //agregamos los datos al arbol
  if (estudiantes.Alumnos != undefined) {
    estudiantes.Alumnos.forEach((element) => {
      nuevoArbol.agregar(
        element.Nombre || element.nombre,
        element.Pass || element.pass,
        element.Carnet || element.carnet
      );
      users.set(element.carnet, element);
    });
  } else if (estudiantes.alumnos != undefined) {
    estudiantes.alumnos.forEach((element) => {
      nuevoArbol.agregar(
        element.Nombre || element.nombre,
        element.Pass || element.pass,
        element.Carnet || element.carnet
      );
      let nuevo = new nodoEstudiante(
        element.Nombre || element.nombre,
        element.Pass || element.pass,
        element.Carnet || element.carnet
      );
      //console.log(typeof(element.carnet))
      users.set(element.carnet, nuevo);
    });
  } else {
    console.log("Hubo un error con el archivo: atributos no encontrados");
    return;
  }
  localStorage.setItem("tablaHash", JSON.stringify(users));
  localStorage.setItem("arbol", JSON.stringify(nuevoArbol));
  mostrarEstudiantes(users);
  console.log(nuevoArbol);
  console.log(users);
  /*//motrar el recorrido in-orden en la tabla
  let filas = document.querySelector("#datos");
  filas.innerHTML = recorridoInOrden(nuevoArbol.raiz);
  console.log("Archivo cargado con éxito");*/
}

botonCerrar.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  localStorage.setItem("isLoggedIn", "false");
  location.href = "index.html";
});

btnMensajes.addEventListener("click", (e) => {
  e.preventDefault();
  if (bloque == null) {
    alert("No hay mensajes en el sistema")
    return
  }
  document.getElementById("textMensajes").value = ""
  let bloque_actual = bloque.inicio
  while (bloque_actual != null) {
    reporteMensajes(bloque_actual)
    bloque_actual = bloque_actual.siguiente
  }
  let texto = `digraph prueba{
    fontname="Helvetica,Arial,sans-serif"
    node [fontname="Helvetica,Arial,sans-serif", shape=box]
    edge [fontname="Helvetica,Arial,sans-serif"]\n`;
  let i = 0;
  let conexion = "";
  bloque_actual = bloque.inicio
  while (bloque_actual != null) {
    texto += `${i}[label= "TimeStamp: ${bloque_actual.valor['timestamp']}\\nEmisor: ${bloque_actual.valor['transmitter']}\\nReceptor: ${bloque_actual.valor['receiver']}\\nPreviousHash: ${bloque_actual.valor['previoushash']}"];\n`;
    conexion += "" + i;
    bloque_actual = bloque_actual.siguiente;
    if (bloque_actual == null) {
      break;
    }
    conexion += " -> ";
    i++;
  }
  texto += conexion + "\n}";
  let codificada = encodeURIComponent(texto);
  window.open(`https://quickchart.io/graphviz?graph=${codificada}`, "_blank");
  console.log(texto);
  e.stopPropagation();
});

function reporteMensajes(bloque_actual) {
  if (bloque_actual != null) {
    let cadena = "Index: " + bloque_actual.valor['index']
    cadena += "\nTimeStamp: " + bloque_actual.valor['timestamp']
    cadena += "\nEmisor: " + bloque_actual.valor['transmitter']
    cadena += "\nReceptor: " + bloque_actual.valor['receiver']
    cadena += "\nMensaje: " + bloque_actual.valor['message']
    cadena += "\nPreviousHash: " + bloque_actual.valor['previoushash']
    cadena += "\nHash: " + bloque_actual.valor['hash']
    document.getElementById("textMensajes").value += cadena + "\n------------------------------------------------------------------------------------------\n"
  }
}

function mostrarEstudiantes(users) {
  if (!users) {
    return
  }
  for (let i = 0; i < users.data.length; i++) {
    if (users.data[i]) {
      let tr = document.createElement("tr");
      let tdCarnet = document.createElement("td");
      let tdNombre = document.createElement("td");
      let tdPassword = document.createElement("td");

      tdCarnet.innerHTML = users.data[i].carnet;
      tdNombre.innerHTML = users.data[i].nombre;
      tdPassword.innerHTML = users.data[i].passEncriptado;

      tr.appendChild(tdCarnet);
      tr.appendChild(tdNombre);
      tr.appendChild(tdPassword);

      tablaEstudiantes.appendChild(tr);
    }
  }
}

function mostrarPermisos(users) {
  if (!users) {
    return
  }
  for (let i = 0; i < users.data.length; i++) {
    if (users.data[i]) {
      let tr = document.createElement("tr");
      let tdPropietario = document.createElement("td");
      tdPropietario.innerHTML = users.data[i].carnet;
      tr.appendChild(tdPropietario);
      let nombreCarpeta = "/"
      recorrerCarpetas(users.data[i].carpetaRaiz, tr, nombreCarpeta)
    }
  }
}

function recorrerCarpetas(nodo, tr, nombreCarpeta) {
  //para recorrer cada archivo de la carpeta actual
  for (const archivos of nodo.archivos) {
    //para recorrer cada permiso
    let tdArchivo = document.createElement("td");
    tdArchivo.innerHTML = archivos.nombre;
    let aux = archivos.primero;
    while (aux != null) {
      let tdDestino = document.createElement("td");
      let tdPermiso = document.createElement("td");
      let tdUbicacion = document.createElement("td")
      tdDestino.innerHTML = aux.columna;
      tdPermiso.innerHTML = aux.nombre;
      tdUbicacion.innerHTML = nombreCarpeta
      tr.appendChild(tdDestino);
      tr.appendChild(tdUbicacion);
      tr.appendChild(tdArchivo);
      tr.appendChild(tdPermiso);

      tablaPermisos.appendChild(tr);
      let trNuevo = document.createElement("tr");
      let tdNuevo = document.createElement("td")
      tdNuevo.innerHTML = tr.firstElementChild.childNodes[0].data
      trNuevo.appendChild(tdNuevo);
      console.log(tr)
      tr = trNuevo
      console.log(tr)
      aux = aux.siguiente;
    }
  }
  for (const key in nodo.carpetas) {
    nombreCarpeta += nodo.carpetas[key].nombre + "/"
    recorrerCarpetas(nodo.carpetas[key], tr, nombreCarpeta);
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      resolve(fileContent);
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsText(file);
  });
}

/*
  botonMostrar.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  let arbol = JSON.parse(localStorage.getItem("arbol"));
  if (arbol.raiz == null) {
    alert("Cargue un archivo");
    return;
  }
  let cabeza = `digraph prueba{
    fontname="Helvetica,Arial,sans-serif"
    node [fontname="Helvetica,Arial,sans-serif", shape=box]
    edge [fontname="Helvetica,Arial,sans-serif"]\n`;
  cabeza += mostrarArbol(arbol.raiz);
  cabeza += "}";
  let imagen = document.getElementById("contenedorImagen");
  imagen.innerHTML = `<h2 id="unMensaje">Arbol de estudiantes</h2>
  <img src="" alt="unMensaje" class="img-fluid align-items-center" id="image">`;
  let archivo = document.getElementById("image");
  let codificada = encodeURIComponent(cabeza);
  archivo.src = `https://quickchart.io/graphviz?graph=${codificada}`;
  console.log(cabeza);
});
*/

/*
botonRecorrido.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  let arbol = JSON.parse(localStorage.getItem("arbol"));
  if (arbol.raiz == null) {
    alert("Cargue un archivo");
    return;
  }
  let opcion = document.getElementById("opcion").value;
  let filas = document.querySelector("#datos");
  switch (opcion) {
    case "0":
      filas.innerHTML = recorridoInOrden(arbol.raiz);
      break;
    case "1":
      filas.innerHTML = recorridoPostOrden(arbol.raiz);
      break;
    case "2":
      filas.innerHTML = recorridoPreOrden(arbol.raiz);
      break;
    default:
      alert("Escoge un recorrido");
      break;
  }
});
*/

function mostrarArbol(nodo) {
  let cuerpo = "";
  if (nodo != null) {
    cuerpo += `${nodo.carnet}[label="${nodo.carnet}\\n${nodo.nombre}\\nAltura: ${nodo.altura}"]; \n`;
    if (nodo.izquierdo != null) {
      cuerpo += nodo.carnet + " -> " + nodo.izquierdo.carnet + ";\n";
      cuerpo += mostrarArbol(nodo.izquierdo);
    }
    if (nodo.derecho != null) {
      cuerpo += nodo.carnet + " -> " + nodo.derecho.carnet + ";\n";
      cuerpo += mostrarArbol(nodo.derecho);
    }
  }
  return cuerpo;
}

function recorridoInOrden(nodo) {
  let data = "";
  if (nodo != null) {
    if (nodo.izquierdo != null) {
      data += recorridoInOrden(nodo.izquierdo);
    }
    data += `<tr>
          <th scope="row">${nodo.carnet}</th>
          <td>${nodo.nombre}</td>
      </tr>
      `;
    if (nodo.derecho != null) {
      data += recorridoInOrden(nodo.derecho);
    }
  }
  return data;
}

function recorridoPostOrden(nodo) {
  let data = "";
  if (nodo != null) {
    if (nodo.izquierdo != null) {
      data += recorridoPostOrden(nodo.izquierdo);
    }

    if (nodo.derecho != null) {
      data += recorridoPostOrden(nodo.derecho);
    }
    data += `<tr>
      <th scope="row">${nodo.carnet}</th>
      <td>${nodo.nombre}</td>
        </tr>
    `;
  }
  return data;
}

function recorridoPreOrden(nodo) {
  let data = "";
  if (nodo != null) {
    data += `<tr>
        <th scope="row">${nodo.carnet}</th>
        <td>${nodo.nombre}</td>
          </tr>
      `;
    if (nodo.izquierdo != null) {
      data += recorridoPreOrden(nodo.izquierdo);
    }

    if (nodo.derecho != null) {
      data += recorridoPreOrden(nodo.derecho);
    }
  }
  return data;
}
