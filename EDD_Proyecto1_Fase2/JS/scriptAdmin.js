import {ArbolAvl } from "./arbol.js";

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
    nuevoArbol.agregar(element.Nombre, element.Pass, element.Carnet);
  });
  localStorage.setItem("arbol", JSON.stringify(nuevoArbol));

  //motrar el recorrido in-orden en la tabla
  let filas = document.querySelector("#datos");
  filas.innerHTML = recorridoInOrden(nuevoArbol.raiz);
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
  <img src="" alt="unMensaje" class="img-fluid align-items-center" id="image">`;
  let archivo = document.getElementById("image");
  archivo.src = "https://quickchart.io/graphviz?graph=" + cabeza;
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

let botonRecorrido = document.querySelector("#btnRecorrido");
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

let botonCerrar = document.querySelector("#btnCerrarSesion");
botonCerrar.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("isLoggedIn", "false")
    location.href = "index.html"
});