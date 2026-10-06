import { URL_SALONES } from "../api.js";

export async function obtenerSalones(){
    const respuesta = await fetch(URL_SALONES)
    return await respuesta.json();
}

export async function obtenerSalonesPorId(id){
    const respuesta = await fetch(`${URL_SALONES}/${id}`)
    return await respuesta.json();
}
