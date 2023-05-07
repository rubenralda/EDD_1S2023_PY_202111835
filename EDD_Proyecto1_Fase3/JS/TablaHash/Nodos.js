export class NodoPermiso {
  constructor(nombre, columna) {
    const now = new Date();
    this.id = now.getTime();
    this.nombre = nombre;
    this.columna = columna;//carnet
    this.siguiente = null;
  }
}

export class NodoArchivos {
  constructor(nombre, informacion) {
    const now = new Date();
    this.id = now.getTime();
    this.nombre = nombre;
    this.informacion = informacion; //almacenamiento en base64
    this.primero = null; //apuntador al siguiente nodopermiso
    this.ultimo = null;
    this.copia = 0;
  }
}

export class nodoCarpeta {
  constructor(nombre) {
    const now = new Date();
    this.id = now.getTime();
    this.nombre = nombre;
    this.copia = 0;
    this.carpetas = []; //nodo carpetas
    this.archivos = []; //nodo archivos
  }
}

export class NodoBitacora {
  constructor(accion) {
    this.accion = accion;
    this.siguiente = null;
    const now = new Date();
    this.hora = now.getHours() + ":" + now.getMinutes();
    this.fecha = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear();
  }
}

export class nodoEstudiante {
  constructor(nombre, pass, carnet) {
    this.nombre = nombre;
    this.pass = pass;
    this.passEncriptado = btoa(pass.toString())
    this.carnet = carnet;
    this.izquierdo = null;
    this.derecho = null;
    this.altura = 0;
    this.cabezaBitacora = null; //apuntador NodoBitacora
    this.carpetaRaiz = new nodoCarpeta("/");
  }
}
