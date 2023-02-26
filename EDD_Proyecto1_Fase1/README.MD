| Carnet    | Nombre                      | Auxiliar |
| --------- | --------------------------- | -------- |
| 202111835 | Ruben Alejandro Ralda Mejia | Aldo Ebany Pérez Larios 

# Manual Técnico
## Librerias utilizadas
Para el paquete listasEstudiantes son:
~~~
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
~~~
## Estructuras principales
Para crear las estructuras de datos, se creo el nodo estudiante, un nodo de la bitacora del estudiante y un nodo de bitacora del administrador
~~~
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
type nodoBitacoraAdmin struct {
	mensaje   string
	fecha     string
	hora      string
	siguiente *nodoBitacoraAdmin
}
~~~
**NodoStudiante** es la parte principal y que otras estructuras utilizan, esta a su vez es otra lista enlazada simple con **bitacoraEstudiante** con un apuntar al primero de la lista, los metodos de **NodoStudiante** son:
~~~
func (estudiante *NodoStudiante) ApilarBitacora()
func (actual NodoStudiante) Mostrar() //Muestra la bitacora del estudiante
~~~
## Listas
La primera lista sería la misma que se hablo antes con funcionamiento de una pila, la siguiente estructura es la cola de estudiantes en espera:
~~~
type ColaPendientes struct {
	Primero *NodoStudiante
	Ultimo  *NodoStudiante
}
~~~
Guarda el primero en la cola y el último, los métodos que utiliza son
~~~
//agrega un solo estudiante
func (estudiante *ColaPendientes) Agregar(Carnet int32, Nombre, pass string)

//agrega todos los estudiantes haciendo uso del método anterior 
func (estudiante *ColaPendientes) CargaMasiva(NombreArchivo string) string
func (estudiante *ColaPendientes) EliminarPrimero() *NodoStudiante

//crea la estructura del archivo y lo devuelve en un string
func (estudiante *ColaPendientes) report() string

func (estudiante ColaPendientes) CrearReporte()
~~~
La siguiente estructra son la lista de estudiantes aceptados en el sistema que estaban en la cola de pendientes
~~~
type ListaAceptados struct {
	Primero *NodoStudiante
	Ultimo  *NodoStudiante
}
~~~
Igual que la anterior cuenta con el primero y el último de la lista, los métodos que utiliza son:
~~~
func (lista *ListaAceptados) Agregar(estudiante *NodoStudiante)
func (lista *ListaAceptados) IniciarSesión(Carnet int32, pass string)
func (estudiante *ListaAceptados) report() string 
func (estudiante ListaAceptados) CrearReporte()
func (list ListaAceptados) ToSlice() []interface{}
func (list ListaAceptados) ToJSON() ([]byte, error)
func (estudiante ListaAceptados) ReporteJson() 
~~~
La última estructura guarda las acciones por el administrador en una pila que fue declarada así:
~~~
type PilaAdmin struct {
	Primero *nodoBitacoraAdmin
	Ultimo  *nodoBitacoraAdmin
}
~~~
Tiene la misma función de apuntar al primero y último de la pila, sus métodos son:
~~~
func (bitacora *PilaAdmin) Agregar(mensaje string)
func (bitacora *PilaAdmin) report() string
func (bitacora PilaAdmin) CrearReporte()
~~~