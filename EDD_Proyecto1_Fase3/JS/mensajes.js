import { desencriptacion, encriptacion } from './blockchain/encriptacionAES.js'
import { Bloque, nodoBloque } from './blockchain/BlockChain.js'

const btnRegresar = document.getElementById('btnRegresar');
const btnEnviarMensaje = document.getElementById('btnEnviarMensaje');
const btnChat = document.getElementById('btnChat');
let tablaHash = null;
let usuario = null;
let bloque = null
let chatActual = null;

document.addEventListener("DOMContentLoaded", (e) => {
    if (localStorage.getItem("isLoggedIn") == "false") {
        location.href = "index.html";
        return;
    }
    let carnet = localStorage.getItem("carnet");
    tablaHash = JSON.parse(localStorage.getItem("tablaHash"));
    if (localStorage.getItem("blockchain") != null) {
        bloque = JSON.parse(localStorage.getItem("blockchain"))
    } else {
        bloque = new Bloque()
    }
    console.log(bloque);
    document.getElementById("selectCarnet").innerHTML =
        `<option value="0" selected>Escoge el carnet para conversar</option>` +
        mostrarCarnets(tablaHash.data, parseInt(carnet));
    document.getElementById("contenedor").innerHTML = ""
    reporte();
    e.stopPropagation();
});

btnRegresar.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("tablaHash", JSON.stringify(tablaHash));
    localStorage.setItem("blockchain", JSON.stringify(bloque));
    location.href = "usuario.html";
    e.stopPropagation();
});

btnEnviarMensaje.addEventListener("click", enviarMensaje);

async function enviarMensaje(e) {
    e.preventDefault();
    if (chatActual == null) {
        alert("Entra a un chat")
        return
    }
    let emisor_mensaje = localStorage.getItem("carnet")
    let receptor_mensaje = document.getElementById("selectCarnet").value
    let mensaje_final = document.getElementById("mensaje").value
    await insertarBloque(fechaActual(), emisor_mensaje, receptor_mensaje, mensaje_final)
    console.log(bloque)
    localStorage.setItem("blockchain", JSON.stringify(bloque));
    console.log("Mensaje Enviado")
    let divColumna = document.createElement("div");
    divColumna.className = "col";
    let divTarjeta = document.createElement("div");
    divTarjeta.className = "card";
    let divBody = document.createElement("div");
    divBody.className = "card-body";
    let cardTitle = document.createElement("p");
    cardTitle.className = "card-text";
    cardTitle.innerHTML = "Bienvendio al chat con: " + chatActual
    divBody.appendChild(cardTitle);
    divTarjeta.appendChild(divBody);
    divColumna.appendChild(divTarjeta);
    document.getElementById("contenedor").innerHTML = ""
    document.getElementById("contenedor").appendChild(divColumna)
    reporte()
}

btnChat.addEventListener('click', (e) => {
    e.preventDefault();
    if (document.getElementById("selectCarnet").value == "0") {
        alert("Escoge un carnet")
        return
    }
    chatActual = document.getElementById("selectCarnet").value
    let divColumna = document.createElement("div");
    divColumna.className = "col";
    let divTarjeta = document.createElement("div");
    divTarjeta.className = "card";
    let divBody = document.createElement("div");
    divBody.className = "card-body";
    let cardTitle = document.createElement("p");
    cardTitle.className = "card-text";


    cardTitle.innerHTML = "Bienvendio al chat con: " + chatActual
    divBody.appendChild(cardTitle);
    divTarjeta.appendChild(divBody);
    divColumna.appendChild(divTarjeta);
    document.getElementById("contenedor").innerHTML = ""
    document.getElementById("contenedor").appendChild(divColumna)
    reporte()
});

async function insertarBloque(fecha, emisor, receptor, mensaje) {
    if (bloque.inicio === null) {
        let cadena = bloque.bloques_creados + fecha + emisor + receptor + mensaje
        let hash = await sha256(cadena)
        let mensajeEncriptado = await encriptacion(mensaje)
        const nuevoBloque = new nodoBloque(bloque.bloques_creados, fecha, emisor, receptor, mensajeEncriptado, '0000', hash)
        bloque.inicio = nuevoBloque
        bloque.bloques_creados++
    } else {
        let cadena = bloque.bloques_creados + fecha + emisor + receptor + mensaje
        let hash = await sha256(cadena)
        let mensajeEncriptado = await encriptacion(mensaje)
        let aux = bloque.inicio
        while (aux.siguiente) {
            aux = aux.siguiente
        }
        const nuevoBloque = new nodoBloque(bloque.bloques_creados, fecha, emisor, receptor, mensajeEncriptado, aux.valor['hash'], hash)
        //nuevoBloque.anterior = aux
        aux.siguiente = nuevoBloque
        bloque.bloques_creados++
    }
}

async function sha256(mensaje) {
    let cadenaFinal
    const enconder = new TextEncoder();
    const mensajeCodificado = enconder.encode(mensaje)
    await crypto.subtle.digest("SHA-256", mensajeCodificado)
        .then(result => { // 100 -> 6a 
            const hashArray = Array.from(new Uint8Array(result))
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
            cadenaFinal = hashHex
        })
        .catch(error => console.log(error))
    return cadenaFinal
}

function fechaActual() {
    let cadena = ''
    const fechaActual = new Date();
    cadena += fechaActual.getDate() < 10 ? ("0" + fechaActual.getDate() + "-") : (fechaActual.getDate() + "-")
    cadena += fechaActual.getMonth() < 10 ? ("0" + (fechaActual.getMonth() + 1) + "-") : (fechaActual.getMonth() + "-")
    cadena += fechaActual.getFullYear() + "::"
    cadena += fechaActual.getHours() < 10 ? ("0" + fechaActual.getHours() + ":") : (fechaActual.getHours() + ":")
    cadena += fechaActual.getMinutes() < 10 ? ("0" + fechaActual.getMinutes() + ":") : (fechaActual.getMinutes() + ":")
    cadena += fechaActual.getSeconds() < 10 ? ("0" + fechaActual.getSeconds()) : (fechaActual.getSeconds())
    return cadena
}

async function reporte() {
    let bloque_actual = bloque.inicio
    while (bloque_actual != null) {
        await mostrar_Mensaje_descriptado(bloque_actual).catch(d => {
            console.log(d)
        })
        bloque_actual = bloque_actual.siguiente
    }
}

async function mostrar_Mensaje_descriptado(bloque_actual) {
    if (localStorage.getItem("carnet") == bloque_actual.valor['receiver'] && bloque_actual.valor['transmitter'] == chatActual) {
        let divColumna = document.createElement("div");
        divColumna.className = "col";
        let divTarjeta = document.createElement("div");
        divTarjeta.className = "card";
        let divBody = document.createElement("div");
        divBody.className = "card-body";
        let cardTitle = document.createElement("p");
        cardTitle.className = "card-text";

        let cadena = await desencriptacion(bloque_actual.valor['message'])
        cardTitle.innerHTML = "Él: " + cadena
        divBody.appendChild(cardTitle);
        divTarjeta.appendChild(divBody);
        divColumna.appendChild(divTarjeta);
        document.getElementById("contenedor").appendChild(divColumna)
    } else if (localStorage.getItem("carnet") == bloque_actual.valor['transmitter'] && bloque_actual.valor['receiver'] == chatActual) {
        let divColumna = document.createElement("div");
        divColumna.className = "col";
        let divTarjeta = document.createElement("div");
        divTarjeta.className = "card";
        let divBody = document.createElement("div");
        divBody.className = "card-body";
        let cardTitle = document.createElement("p");
        cardTitle.className = "card-text";

        let cadena = await desencriptacion(bloque_actual.valor['message'])
        cardTitle.innerHTML = "Tú: " + cadena
        divBody.appendChild(cardTitle);
        divTarjeta.appendChild(divBody);
        divColumna.appendChild(divTarjeta);
        document.getElementById("contenedor").appendChild(divColumna)
    }
}

function mostrarCarnets(tabla, carnet) {
    let data = "";
    for (const estudiante of tabla) {
        //console.log(estudiante)
        if (estudiante == null) {
            continue;
        }
        if (estudiante.carnet != carnet) {
            data += `<option value="${estudiante.carnet}">${estudiante.carnet} ${estudiante.nombre} </option>`;
        } else {
            usuario = estudiante;
        }
    }
    return data;
}