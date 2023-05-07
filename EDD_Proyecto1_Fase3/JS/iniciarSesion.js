const btnLogin = document.querySelector("#login");

document.addEventListener("DOMContentLoaded", function (e) {
  if (localStorage.getItem("isLoggedIn") == "true") {
    localStorage.setItem("isLoggedIn", "false");
  }
  e.stopPropagation;
});


btnLogin.addEventListener("click", (e) => {
  e.preventDefault;
  let nombre = document.getElementById("carnet").value;
  let contra = document.getElementById("pass").value;
  if (nombre == "admin" && contra == "admin") {
    localStorage.setItem("isLoggedIn", "true");
    location.href = "admin.html";
    return;
  }
  /*let arbol = JSON.parse(localStorage.getItem("arbol"));
  let existe = buscar(parseInt(nombre), arbol.raiz);*/
  let existe = buscarHashTable(parseInt(nombre))
  if (existe == null) {
    alert("El usuario no existe");
  } else if (atob(existe.passEncriptado) == contra) {
    localStorage.setItem("carnet", nombre);
    localStorage.setItem("isLoggedIn", "true");
    alert("Bienvenido " + nombre);
    location.href = "usuario.html";
  } else {
    alert("El usuario y contraseña no coinciden, por favor revise sus datos");
  }
});

function buscarHashTable(carnet) {
  const tablaHash = JSON.parse(localStorage.getItem("tablaHash"))
  console.log(tablaHash)
  let address = hashFunction(carnet, tablaHash);
  if (address == -1) {
    return null
  }
  console.log(address);
  return tablaHash.data[address];
}

function hashFunction(carnet, tablaHash) {
  console.log(typeof(carnet))
  let hash = 0;
  for (let i = 0; i < carnet.length; i++) {
      hash = hash + carnet.charCodeAt(i);
  }
  hash = hash % tablaHash.data.length;

  if (tablaHash.data[hash] && tablaHash.data[hash].carnet == carnet) {
    return hash;
  }
  if (tablaHash.data[hash]) {
    hash = hashColition(hash, tablaHash, carnet);
  }
  return hash;
}

function hashColition(hash, tablaHash, carnet) {
  let newHash = hash;
  let quadratic = 1;
  while (tablaHash.data[newHash]) {
      newHash = newHash + Math.pow(quadratic, 2);
      if (tablaHash.data[newHash] && tablaHash.data[newHash].carnet == carnet) {
        return newHash;
      }
      quadratic++;
  }
  return -1;
}

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
