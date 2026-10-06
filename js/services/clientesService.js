import { URL_CLIENTES } from "../api.js";

export async function obtenerClientes(){
    const respuesta = await fetch(URL_CLIENTES)
    return await respuesta.json();
}

export async function obtenerClientesPorId(id){
    const respuesta = await fetch(`${URL_CLIENTES}/${id}`)
    return await respuesta.json();
}

export async function crearClientes(clientes) {
    const respuesta = await fetch(URL_CLIENTES, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(clientes)
    });
    return await respuesta.json();
}

export async function actualizarClientes(id, clientes) {
    const respuesta = await fetch(`${URL_CLIENTES}/${id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(clientes)
    })
    return await respuesta.json();
}

export async function eliminarClientes(id) {
    const respuesta = await fetch(`${URL_CLIENTES}/${id}`, {
        method: "DELETE"
    });

    return await respuesta.json();
}
