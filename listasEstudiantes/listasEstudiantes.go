package listasEstudiantes

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type NodoStudiante struct {
	siguiente *NodoStudiante
	carnet    int32
	nombre    string
	pass      string
}

type ColaPendientes struct {
	primero *NodoStudiante
	ultimo  *NodoStudiante
}

func (estudiante *ColaPendientes) Agregar(carnet int32, nombre, pass string) {
	nuevo := NodoStudiante{siguiente: nil, carnet: carnet, nombre: nombre, pass: pass}
	if estudiante.primero == nil {
		estudiante.primero = &nuevo
		estudiante.ultimo = &nuevo
	} else {
		estudiante.ultimo.siguiente = &nuevo
		estudiante.ultimo = &nuevo
	}
}

func (estudiante *ColaPendientes) CargaMasiva(nombreArchivo string) string {
	fichero, err := os.ReadFile(nombreArchivo)
	if os.IsNotExist(err) {
		log.Fatal(err)
		return "Ocurrió un error al intentar abrir el archivo"
	}
	lineas := strings.Split(string(fichero), "\n")
	for _, linea := range lineas {
		dato := strings.Split(linea, ",")
		carnet, err := strconv.ParseInt(dato[0], 0, 32)
		if err != nil {
			fmt.Println(err)
			return "El carnet " + dato[0] + " no es correcto"
		}
		estudiante.Agregar(int32(carnet), dato[1], dato[2])
	}
	return "Se ha cargado el archivo con éxito"
}

func (estudiantes ColaPendientes) Mostrar() {
	for estudiantes.primero != nil {
		fmt.Print("-->", estudiantes.primero.nombre)
		estudiantes.primero = estudiantes.primero.siguiente
	}
}
