package listasEstudiantes

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
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
	Carnet    int32
	Nombre    string
	Pass      string
	siguiente *NodoStudiante
	anterior  *NodoStudiante
	primeroB  *bitacoraEstudiante
	ultimoB   *bitacoraEstudiante
}

func (estudiante *NodoStudiante) ApilarBitacora() {
	h := time.Now().Format(time.TimeOnly)
	f := time.Now().Format(time.DateOnly)
	nuevo := bitacoraEstudiante{fecha: f, siguiente: nil, hora: h}
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
		fmt.Println("----Fecha:", actual.primeroB.fecha, actual.primeroB.hora)
		actual.primeroB = actual.primeroB.siguiente
	}
}

type ColaPendientes struct {
	Primero *NodoStudiante
	Ultimo  *NodoStudiante
}

func (estudiante *ColaPendientes) Agregar(Carnet int32, Nombre, pass string) {
	nuevo := NodoStudiante{siguiente: nil, anterior: nil, Carnet: Carnet, Nombre: Nombre, Pass: pass}
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
		return "\n------Error: Ocurrió un error al intentar abrir el archivo------"
	}
	lineas := strings.Split(string(fichero), "\n")
	for _, linea := range lineas {
		dato := strings.Split(linea, ",")
		if dato[0] == "" {
			continue
		}
		Carnet, err := strconv.ParseInt(dato[0], 0, 32)
		if err != nil {
			return "\n------Error: El Carnet " + dato[0] + " no es correcto------"
		}
		estudiante.Agregar(int32(Carnet), strings.Trim(strings.TrimSpace(dato[1]), "\n"), strings.Trim(strings.TrimSpace(dato[2]), "\n"))
	}
	return "\n------Los estudiantes se han agregado a la cola con éxito------"
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

func (estudiante *ColaPendientes) report() string {
	if estudiante.Ultimo == nil {
		return ""
	}
	aux := estudiante.Primero
	conexion := ""
	text := ""
	text += "rankdir=LR; \n "
	text += "node[shape=rectangle, style=filled, color=skyBlue, fontname=\"Century Gothic\"]; \n "
	text += "graph [fontname=\"Century Gothic\"]; \n "
	text += "labelloc=\"t\"; label=\"Estudiantes en espera de ser aceptados\"; \n"
	i := 0
	for {
		text += strconv.FormatInt(int64(i), 10) + "[label=\"" + strconv.FormatInt(int64(aux.Carnet), 10) + "\\n" + aux.Nombre + "\"]\n"
		conexion += strconv.FormatInt(int64(i), 10)
		aux = aux.siguiente
		if aux == nil {
			break
		}
		i++
		conexion += " -> "
	}
	text += conexion
	return text
}

func (estudiante ColaPendientes) CrearReporte() {
	contenido := "digraph G{\n\n"
	fichero, err := os.Create("./textos/colaPendientes.dot")
	if err != nil {
		fmt.Println("\n------Error: Hubo un error al crear el archivo------", err)
		return
	}
	defer fichero.Close()
	contenido += estudiante.report()
	contenido += "\n}"
	if _, err = fichero.Write([]byte(contenido)); err != nil {
		fmt.Println("\n------Error: Hubo un error al escribir en el archivo------", err)
		return
	}
	if estudiante.Primero != nil {
		path, _ := exec.LookPath("dot")
		cmd, _ := exec.Command(path, "-Tjpg", "-Gcharset=latin1", "./textos/colaPendientes.dot").Output()
		mode := 0777
		_ = ioutil.WriteFile("colaPendientes.png", cmd, os.FileMode(mode))
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
	if lista.Primero.Carnet > estudiante.Carnet {
		estudiante.siguiente = lista.Primero
		lista.Primero.anterior = estudiante
		estudiante.anterior = nil
		lista.Primero = estudiante
		return
	}
	for actual := lista.Primero; actual != nil; {
		if actual.siguiente == nil {
			if actual.Carnet < estudiante.Carnet {
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
			if actual.Carnet < estudiante.Carnet && estudiante.Carnet < actual.siguiente.Carnet {
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

func (lista *ListaAceptados) IniciarSesión(Carnet int32, pass string) {
	for actual := lista.Primero; actual != nil; {
		if actual.Carnet == Carnet {
			if actual.Pass == pass {
				actual.ApilarBitacora()
				fmt.Println("\n------SESIÓN INICIADA CORRECTAMENTE------")
				fmt.Println("Nombre:", actual.Nombre)
				fmt.Println("Se inició sesión estas fechas:")
				actual.Mostrar()
				return
			} else {
				fmt.Println("\n------Error: La contraseña es incorrecta------")
				return
			}
		}
		actual = actual.siguiente
	}
	fmt.Println("\n------Error: El usuario no existe------")
}

func (estudiante *ListaAceptados) report() string {
	if estudiante.Ultimo == nil {
		return ""
	}
	aux := estudiante.Primero
	conexion := "nodonull1->"
	bitacora := "\n"
	conexionPila := ""
	conexionEnlaza := ";"
	text := ""
	rank := ""
	text += "rankdir=LR; \n "
	text += "node[shape=rectangle, style=filled, color=beige, fontname=\"Century Gothic\"]; \n "
	text += "graph [fontname=\"Century Gothic\"]; \n "
	text += "labelloc=\"t\"; label=\"Estudiantes en el sistema\"; \n"
	text += "nodonull1[label=\"NULL\"];\n"
	text += "nodonull2[label=\"NULL\"];\n"
	i := 0
	x := 0
	for {
		text += strconv.FormatInt(int64(i), 10) + "[label=\"" + strconv.FormatInt(int64(aux.Carnet), 10) + "\\n" + aux.Nombre + "\"]\n"
		conexion += strconv.FormatInt(int64(i), 10)
		conexionEnlaza = strconv.FormatInt(int64(i), 10) + conexionEnlaza
		auxBitacora := aux.primeroB
		if auxBitacora != nil {
			conexionPila += strconv.FormatInt(int64(i), 10) + " -> "
			rank += "{rank=same;" + strconv.FormatInt(int64(i), 10) + ","
			for {
				bitacora += "n" + strconv.FormatInt(int64(x), 10) + "[label=\"Se inició sesión\\n" + auxBitacora.fecha + "  " + auxBitacora.hora + "\"]\n"
				conexionPila += "n" + strconv.FormatInt(int64(x), 10)
				rank += "n" + strconv.FormatInt(int64(x), 10)
				x++
				auxBitacora = auxBitacora.siguiente
				if auxBitacora == nil {
					break
				}

				conexionPila += " -> "
				rank += ","
			}
			conexionPila += ";\n"
			rank += "}\n"
		}
		i++
		aux = aux.siguiente
		if aux == nil {
			break
		}
		conexion += " -> "
		conexionEnlaza = " -> " + conexionEnlaza
	}
	text += conexion + "->nodonull2;\n" + conexionEnlaza + bitacora + conexionPila + rank
	return text
}

func (estudiante ListaAceptados) CrearReporte() {
	contenido := "digraph G{\n\n"
	fichero, err := os.Create("./textos/aceptados.dot")
	if err != nil {
		fmt.Println("\n------Error: Hubo un error al crear el archivo------", err)
		return
	}
	defer fichero.Close()
	contenido += estudiante.report()
	contenido += "\n}"
	if _, err = fichero.Write([]byte(contenido)); err != nil {
		fmt.Println("\n------Error: Hubo un error al escribir en el archivo------", err)
		return
	}
	if estudiante.Primero != nil {
		path, _ := exec.LookPath("dot")
		cmd, _ := exec.Command(path, "-Tjpg", "-Gcharset=latin1", "./textos/aceptados.dot").Output()
		mode := 0777
		_ = ioutil.WriteFile("aceptados.png", cmd, os.FileMode(mode))
	}
}

func (estudiantes ListaAceptados) Listado() {
	if estudiantes.Primero == nil {
		fmt.Println("\n-----No hay estudiantes en el sistema----")
		return
	}
	fmt.Println("\n*********** Listado de estudiantes *************")
	for estudiantes.Primero != nil {
		fmt.Println("Nombre:", estudiantes.Primero.Nombre, "Carnet:", estudiantes.Primero.Carnet)
		fmt.Println("**************************************************")
		estudiantes.Primero = estudiantes.Primero.siguiente
	}
}

func (list ListaAceptados) ToSlice() []interface{} {
	var values []interface{}
	currentNode := list.Primero
	for currentNode != nil {
		values = append(values, currentNode)
		currentNode = currentNode.siguiente
	}
	return values
}

type estructura struct {
	Alumnos []interface{}
}

func (list ListaAceptados) ToJSON() ([]byte, error) {
	values := list.ToSlice()
	estructura := estructura{Alumnos: values}
	return json.Marshal(estructura)
}

func (estudiante ListaAceptados) ReporteJson() {
	fichero, err := os.Create("aceptado.json")
	if err != nil {
		fmt.Println("\n------Error: Hubo un error al crear el archivo------", err)
		return
	}
	defer fichero.Close()

	datos, _ := estudiante.ToJSON()
	if _, err = fichero.Write(datos); err != nil {
		fmt.Println("\n------Error: Hubo un error al escribir en el archivo------", err)
		return
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
	h := time.Now().Format(time.TimeOnly)
	f := time.Now().Format(time.DateOnly)
	nuevo := nodoBitacoraAdmin{mensaje: mensaje, fecha: f, hora: h, siguiente: nil}
	if bitacora.Primero == nil {
		bitacora.Primero = &nuevo
		bitacora.Ultimo = &nuevo
	} else {
		bitacora.Ultimo.siguiente = &nuevo
		bitacora.Ultimo = &nuevo
	}
}

func (bitacora *PilaAdmin) report() string {
	if bitacora.Ultimo == nil {
		return ""
	}
	aux := bitacora.Primero
	conexion := ""
	text := ""
	text += "rankdir=TB; \n "
	text += "node[shape=cds, style=filled, color=pink, fontname=\"Century Gothic\"]; \n "
	text += "graph [fontname=\"Century Gothic\"]; \n "
	text += "labelloc=\"t\"; label=\"Bitacora Administrador\"; \n"
	i := 0
	for {
		text += strconv.FormatInt(int64(i), 10) + "[label=\"" + aux.mensaje + "\\n" + aux.fecha + "  " + aux.hora + "\"]\n"
		conexion += strconv.FormatInt(int64(i), 10)
		aux = aux.siguiente
		if aux == nil {
			break
		}
		i++
		conexion += " -> "
	}
	text += conexion
	return text
}

func (bitacora PilaAdmin) CrearReporte() {
	contenido := "digraph G{\n\n"
	fichero, err := os.Create("./textos/bitacoraAdmin.dot")
	if err != nil {
		fmt.Println("\n------Error: Hubo un error al crear el archivo------", err)
		return
	}
	defer fichero.Close()
	contenido += bitacora.report()
	contenido += "\n}"
	if _, err = fichero.Write([]byte(contenido)); err != nil {
		fmt.Println("\n------Error: Hubo un error al escribir en el archivo------", err)
		return
	}
	if bitacora.Primero != nil {
		path, _ := exec.LookPath("dot")
		cmd, _ := exec.Command(path, "-Tjpg", "-Gcharset=latin1", "./textos/bitacoraAdmin.dot").Output()
		mode := 0777
		_ = ioutil.WriteFile("bitacoraAdmin.png", cmd, os.FileMode(mode))
	}
}
