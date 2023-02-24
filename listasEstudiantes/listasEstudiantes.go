package listasEstudiantes

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

var ConteoPendientes int = 0

type bitacoraEstudiante struct {
	fecha     string
	hora      string
	siguiente *bitacoraEstudiante
}

type NodoStudiante struct {
	siguiente *NodoStudiante
	anterior  *NodoStudiante
	carnet    int32
	Nombre    string
	pass      string
	primeroB  *bitacoraEstudiante
	ultimoB   *bitacoraEstudiante
}

func (estudiante *NodoStudiante) ApilarBitacora() {
	d := time.TimeOnly
	f := time.DateOnly
	nuevo := bitacoraEstudiante{fecha: f, siguiente: nil, hora: d}
	if estudiante.primeroB == nil {
		estudiante.primeroB = &nuevo
		estudiante.ultimoB = &nuevo
	} else {
		estudiante.ultimoB.siguiente = &nuevo
		estudiante.ultimoB = &nuevo
	}
}
func (actual NodoStudiante) Mostrar() {
	for actual.primeroB != nil {
		fmt.Println("---Fecha:", actual.primeroB.fecha, actual.primeroB.hora)
		actual.primeroB = actual.primeroB.siguiente
	}
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
			return "El carnet " + dato[0] + " no es correcto"
		}
		estudiante.Agregar(int32(carnet), strings.Trim(strings.TrimSpace(dato[1]), "\n"), strings.Trim(strings.TrimSpace(dato[2]), "\n"))
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
		fmt.Print("-->", estudiantes.Primero.Nombre)
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
		return
	}
	if lista.Primero.carnet > estudiante.carnet {
		estudiante.siguiente = lista.Primero
		lista.Primero.anterior = estudiante
		estudiante.anterior = nil
		lista.Primero = estudiante
		return
	}
	for actual := lista.Primero; actual != nil; {
		if actual.siguiente == nil {
			if actual.carnet < estudiante.carnet {
				actual.siguiente = estudiante
				estudiante.siguiente = nil
				estudiante.anterior = lista.Ultimo
				actual = estudiante
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
				break
			}
		}
		actual = actual.siguiente
	}
}

func (lista *ListaAceptados) IniciarSesión(carnet int32, pass string) {
	for actual := lista.Primero; actual != nil; {
		if actual.carnet == carnet {
			if actual.pass == pass {
				actual.ApilarBitacora()
				fmt.Println("SESIÓN INICIADA CORRECTAMENTE")
				fmt.Println("Nombre:", actual.Nombre)
				fmt.Println("Se inició sesión:")
				actual.Mostrar()
				return
			} else {
				fmt.Println("La contraseña es incorrecta")
				return
			}
		}
		actual = actual.siguiente
	}
	fmt.Println("El usuario no existe")
}

func (estudiantes ListaAceptados) Listado() {
	fmt.Println("\n*********** Listado de estudiantes *************")
	for estudiantes.Primero != nil {
		fmt.Println("Nombre:", estudiantes.Primero.Nombre, "Carnet:", estudiantes.Primero.carnet)
		fmt.Println("**************************************************")
		estudiantes.Primero = estudiantes.Primero.siguiente
	}
}

type nodoBitacoraAdmin struct {
	mensaje   string
	fecha     string
	hora      string
	siguiente *nodoBitacoraAdmin
}

type PilaAdmin struct {
	Primero *nodoBitacoraAdmin
	Ultimo  *nodoBitacoraAdmin
}

func (bitacora *PilaAdmin) Agregar(mensaje string) {
	h := time.TimeOnly
	f := time.DateOnly
	nuevo := nodoBitacoraAdmin{mensaje: mensaje, fecha: f, hora: h, siguiente: nil}
	if bitacora.Primero == nil {
		bitacora.Primero = &nuevo
		bitacora.Ultimo = &nuevo
	} else {
		bitacora.Ultimo.siguiente = &nuevo
		bitacora.Ultimo = &nuevo
	}
}

func (bitacora PilaAdmin) Mostrar() {
	for bitacora.Primero != nil {
		fmt.Println(bitacora.Primero.mensaje)
		bitacora.Primero = bitacora.Primero.siguiente
	}
}
