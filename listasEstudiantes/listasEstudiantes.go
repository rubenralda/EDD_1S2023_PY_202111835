package listasEstudiantes

import (
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
	siguiente *NodoStudiante
	anterior  *NodoStudiante
	carnet    int32
	Nombre    string
	pass      string
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

func (estudiante *ColaPendientes) report() string {
	if estudiante.Ultimo == nil {
		return ""
	}
	aux := estudiante.Primero
	conexion := ""
	text := ""
	text += "rankdir=LR; \n "
	text += "node[shape=component, style=filled, color=skyBlue, fontname=\"Century Gothic\"]; \n "
	text += "graph [fontname=\"Century Gothic\"]; \n "
	text += "labelloc=\"t\"; label=\"Estudiantes en espera de ser aceptados\"; \n"
	i := 0
	for {
		text += strconv.FormatInt(int64(i), 10) + "[label=\"" + strconv.FormatInt(int64(aux.carnet), 10) + "\\n" + aux.Nombre + "\"]\n"
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
		fmt.Println(err, "Hubo un error al crear el archivo")
		return
	}
	defer fichero.Close()
	contenido += estudiante.report()
	contenido += "\n}"
	if _, err = fichero.Write([]byte(contenido)); err != nil {
		fmt.Println(err, "Hubo un error al escribir en el archivo")
		return
	}
	if estudiante.Primero != nil {
		path, _ := exec.LookPath("dot")
		cmd, _ := exec.Command(path, "-Tjpg", "-Gcharset=latin1", "./textos/colaPendientes.dot").Output()
		mode := 0777
		_ = ioutil.WriteFile("colaPendientes.png", cmd, os.FileMode(mode))
	}
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
	text += "node[shape=component, style=filled, color=skyBlue, fontname=\"Century Gothic\"]; \n "
	text += "graph [fontname=\"Century Gothic\"]; \n "
	text += "labelloc=\"t\"; label=\"Estudiantes en el sistema\"; \n"
	text += "nodonull1[label=\"null\"];\n"
	text += "nodonull2[label=\"null\"];\n"
	i := 0
	x := 0
	for {
		text += strconv.FormatInt(int64(i), 10) + "[label=\"" + strconv.FormatInt(int64(aux.carnet), 10) + "\\n" + aux.Nombre + "\"]\n"
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
		fmt.Println(err, "Hubo un error al crear el archivo")
		return
	}
	defer fichero.Close()
	contenido += estudiante.report()
	contenido += "\n}"
	if _, err = fichero.Write([]byte(contenido)); err != nil {
		fmt.Println(err, "Hubo un error al escribir en el archivo")
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
		fmt.Println(err, "Hubo un error al crear el archivo")
		return
	}
	defer fichero.Close()
	contenido += bitacora.report()
	contenido += "\n}"
	if _, err = fichero.Write([]byte(contenido)); err != nil {
		fmt.Println(err, "Hubo un error al escribir en el archivo")
		return
	}
	if bitacora.Primero != nil {
		path, _ := exec.LookPath("dot")
		cmd, _ := exec.Command(path, "-Tjpg", "-Gcharset=latin1", "./textos/bitacoraAdmin.dot").Output()
		mode := 0777
		_ = ioutil.WriteFile("bitacoraAdmin.png", cmd, os.FileMode(mode))
	}
}

func (bitacora PilaAdmin) Mostrar() {
	for bitacora.Primero != nil {
		fmt.Println(bitacora.Primero.mensaje)
		bitacora.Primero = bitacora.Primero.siguiente
	}
}
