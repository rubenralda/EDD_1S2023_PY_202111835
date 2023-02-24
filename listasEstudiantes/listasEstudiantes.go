package listasEstudiantes

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

var ConteoPendientes int = 0

type NodoStudiante struct {
	siguiente *NodoStudiante
	anterior  *NodoStudiante
	carnet    int32
	Nombre    string
	pass      string
}

type ColaPendientes struct {
	Primero *NodoStudiante
	Ultimo  *NodoStudiante
}

func (estudiante *ColaPendientes) Agregar(carnet int32, Nombre, pass string) {
	nuevo := NodoStudiante{siguiente: nil, anterior: nil, carnet: carnet, Nombre: Nombre, pass: pass}
	if estudiante.Primero == nil {
		estudiante.Primero = &nuevo
		estudiante.Ultimo = &nuevo
	} else {
		estudiante.Ultimo.siguiente = &nuevo
		estudiante.Ultimo = &nuevo
	}
	ConteoPendientes++
}

func (estudiante *ColaPendientes) CargaMasiva(NombreArchivo string) string {
	fichero, err := os.ReadFile(NombreArchivo)
	if os.IsNotExist(err) {
		log.Fatal(err)
		return "Ocurrió un error al intentar abrir el archivo"
	}
	lineas := strings.Split(string(fichero), "\n")
	for _, linea := range lineas {
		dato := strings.Split(linea, ",")
		if dato[0] == "" {
			continue
		}
		carnet, err := strconv.ParseInt(dato[0], 0, 32)
		if err != nil {
			fmt.Println(err)
			return "El carnet " + dato[0] + " no es correcto"
		}
		estudiante.Agregar(int32(carnet), dato[1], dato[2])
	}
	return "Se ha cargado el archivo con éxito"
}

func (estudiante *ColaPendientes) EliminarPrimero() *NodoStudiante {
	if estudiante.Primero == nil {
		return nil
	}
	aux := estudiante.Primero
	if estudiante.Primero.siguiente == nil {
		estudiante.Ultimo = nil
	}
	estudiante.Primero = estudiante.Primero.siguiente
	ConteoPendientes--
	aux.siguiente = nil
	return aux
}

func (estudiantes ColaPendientes) Mostrar() {
	for estudiantes.Primero != nil {
		fmt.Print("-->", ConteoPendientes, estudiantes.Primero.Nombre)
		estudiantes.Primero = estudiantes.Primero.siguiente
	}
}

type ListaAceptados struct {
	Primero *NodoStudiante
	Ultimo  *NodoStudiante
}

func (lista *ListaAceptados) Agregar(estudiante *NodoStudiante) {
	if lista.Primero == nil {
		lista.Primero = estudiante
		lista.Ultimo = estudiante
		lista.Primero.siguiente = nil
		fmt.Println("Entro aqui 1")
		return
	}
	if lista.Primero.carnet > estudiante.carnet {
		estudiante.siguiente = lista.Primero
		lista.Primero.anterior = estudiante
		estudiante.anterior = nil
		lista.Primero = estudiante
		fmt.Println("Entro aqui 2")
		return
	}
	for actual := lista.Primero; actual != nil; {
		if actual.siguiente == nil {
			if actual.carnet < estudiante.carnet {
				actual.siguiente = estudiante
				estudiante.siguiente = nil
				estudiante.anterior = lista.Ultimo
				actual = estudiante
				fmt.Println("Entro aqui 2")
			} else {
				estudiante.siguiente = lista.Ultimo
				estudiante.anterior = lista.Ultimo.anterior
				actual.anterior = estudiante
				if estudiante.anterior != nil {
					estudiante.anterior.siguiente = estudiante
				}
			}
			break
		} else {
			if actual.carnet < estudiante.carnet && estudiante.carnet < actual.siguiente.carnet {
				estudiante.siguiente = actual.siguiente
				actual.siguiente.anterior = estudiante
				actual.siguiente = estudiante
				estudiante.anterior = actual
				fmt.Println("Entro aqui 3")
				break
			}
		}
		fmt.Println("Entro aqui 4")
		actual = actual.siguiente
	}
}

func (estudiantes ListaAceptados) Mostrar() {
	for estudiantes.Primero != nil {
		fmt.Print("-->", ConteoPendientes, estudiantes.Primero.Nombre)
		estudiantes.Primero = estudiantes.Primero.siguiente
	}
}

type BitacoraAdmin struct {
	mensaje string
}
