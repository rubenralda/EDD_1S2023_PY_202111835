import { nodoEstudiante, nodoCarpeta } from "./arbol.js";

let directorioActual = "/"
let carpetaActual = null
let arbol = null
let estudiante = null

document.addEventListener("DOMContentLoaded", e => {
   if (localStorage.getItem("isLoggedIn") == "false"){
        location.href = "index.html"
        return
    }
    document.getElementById("h2Carnet").innerHTML = localStorage.getItem("carnet");
    arbol = JSON.parse(localStorage.getItem("arbol"))
    estudiante = buscar(parseInt(localStorage.getItem("carnet")), arbol.raiz)
    console.log(estudiante)
    e.stopPropagation();
});

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
  
//cerrar sesión
let btnCerrar = document.querySelector("#btnCerrar");
btnCerrar.addEventListener("click", e =>{
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "false")
    localStorage.setItem("arbol", JSON.stringify(arbol))
    location.href = "index.html"
    e.stopPropagation();
});

let btnCrearCarpeta = document.querySelector("#btnCrear");
btnCrearCarpeta.addEventListener("click", e => {
    e.preventDefault();
    let nombreNuevo = document.getElementById("nombreCarpeta").value;
    console.log(carpetaRaiz)
    if (directorioActual.split("/")[1] == ""){
        //agregar carpeta a la raiz
        console.log(true)
        let nuevoCarpeta = new nodoCarpeta(nombreNuevo)

    }else{
        //recorrer todos los nombres de los vectores
    }
    e.stopPropagation();
});

