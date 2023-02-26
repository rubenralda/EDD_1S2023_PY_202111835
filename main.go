package main

import (
	"fmt"
	"strconv"

	"ruben.info/proyecto1/listasEstudiantes"
)

func main() {
	colaPendientes := listasEstudiantes.ColaPendientes{}
	aceptados := listasEstudiantes.ListaAceptados{}
	bitacoraAdmin := listasEstudiantes.PilaAdmin{}
	for i := 0; i != 3; {
		fmt.Println("\n********************** EDD Drive *******************************")
		fmt.Println("1. Iniciar sesión")
		fmt.Println("2. Mostrar Reportes")
		fmt.Println("3. Salir del sistema")
		fmt.Println("****************************************************************")
		fmt.Print("Elige una opcion: ")
		fmt.Scan(&i)
		switch usuario, pass := "", ""; i {
		case 1:
			fmt.Print("Ingresa tu usuario: ")
			fmt.Scan(&usuario)
			fmt.Print("Ingresa tu contraseña: ")
			fmt.Scan(&pass)
			if usuario == "admin" && pass == "admin" {
				fmt.Println("\nSESIÓN INICIADA COMO ADMINISTRADOR")
				menuAdmin(&colaPendientes, &aceptados, &bitacoraAdmin)
			} else {
				carnet, err := strconv.ParseInt(usuario, 0, 32)
				if err != nil {
					fmt.Println("\nError: El usuario no es válido, verifique que sea un número de carnet")
					continue
				}
				aceptados.IniciarSesión(int32(carnet), pass)
			}
		case 3:
			fmt.Println("Adios")
		case 2:
			bitacoraAdmin.CrearReporte()
			colaPendientes.CrearReporte()
			aceptados.CrearReporte()
			aceptados.ReporteJson()
		default:
			fmt.Println("\n------Advertencia: Ingresa una opción válida------")
		}
	}
}

func menuAdmin(colaPendientes *listasEstudiantes.ColaPendientes, aceptados *listasEstudiantes.ListaAceptados, bitacora *listasEstudiantes.PilaAdmin) {
	for x := 0; x != 5; {
		fmt.Println("\n*********** Dashboard Administrador - EDD GoDrive *************")
		fmt.Println("1. Ver estudiantes pendientes")
		fmt.Println("2. Ver estudiantes del sistema")
		fmt.Println("3. Registrar nuevo estudiante")
		fmt.Println("4. Carga masiva de estudiantes")
		fmt.Println("5. Cerrar sesión")
		fmt.Println("****************************************************************")
		fmt.Print("Elige una opcion: ")
		fmt.Scan(&x)

		switch x {
		case 1:
			MenuPendientes(aceptados, colaPendientes, bitacora)
		case 2:
			aceptados.Listado()
		case 3:
			var carnet int32
			var nombre, pass string
			fmt.Println("\n*********** Registro de estudiantes - EDD GoDrive *************")
			fmt.Print("Ingresa el nombre: ")
			fmt.Scan(&nombre)
			fmt.Print("Ingresa carnet: ")
			fmt.Scan(&carnet)
			fmt.Print("Ingresa una Contraseña: ")
			fmt.Scan(&pass)
			colaPendientes.Agregar(carnet, nombre, pass)
			fmt.Println("\n-------Estudiante agregado a la cola de pendientes-------")
		case 4:
			fmt.Println("\n*********** Registro de estudiantes - EDD GoDrive *************")
			fmt.Print("Ingresa el nombre del archivo(en el mismo directorio): ")
			var nombreArchivo string
			fmt.Scan(&nombreArchivo)
			fmt.Println(colaPendientes.CargaMasiva(nombreArchivo))
		case 5:
			fmt.Println("\n------Sesión cerrada------")
		default:
			fmt.Println("\n------Advertencia: Ingresa una opción válida------")
		}
	}
}

func MenuPendientes(aceptados *listasEstudiantes.ListaAceptados, pendientes *listasEstudiantes.ColaPendientes, bitacora *listasEstudiantes.PilaAdmin) {
	for i := 0; i != 3; {
		if listasEstudiantes.ConteoPendientes == 0 {
			fmt.Println("\n-----No hay estudiantes pendientes en la cola----")
			return
		}
		fmt.Println("\n*********** Pendientes:", listasEstudiantes.ConteoPendientes, "- EDD GoDrive *************")
		fmt.Println("Estudiante actual:", pendientes.Primero.Nombre)
		fmt.Println("1. Aceptar al estudiantes")
		fmt.Println("2. Rechazar al estudiantes")
		fmt.Println("3. Volver al menú")
		fmt.Print("Elige una opcion: ")
		fmt.Scan(&i)
		switch i {
		case 1:
			eliminado := pendientes.EliminarPrimero()
			if eliminado != nil {
				aceptados.Agregar(eliminado)
				bitacora.Agregar("Se aceptó a " + eliminado.Nombre)
			}
		case 2:
			eliminado := pendientes.EliminarPrimero()
			bitacora.Agregar("Se rechazó a " + eliminado.Nombre)
		case 3:
		default:
			fmt.Println("\n------Advertencia: Ingresa una opción válida------")
		}
	}
}
