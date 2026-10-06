import { URL_EVENTOS } from "../api.js";

export async function obtenerEventos(){
    const respuesta = await fetch(URL_EVENTOS)
    return await respuesta.json();
}

export async function obtenerEventosPorId(id){
    const respuesta = await fetch(`${URL_EVENTOS}/${id}`)
    return await respuesta.json();
}

export async function crearEvento(evento) {
    const respuesta = await fetch(URL_EVENTOS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(evento)
    });
    return await respuesta.json();
}

export async function actualizarEvento(id, evento) {
    const respuesta = await fetch(`${URL_EVENTOS}/${id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(evento)
    })
    return await respuesta.json();
}

export async function cambiarEstadoEvento(id, estado) {
    const respuesta = await fetch(`${URL_EVENTOS}/${id}/estado`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ estado: estado })
    })
    return await respuesta.json();
}

export async function eliminarEvento(id) {
    const respuesta = await fetch(`${URL_EVENTOS}/${id}`, {
        method: "DELETE"
    });
    return await respuesta.json();
}
