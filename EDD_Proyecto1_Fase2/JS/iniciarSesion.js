document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("isLoggedIn") == "true") {
    // Usuario ha iniciado sesión
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
    alert("Bienvenido " + nombre);
    //localStorage.setItem("Nombre", document.getElementById("nombre").value);
    location.href = "admin.html";
  } else {
    alert("El usuario y contraseña no coinciden, por favor revise sus datos");
  }
});
