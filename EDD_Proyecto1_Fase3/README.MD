| Carnet    | Nombre                      | Auxiliar |
| --------- | --------------------------- | -------- |
| 202111835 | Ruben Alejandro Ralda Mejia | Aldo Ebany Pérez Larios 

# Manual Técnico

## Estructuras principales
Para crear las estructuras de datos, se utilizarón las siguientes clases del archivo arbol.js y fueron exportadas en otros dos archivos.
~~~
class NodoPermiso
class NodoArchivos
class nodoCarpeta
class NodoBitacora
class nodoEstudiante
class ArbolAvl
~~~
**ArbolAvl** es la parte principal y contiene toda la información de la aplicación con una raíz de tipo **nodoEstudiante** estos con hijos izquierdo y derecho de la misma clase. La clase **nodoEstudiante** contiene la cabeza de la bitácora que es una lista simple circular y su carpeta raíz que es un árbol n-ario, el **nodoCarpeta** contiene estan todos sus hijos de la misma clase y una lista que funciona como una matriz dispersa de los archivos del estudiante. Los archivos contienen la cabeza al **NodoPermiso** donde enlaza como una lista simple. Los métodos del árbol AVL son los siguientes:
~~~
agregar(nombre, pass, carnet)
agregarNodo(nodoActual, nuevoNodo)
calcularFactorEquilibrio(nodo)
calcularAltura(nodo)
rotacionDerecha(nodoDesbalanceado)
rotacionIzquierda(nodoDesbalanceado)
~~~
## Inicio de sesión
Es la primera página, del archivo index.html valida si el usuario existe o las credenciales del administrador, utiliza un archivo javascript iniciarSesion.js donde se agrega la funcionalidad del botón con el evento click, valida si la contraseña y usuario es "admin" caso contrario obtiene el árbol guardado en localStore y lo convierte a objeto para realizar una busqueda 
~~~
function buscar(carnet, nodo)//retorna null o nodo usuario
~~~
## Menú administrador
Si las credenciales son válidas, carga la página admin.html aquí se tienen todas las opciones para la funcionalidad del resto de la aplicación. Los eventos click para todos los botones son, cargar el archivo, este valida si se cargó un archivo al input file, de ser así lo convierte a string y se parsea con json para obtener el objeto, se crea un objeto del árbol y se utiliza el método agregar, previamente explicado. Luego carga los datos a la tabla con el atributo innerHmtl utilizando la función:
~~~
function mostrarArbol(nodo)
~~~
retorna un string con el HTML, estan la última configuración para mostrar el recorrido del árbol en la tabla escogiendo de una lista desplegable, los métodos se invocan por la opción validad con un switch
~~~
function recorridoInOrden(nodo) 
function recorridoPostOrden(nodo) 
function recorridoPreOrden(nodo) 
~~~
## Menú usuario
Cuenta con un evento para cargar el árbol en el sistema y poder guardar las acciones del usuario.
~~~
document.addEventListener("DOMContentLoaded", (e) => {...})
function cargarCarnets(nodo, carnet) 
~~~
Y utiliza la otra función como apoyo para guardar la carpeta raíz y cargar los datos en la lista de carnet de permisos.

El resto de botónes:
~~~
btnCerrar.addEventListener("click", (e) => {...})
btnCrearCarpeta.addEventListener("click", (e) => {...})
btnEliminar.addEventListener("click", (e) => {...})
btnBuscar.addEventListener("click", (e) => {...})
inputArchivos.addEventListener("change", (e) => {...})
btnCarpetas.addEventListener("click", (e) => {...})
btnReporteArchivos.addEventListener("click", (e) => {...})
btnPermisos.addEventListener("click", (e) => {...})
btnBitacora.addEventListener("click", (e) => {...})
btnRaiz.addEventListener("click", (e) =>{...})
~~~
Y tienen como funciones de apoyo los siguientes:
~~~
function buscarCarpeta(nombre, nodo)
function reporteCarpetas(nodo)
function abrirArchivo(data64, tipo)
~~~
# Manual de usuario
## Inicio de sesión
Tendremos que iniciar sesión con las credenciales previamente cargadas por el administrador.

![Login](img/Captura%20de%20pantalla%20(451).png)

## Menú administrador
Si iniciamos sesión con las credenciales de administrador que estan cargadas en el sistema, nos redirrecciona a la siguiente página.

![admin](img/Captura%20de%20pantalla%20(450).png)

Tendremos varias opciones como inició se tendrá que cargar un archivo JSON y presionar el botón **Carga Masiva** Esto cargará el árbol y mostrará por defecto en la tabla, el recorrido en orden del árbol AVL.

![admin](img/Captura%20de%20pantalla%20(453).png)

Tendremos la opción de ver el recorrido pos-orden y pre-orden en la lista desplegable y presionar el botón **Mostrar Alumnos**.

Por último podemos visualizar como quedó el árbol AVL presionando el botón gris y mostrará el reporte más abajo.

![admin](img/Captura%20de%20pantalla%20(455).png)

## Menú usuario

Si se encuentran las credenciales previamente cargadas e iniciamos sesión nos redirecciona a la siguiente página.

![admin](img/Captura%20de%20pantalla%20(456).png)

Podemos crear carpetas colocando un nombre y presionando el botón **Crear carpeta**, la nueva carpeta se creará en la dirección actual, del mismo modo podremos eliminar una carpeta solo si esta existe. Si nos encontramos en el carpeta raíz, se puede eliminar esta y eliminará todo lo que tengamos en los directorios. 

Para subir archivos solo hay que presionar el botón azul y seleccionamos el archivo de tipo txt, pdf o imagén.

![admin](img/Captura%20de%20pantalla%20(457).png)

Para navegar entre las carpetas, se tiene una barra de busqueda donde se pone la dirección y seguido se presiona el botón **Buscar**. 

![admin](img/Captura%20de%20pantalla%20(458).png)

Si bajamos podemos observar el menú para otorgar permisos de nuestros archivos a otro usuario, escogiendo el carnet, el archivo y el permiso.

![admin](img/Captura%20de%20pantalla%20(459).png)

Por último tenemos los reportes, el reporte de carpetas es un árbol donde se puede visualizar 
la raíz y sus subcarpetas, estas a su vez sus otras subcarpetas. Si estamos en una carpeta con archivos podremos ver el reporte de archivos, abrirá en el navegador cada archivo guardado y mostrará en forma de matriz dispersa los permisos otorgados a los archivos. El último reporte es la bitácora que en forma de lista enlazada se guardan todas las acciones hechas por el usuario.