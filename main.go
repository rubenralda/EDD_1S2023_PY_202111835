package main

import (
	"fmt"

	"ruben.info/proyecto1/listasEstudiantes"
)

func main() {
	fmt.Println("Hola")
	colaPendientes := listasEstudiantes.ColaPendientes{}
	for i := 0; i != 2; {
		fmt.Println("\n********************** EDD Drive *******************************")
		fmt.Println("1. Iniciar sesión")
		fmt.Println("2. Salir del sistema")
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
				menuAdmin(&colaPendientes)
			}
		case 2:
			fmt.Println("Adios")
		default:
			fmt.Println("Ingresa una opción valida")
		}
	}
}

func menuAdmin(colaPendientes *listasEstudiantes.ColaPendientes) {
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
		case 3:
			var carnet int32
			var nombre, pass string
			fmt.Print("Ingresa el nombre: ")
			fmt.Scan(&nombre)
			fmt.Print("Ingresa carnet: ")
			fmt.Scan(&carnet)
			fmt.Print("Ingresa una Contraseña: ")
			fmt.Scan(&pass)
			colaPendientes.Agregar(carnet, nombre, pass)
			colaPendientes.Mostrar()
		case 4:
			fmt.Print("Ingresa el nombre del archivo: ")
			var nombreArchivo string
			fmt.Scan(&nombreArchivo)
			fmt.Println(colaPendientes.CargaMasiva(nombreArchivo))
			colaPendientes.Mostrar()
		case 5:
			fmt.Println("Sesión cerrada")
		default:
			fmt.Println("Ingresa una opcion válida")
		}
	}
}
