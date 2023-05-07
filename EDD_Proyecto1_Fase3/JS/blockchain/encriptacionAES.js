const clave = 'clave-secreta'
const buffer = new ArrayBuffer(16)
const view = new Uint8Array(buffer)
for (let i = 0; i < clave.length; i++) {
    view[i] = clave.charCodeAt(i)
}
let iv = null
if (localStorage.getItem("iv") != null) {
    // Recuperar Uint8Array desde la cadena JSON
    const parsedArray = JSON.parse(localStorage.getItem("iv"));
    iv = new Uint8Array(parsedArray);
}else{
    iv = crypto.getRandomValues(new Uint8Array(16))
    const array = Array.from(iv);
    const jsonString = JSON.stringify(array);
    localStorage.setItem("iv", jsonString)
}
//console.log(iv)
const algoritmo = { name: 'AES-GCM', iv: iv }

async function encriptacion(mensaje) {
    const enconder = new TextEncoder()
    const data = enconder.encode(mensaje)

    const claveCrypto = await crypto.subtle.importKey('raw', view, 'AES-GCM', true, ['encrypt'])

    const mensajeCifrado = await crypto.subtle.encrypt(algoritmo, claveCrypto, data)

    const cifradoBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(mensajeCifrado)))
    return cifradoBase64;
}

async function desencriptacion(mensaje) {
    const mensajeCifrado = new Uint8Array(atob(mensaje).split('').map(char => char.charCodeAt(0)))
    const claveCrypto = await crypto.subtle.importKey('raw', view, 'AES-GCM', true, ['decrypt'])
    const mensajeDescifrado = await crypto.subtle.decrypt(algoritmo, claveCrypto, mensajeCifrado)
    const decoder = new TextDecoder()
    const mensajeOriginal = decoder.decode(mensajeDescifrado)
    return mensajeOriginal
}

export { encriptacion, desencriptacion }
