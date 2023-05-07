class nodoBloque {
    constructor(index, fecha, emisor, receptor, mensaje, previousHash, hash) {
        this.valor = {
            'index': index,
            'timestamp': fecha,
            'transmitter': emisor,
            'receiver': receptor,
            'message': mensaje,
            'previoushash': previousHash,
            'hash': hash
        }
        this.siguiente = null
        this.anterior = null
    }
}

class Bloque {
    constructor() {
        this.inicio = null
        this.bloques_creados = 0
    }
}