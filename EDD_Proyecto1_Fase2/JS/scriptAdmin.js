import { nodoEstudiante, ArbolAvl } from "./arbol.js";

document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("isLoggedIn") == "false") {
    location.href = "index.html";
  }
  e.stopPropagation();
});

let botonCarga = document.querySelector("#btnCarga");
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
  // creamos un nuevo arbol
  let nuevoArbol = new ArbolAvl();
  let estudiantes = JSON.parse(await readFile(archivo));
  //agregamos los datos al arbol
  estudiantes.Alumnos.forEach((element) => {
    nuevoArbol.agregarUno(element.Nombre, element.Pass, element.Carnet);
  });
  localStorage.setItem("arbol", JSON.stringify(nuevoArbol));
  //motrar el recorrido in-orden en la tabla
  let filas = document.querySelector("#datos");
  //filas.innerHTML = nuevoArbol.inOrden();
  alert("Archivo cargado con éxito");
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

let botonMostrar = document.querySelector("#btnMostrar");
botonMostrar.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  let arbol = JSON.parse(localStorage.getItem("arbol"));
  if (arbol.raiz == null) {
    alert("Cargue un archivo");
    return;
  }
  let cabeza = `graph prueba{
    fontname="Helvetica,Arial,sans-serif"
    node [fontname="Helvetica,Arial,sans-serif"]
    edge [fontname="Helvetica,Arial,sans-serif"]\n`;
  cabeza += mostrarArbol(arbol.raiz);
  cabeza += "}";
  let imagen = document.getElementById("contenedorImagen");
  imagen.innerHTML = `<h2 id="unMensaje">Arbol de estudiantes</h2>
  <img src="" alt="unMensaje" id="image">`;
  document.getElementById("image").src = 'https://quickchart.io/graphviz?graph=' + cabeza;
  console.log(cabeza);
});

function mostrarArbol(nodo) {
  let cuerpo = "";
  if (nodo != null) {
    cuerpo += `${nodo.carnet}[label="${nodo.carnet}\\n${nodo.nombre}\\nAltura: ${nodo.altura}"]; \n`;
    if (nodo.izquierdo != null) {
      cuerpo += nodo.carnet + " -- " + nodo.izquierdo.carnet + ";\n";
      cuerpo += mostrarArbol(nodo.izquierdo);
    }
    if (nodo.derecho != null) {
      cuerpo += nodo.carnet + " -- " + nodo.derecho.carnet + ";\n";
      cuerpo += mostrarArbol(nodo.derecho);
    }
  }
  return cuerpo;
}
