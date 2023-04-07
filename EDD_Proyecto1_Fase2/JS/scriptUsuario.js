import { NodoArchivos, nodoCarpeta, NodoPermiso } from "./arbol.js";

let carpetaActual = null;
let carpetaRaiz = null;
let arbol = null;

document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("isLoggedIn") == "false") {
    location.href = "index.html";
    return;
  }
  let carnet = localStorage.getItem("carnet");
  document.getElementById("h2Carnet").innerHTML = carnet;
  arbol = JSON.parse(localStorage.getItem("arbol"));

  document.getElementById("selectCarnet").innerHTML =
    `<option value="0" selected>Escoge el carnet del usuario</option>` +
    cargarCarnets(arbol.raiz, parseInt(carnet));
  /*carpetaRaiz = buscar(
    parseInt(carnet),
    arbol.raiz
  ).carpetaRaiz;*/
  //console.log(carpetaRaiz);
  //carpetaActual es una variable auxiliar para no buscar cuando se agrege algo
  carpetaActual = carpetaRaiz;
  mostrarContenidoCarpeta(carpetaActual);
  //console.log(arbol)
  e.stopPropagation();
});

function cargarCarnets(nodo, carnet) {
  let data = "";
  if (nodo != null) {
    if (nodo.carnet != carnet) {
      data += `<option value="${nodo.carnet}">${nodo.carnet} ${nodo.nombre} </option>`;
    } else {
      carpetaRaiz = nodo.carpetaRaiz;
    }
    if (nodo.izquierdo != null) {
      data += cargarCarnets(nodo.izquierdo, carnet);
    }

    if (nodo.derecho != null) {
      data += cargarCarnets(nodo.derecho, carnet);
    }
  }
  return data;
}

//cerrar sesión
let btnCerrar = document.querySelector("#btnCerrar");
btnCerrar.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("isLoggedIn", "false");
  localStorage.setItem("arbol", JSON.stringify(arbol));
  location.href = "index.html";
  e.stopPropagation();
});

let btnCrearCarpeta = document.querySelector("#btnCrear");
btnCrearCarpeta.addEventListener("click", (e) => {
  e.preventDefault();
  let nombreNuevo = document.getElementById("nombreCarpeta").value;
  if (nombreNuevo == "") {
    alert("Ingresa un nombre");
    return;
  }
  for (const carpeta of carpetaActual.carpetas) {
    if (carpeta.nombre == nombreNuevo) {
      carpeta.copia += 1;
      nombreNuevo += carpeta.copia.toString();
    }
  }
  let nuevoCarpeta = new nodoCarpeta(nombreNuevo);
  carpetaActual.carpetas.push(nuevoCarpeta);
  mostrarContenidoCarpeta(carpetaActual);
  localStorage.setItem("arbol", JSON.stringify(arbol));
  e.stopPropagation();
});

let btnEliminar = document.querySelector("#btnEliminar");
btnEliminar.addEventListener("click", (e) => {
  let nombre = document.getElementById("nombreEliminar").value;
  if (nombre == "") {
    alert("Escribe un nombre");
    return;
  }
  let existe = false;
  for (const key in carpetaActual.carpetas) {
    if (carpetaActual.carpetas[key].nombre == nombre) {
      carpetaActual.carpetas.splice(key, 1);
      existe = true;
      break;
    }
  }
  if (!existe) {
    alert("La carpeta no existe");
  }
  mostrarContenidoCarpeta(carpetaActual);
  localStorage.setItem("arbol", JSON.stringify(arbol));
});

function mostrarContenidoCarpeta(carpeta) {
  let contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";
  if (carpeta.carpetas.length != 0) {
    for (const iterator of carpeta.carpetas) {
      contenedor.innerHTML += `<div class="col">
            <div class="card">
                <img src="img/carpeta.png" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${iterator.nombre}</h5>
                </div>
            </div>
        </div>`;
    }
  }
  let selectArchivos = document.getElementById("selectArchivos");
  selectArchivos.innerHTML = `<option value="0" selected>Escoge el archivo de la carpeta actual (vacío si no hay archivos)</option>`;
  if (carpeta.archivos.length != 0) {
    for (const iterator of carpeta.archivos) {
      selectArchivos.innerHTML += `<option value="${iterator.id}">${iterator.nombre} </option>`;
      contenedor.innerHTML += `<div class="col">
            <div class="card">
                <img src="img/tipo.png" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${iterator.nombre}</h5>
                </div>
            </div>
        </div>`;
    }
  }
}

let btnBuscar = document.querySelector("#btnBuscar");
btnBuscar.addEventListener("click", (e) => {
  e.preventDefault();
  let directorio = document.getElementById("directorio").value;
  let directorios = directorio.split("/");
  if (directorio == "" || directorios[1] == "") {
    //agregar carpeta a la raiz
    carpetaActual = carpetaRaiz;
  } else {
    //recorrer todos los nombres de los vectores
    let auxiliar = carpetaRaiz;
    for (let index = 1, fin = directorios.length; index < fin; index++) {
      auxiliar = buscarCarpeta(directorios[index], auxiliar);
      if (auxiliar == null) {
        alert("El directorio no es valido");
        return;
      }
    }
    carpetaActual = auxiliar;
  }
  mostrarContenidoCarpeta(carpetaActual);
  e.stopPropagation();
});

function buscarCarpeta(nombre, nodo) {
  for (const carpeta of nodo.carpetas) {
    if (carpeta.nombre == nombre) {
      return carpeta;
    }
  }
  return null;
}

const inputArchivos = document.querySelector("#subirArchivos");
inputArchivos.addEventListener("change", (e) => {
  e.preventDefault();
  const archivoNuevo = inputArchivos.files[0];
  if (archivoNuevo == null) {
    alert("Seleccione un archivo");
    return;
  }
  let nombre = archivoNuevo.name;
  for (const archivo of carpetaActual.archivos) {
    if (archivo.nombre == nombre) {
      archivo.copia += 1;
      nombre =
        nombre.substring(0, nombre.length - 4) +
        archivo.copia.toString() +
        nombre.substring(nombre.length - 4);
    }
  }
  console.log(nombre);
  let fileread = new FileReader();
  fileread.readAsDataURL(archivoNuevo);
  fileread.onloadend = () => {
    let content = fileread.result.split(",")[1];
    //console.log(content)
    let nuevoArchivo = new NodoArchivos(nombre, content);
    carpetaActual.archivos.push(nuevoArchivo);
    inputArchivos.value = "";
    mostrarContenidoCarpeta(carpetaActual);
    localStorage.setItem("arbol", JSON.stringify(arbol));
    e.stopPropagation();
  };
});

const btnCarpetas = document.querySelector("#btnCarpetas");
btnCarpetas.addEventListener("click", (e) => {
  e.preventDefault();
  let cabeza = `digraph prueba{
        fontname="Helvetica,Arial,sans-serif"
        node [fontname="Helvetica,Arial,sans-serif", shape=box]
        edge [fontname="Helvetica,Arial,sans-serif"]\n`;
  cabeza += reporteCarpetas(carpetaRaiz);
  cabeza += "}";
  window.open(`https://quickchart.io/graphviz?graph=${cabeza}`, "_blank");
  e.stopPropagation();
});

function reporteCarpetas(nodo) {
  let contenido = `"${nodo.id}"[label= "${nodo.nombre}"];\n`;
  for (const key in nodo.carpetas) {
    //console.log(nodo.carpetas[key].nombre)
    contenido += reporteCarpetas(nodo.carpetas[key]);
    contenido += `"${nodo.id}" -> "${nodo.carpetas[key].id}"\n`;
  }
  return contenido;
}

const btnReporteArchivos = document.querySelector("#btnArchivos");
btnReporteArchivos.addEventListener("click", (e) => {
  e.preventDefault();
  let cantidadArchivos = carpetaActual.archivos.length
  if (cantidadArchivos == 0) {
    alert("No se puede crear la matriz por falta de archivos");
    return;
  }
  let columnas = []
  let texto = `digraph matriz {
    node [shape=box]
    edge [dir=both, arrowsize= 0.6]
    /* este es el nodo principal y lo pones en el grupo 1 para que se muestre como el origen de un todo */
    mt[ label = "${carpetaActual.nombre}", width = 1.5, style = filled, fillcolor = firebrick1];
    /* esto no se elimina, es para evitar el posicionamiento a lo loco */
    e0[ shape = point, width = 0 ];
    e1[ shape = point, width = 0 ];`
  let conexionColumnas = "mt "
  let conexionfila = "mt "
  let rankColumna = "{ rank = same; mt;"
  let rankFilas = "{ rank = same;"
  let conexionColumnaVertical = []
  let conexionNodo = ""
  console.log(carpetaActual.archivos)
  for (const iterator of carpetaActual.archivos) {
    let key = iterator.nombre.substring(iterator.nombre.length - 3);
    let url = "";
    switch (key) {
      case "pdf":
        url = URL.createObjectURL(
          abrirArchivo(iterator.informacion, "application/pdf")
        );
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
        break;
      case "txt":
        url = URL.createObjectURL(
          abrirArchivo(iterator.informacion, "text/plain")
        );
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
        break;
      default: // es imagen
        url = URL.createObjectURL(
          abrirArchivo(iterator.informacion, "image/" + key)
        );
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
        break;
    }
    texto += `${iterator.id} [label = "${iterator.nombre}" width = 1.5 style = filled, fillcolor = bisque1, group = 1 ];\n`
    conexionNodo += "\n" + iterator.id
    conexionfila += `-> ${iterator.id}`
    rankFilas += "" + iterator.id + ";"
    let aux = iterator.primero
    while (aux != null) {
      let existe = columnas.findIndex((e) => aux.columna == e)
      let largo = existe == -1 ? columnas.push(aux.columna) + 1 : existe + 2 
      texto += `${aux.id}[label = "${aux.nombre}"  width = 1.5 style = filled, fillcolor = lightskyblue, group = ${largo} ];\n`
      conexionNodo += ` -> ${aux.id}`
      rankFilas += "" + aux.id + ";"
      if (existe == -1) {
        texto += `${aux.columna}[label = "${aux.columna}"  width = 1.5 style = filled, fillcolor = lightskyblue, group = ${largo} ];\n`
        rankColumna += "" + aux.columna + ";"
        conexionColumnas += " -> " + aux.columna
        conexionColumnaVertical.push(`${aux.columna} -> ${aux.id}`)  
      }else {
        console.log(existe-1)
        conexionColumnaVertical[existe] += "-> " + aux.id
      }     
      aux = aux.siguiente
      if (aux == null) {
        break;
      }
    }
    if (iterator == carpetaActual.archivos[cantidadArchivos-1]) {
      rankFilas += "}\n"
    }else {
      rankFilas += "}\n{ rank = same;"
    }
  }
  for (let index = 0, fin = conexionColumnaVertical.length; index < fin; index++) {
    texto += conexionColumnaVertical[index] + "\n"
  }
  columnas.sort()
  let prueba = "mt"
  for (let index = 0, fin = columnas.length; index < fin; index++) {
    prueba += " -> " + columnas[index]
  }
  texto += conexionNodo + "\n" + conexionfila + "\n" + prueba + "\n" + rankColumna +  "}\n"+ rankFilas + "\n}"
  let codificada = encodeURIComponent(texto);
  window.open(`https://quickchart.io/graphviz?graph=${codificada}`, "_blank");
  console.log(texto)
  console.log(conexionColumnas)
  e.stopPropagation();
});

function abrirArchivo(data64, tipo) {
  const byteCharacters = atob(data64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: tipo });
  return blob;
}

const btnPermisos = document.querySelector("#btnPermisos");
btnPermisos.addEventListener("click", (e) => {
    e.preventDefault();
    let carnetEscogido = parseInt(document.getElementById("selectCarnet").value)
    if (carnetEscogido == 0) {
        alert("Escoge un carnet")
        return
    }
    let archivoEscogido = document.getElementById("selectArchivos").value
    if (archivoEscogido == "0"){
        alert("Escoge un archivo")
        return
    }
    let permiso = document.getElementById("selectPermisos").value
    if (permiso == "0") {
        alert("Escoge un permiso")
        return
    }
    let nuevoNodo = new NodoPermiso(permiso, carnetEscogido)
    console.log(archivoEscogido)
    for (const iterator of carpetaActual.archivos){
        if (iterator.id == archivoEscogido) {
            if (iterator.primero == null) {
              iterator.primero = nuevoNodo
              break
            }else if (iterator.primero.columna > carnetEscogido){
              nuevoNodo.siguiente = iterator.primero
              iterator.primero = nuevoNodo
            }else if (iterator.primero.columna == carnetEscogido){
              iterator.primero.nombre = permiso
            }else{
              let aux = iterator.primero
              while (aux != null) {
                if (aux.siguiente == null) {
                  aux.siguiente = nuevoNodo
                  break 
                }else if(carnetEscogido > aux.siguiente.columna){
                  aux = aux.siguiente
                }else if(carnetEscogido == aux.siguiente.columna){
                  aux.siguiente.nombre = permiso
                  break
                }else {
                  nuevoNodo.siguiente = aux.siguiente
                  aux.siguiente = nuevoNodo
                  break
                }
              }
            }
            console.log(true)
            console.log(iterator)
            break
          }
    }
    localStorage.setItem("arbol", JSON.stringify(arbol));
    e.stopPropagation();
});


//sin uso
function buscar(carnet, nodo) {
    if (nodo != null) {
      if (nodo.carnet == carnet) {
        return nodo;
      } else if (nodo.carnet > carnet) {
        return buscar(carnet, nodo.izquierdo);
      } else {
        return buscar(carnet, nodo.derecho);
      }
    } else {
      return null;
    }
}