export class archivos{
  constructor(nombre,  informacion){
    this.nombre = nombre
    this.informacion = informacion
    this.siguiente = null
    this.carnet = 0
  }
}

export class nodoCarpeta{
  constructor(nombre){
    this.nombre = nombre
    this.carpetas = []
    this.archivos = []
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
    this.carpetaRaiz= new nodoCarpeta("/");
  }
}

export class ArbolAvl {
  constructor() {
    this.raiz = null;
  }

  agregar(nombre, pass, carnet) {
    this.nuevo = new nodoEstudiante(nombre, pass, carnet);
    if (this.raiz == null) {
      this.raiz = this.nuevo;
    } else {
      //console.log("entro");
      this.raiz = this.agregarNodo(this.raiz, this.nuevo);
    }
  }

  /*agregarNodo(nuevo, nodo) { un método mío sin terminar
      let alturaIz = 0;
      let alturaDer = 0;
      if (nuevo.carnet < nodo.carnet) {
        if (nodo.izquierdo == null) {
          nodo.izquierdo = nuevo;
        } else {
          alturaIz = this.agregar(nuevo, nodo.izquierdo);
        }
      } else {
        if (nodo.derecho == null) {
          nodo.derecho = nuevo;
        } else {
          alturaDer = this.agregar(nuevo, nodo.derecho);
        }
      }
      let altura = Math.max(alturaDer, alturaIz) + 1;
      nodo.altura = altura;
      console.log(altura)
      return altura;    
  }*/

  agregarNodo(nodoActual, nuevoNodo) {
    // Si el nodo actual es nulo, simplemente colocamos el nuevo nodo aquí
    if (nodoActual === null) {
      return nuevoNodo;
    }

    // Si la información del nuevo nodo es menor que la del nodo actual,
    // lo insertamos en el subárbol izquierdo
    if (nuevoNodo.informacion < nodoActual.informacion) {
      nodoActual.izquierdo = this.agregarNodo(nodoActual.izquierdo, nuevoNodo);
    }
    // Si la información del nuevo nodo es mayor que la del nodo actual,
    // lo insertamos en el subárbol derecho
    else {
      nodoActual.derecho = this.agregarNodo(nodoActual.derecho, nuevoNodo);
    }

    // Calculamos el factor de equilibrio del nodo actual
    const factorEquilibrio = this.calcularFactorEquilibrio(nodoActual);

    // Si el factor de equilibrio es mayor que 1, el árbol está desequilibrado
    // y debemos reequilibrarlo mediante rotaciones de nodos
    if (factorEquilibrio > 1) {
      // Si el factor de equilibrio del subárbol izquierdo es mayor o igual que cero,
      // realizamos una rotación hacia la derecha
      if (
        this.calcularAltura(nodoActual.izquierdo.izquierdo) >=
        this.calcularAltura(nodoActual.izquierdo.derecho)
      ) {
        return this.rotacionDerecha(nodoActual);
      }
      // De lo contrario, realizamos una rotación doble hacia la derecha-izquierda
      else {
        nodoActual.izquierdo = this.rotacionIzquierda(nodoActual.izquierdo);
        return this.rotacionDerecha(nodoActual);
      }
    } else if (factorEquilibrio < -1) {
      // Si el factor de equilibrio del subárbol derecho es menor o igual que cero,
      // realizamos una rotación hacia la izquierda
      if (
        this.calcularAltura(nodoActual.derecho.derecho) >=
        this.calcularAltura(nodoActual.derecho.izquierdo)
      ) {
        return this.rotacionIzquierda(nodoActual);
      }
      // De lo contrario, realizamos una rotación doble hacia la izquierda-derecha
      else {
        nodoActual.derecho = this.rotacionDerecha(nodoActual.derecho);
        return this.rotacionIzquierda(nodoActual);
      }
    }

    // Si el árbol está balanceado, simplemente devolvemos el nodo actual
    return nodoActual;
  }
  calcularFactorEquilibrio(nodo) {
    if (nodo === null) {
      return 0;
    }
    const alturaIzquierdo = this.calcularAltura(nodo.izquierdo);
    const alturaDerecho = this.calcularAltura(nodo.derecho);

    return alturaIzquierdo - alturaDerecho;
  }

  calcularAltura(nodo) {
    if (nodo === null) {
      return -1;
    }
    const alturaIzquierdo = this.calcularAltura(nodo.izquierdo);
    const alturaDerecho = this.calcularAltura(nodo.derecho);
    
    return nodo.altura = 1 + Math.max(alturaIzquierdo, alturaDerecho);
  }

  rotacionDerecha(nodoDesbalanceado) {
    const nuevoNodoRaiz = nodoDesbalanceado.izquierdo;
    nodoDesbalanceado.izquierdo = nuevoNodoRaiz.derecho;
    nuevoNodoRaiz.derecho = nodoDesbalanceado;
    return nuevoNodoRaiz;
  }

  rotacionIzquierda(nodoDesbalanceado) {
    const nuevoNodoRaiz = nodoDesbalanceado.derecho;
    nodoDesbalanceado.derecho = nuevoNodoRaiz.izquierdo;
    nuevoNodoRaiz.izquierdo = nodoDesbalanceado;
    return nuevoNodoRaiz;
  }
}
