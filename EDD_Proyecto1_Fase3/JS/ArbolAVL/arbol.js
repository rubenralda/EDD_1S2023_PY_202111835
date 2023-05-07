export class NodoPermiso{
  constructor(nombre, columna){
    const now = new Date();
    this.id = now.getTime();
    this.nombre = nombre
    this.columna = columna
    this.siguiente = null
  }
}

export class NodoArchivos{
  constructor(nombre,  informacion){
    const now = new Date();
    this.id = now.getTime();
    this.nombre = nombre
    this.informacion = informacion //almacenamiento en base64
    this.primero = null//apuntador al siguiente nodopermiso
    this.ultimo = null
    this.copia = 0
  }
}

export class nodoCarpeta{
  constructor(nombre){
    const now = new Date();
    this.id = now.getTime();
    this.nombre = nombre
    this.copia = 0
    this.carpetas = [] //nodo carpetas
    this.archivos = [] //nodo archivos
  }
}

export class NodoBitacora{
  constructor(accion){
    this.accion = accion
    this.siguiente = null
    const now = new Date();
    this.hora = now.getHours() + ":" + now.getMinutes()
    this.fecha = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear()
  }
}

export class nodoEstudiante {
  constructor(nombre, pass, carnet) {
    this.nombre = nombre;
    this.pass = pass;
    this.carnet = carnet;
    this.izquierdo = null;
    this.derecho = null;
    this.altura = 0;
    this.cabezaBitacora = null //apuntador NodoBitacora
    this.carpetaRaiz= new nodoCarpeta("/");
  }
}

export class ArbolAvl{
  constructor() {
    this.raiz = null;
  }

  agregar(nombre, pass, carnet) {
    this.raiz = this.agregarNodo(this.raiz, nombre, pass, carnet);
  }

  agregarNodo(node, nombre, pass, carnet) {
    if (!node) {
      return new nodoEstudiante(nombre, pass, carnet);
    } else if (carnet < node.carnet) {
      node.izquierdo = this.agregarNodo(node.izquierdo, nombre, pass, carnet);
    } else {
      node.derecho = this.agregarNodo(node.derecho, nombre, pass, carnet);
    }

    node.altura = 1 + Math.max(this._getHeight(node.izquierdo), this._getHeight(node.derecho));

    const balanceFactor = this._getBalance(node);

    // Caso 1 - Rotación izquierda izquierda
    if (balanceFactor > 1 && carnet < node.izquierdo.carnet) {
      return this._rotateRight(node);
    }

    // Caso 2 - Rotación derecha derecha
    if (balanceFactor < -1 && carnet > node.derecho.carnet) {
      return this._rotateLeft(node);
    }

    // Caso 3 - Rotación izquierda derecha
    if (balanceFactor > 1 && carnet > node.izquierdo.carnet) {
      node.izquierdo = this._rotateLeft(node.izquierdo);
      return this._rotateRight(node);
    }

    // Caso 4 - Rotación derecha izquierda
    if (balanceFactor < -1 && carnet < node.derecho.carnet) {
      node.derecho = this._rotateRight(node.derecho);
      return this._rotateLeft(node);
    }

    return node;
  }

  _getHeight(node) {
    if (!node) {
      return -1;
    }
    return node.altura;
  }

  _getBalance(node) {
    if (!node) {
      return 0;
    }
    return this._getHeight(node.izquierdo) - this._getHeight(node.derecho);
  }

  _rotateLeft(z) {
    const y = z.derecho;
    const T3 = y.izquierdo;

    y.izquierdo = z;
    z.derecho = T3;

    z.altura = 1 + Math.max(this._getHeight(z.izquierdo), this._getHeight(z.derecho));
    y.altura = 1 + Math.max(this._getHeight(y.izquierdo), this._getHeight(y.derecho));

    return y;
  }

  _rotateRight(z) {
    const y = z.izquierdo;
    const T2 = y.derecho;

    y.derecho = z;
    z.izquierdo = T2;

    z.altura = 1 + Math.max(this._getHeight(z.izquierdo), this._getHeight(z.derecho));
    y.altura = 1 + Math.max(this._getHeight(y.izquierdo), this._getHeight(y.derecho));

    return y;
  }
}