document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("isLoggedIn") == "true") {
    localStorage.setItem("isLoggedIn", "false");
  }
  e.stopPropagation;
});

let btnLogin = document.querySelector("#login");
btnLogin.addEventListener("click", (e) => {
  e.preventDefault;
  let nombre = document.getElementById("carnet").value;
  let contra = document.getElementById("pass").value;
  if (nombre == "admin" && contra == "admin") {
    localStorage.setItem("isLoggedIn", "true");
    location.href = "admin.html";
    return;
  }
  let arbol = JSON.parse(localStorage.getItem("arbol"));
  let existe = buscar(parseInt(nombre), arbol.raiz)
  if (existe == null){
    alert("El usuario no existe")
  }else if (existe.pass == contra){
    localStorage.setItem("carnet", nombre);
    localStorage.setItem("isLoggedIn", "true");
    alert("Bienvenido " + nombre)
    location.href = "usuario.html";
  }else {
    alert("El usuario y contraseña no coinciden, por favor revise sus datos");
  }
});

function buscar(carnet, nodo) {
  if (nodo != null) {
    if (nodo.carnet == carnet) {
      return nodo;
    } else if (nodo.carnet > carnet) {
      return buscar(carnet, nodo.izquierdo);
    } else {
      return buscar(carnet, nodo.derecho);
    }
  } else {
    return null;
  }
}
