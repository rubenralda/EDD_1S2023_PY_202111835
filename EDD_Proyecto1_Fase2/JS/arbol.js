export class nodoEstudiante {
  constructor(nombre, pass, carnet) {
    this.nombre = nombre;
    this.pass = pass;
    this.carnet = carnet;
    this.altura = 0;
    this.izquierdo = null;
    this.derecho = null;
  }
}

export class ArbolAvl {
  constructor() {
    this.raiz = null;
  }
  agregarUno(nombre, pass, carnet) {
    this.nuevo = new nodoEstudiante(nombre, pass, carnet);
    if (this.raiz == null) {
      this.raiz = this.nuevo;
    } else {
      //console.log("entro");
      this.agregar(this.nuevo, this.raiz);
    }
  }

  //sobrecarga
  agregar(nuevo, nodo) {
    //poner return con mensajes
    if (nodo != null) {
      //nunca los carnets seran iguales porque se crean unicos
      if (nuevo.carnet < nodo.carnet) {
        if (nodo.izquierdo == null) {
          nodo.izquierdo = nuevo;
        } else {
          this.agregar(nuevo, nodo.izquierdo);
        }
      } else if (nuevo.carnet > nodo.carnet) {
        if (nodo.derecho == null) {
          nodo.derecho = nuevo;
        } else {
          this.agregar(nuevo, nodo.derecho);
        }
      }
    }
  }

  inOrden() {
    return `<tr>
                <th scope="row">1</th>
                <td>Mark</td>
            </tr>
            <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
    </tr>
    <tr>
        <th scope="row">3</th>
        <td colspan="2">Larry the Bird</td>
    </tr>`;
  }
}
