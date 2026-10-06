import { obtenerSalones } from "../services/salonesService.js";

const tablaSalones = document.getElementById("tablaSalones")

async function cargarSalones() {
    try {
        const respuesta = await obtenerSalones();

        if (!respuesta.success) {
            alert(respuesta.message);
            return
        }

        if (respuesta.data.length === 0) {
            tablaSalones.innerHTML = `<tr><td colspan="4" class="text-center">No hay salones registrados</td></tr>`
            return
        }

        tablaSalones.innerHTML = respuesta.data.map(salon => `
            <tr>
                <td>${salon.nombreSalon}</td>
                <td>${salon.capacidad} personas</td>
                <td>$${salon.precioRenta.toFixed(2)} por hora</td>
                <td class="text-end">${salon.ubicacion || ""}</td>
            </tr>
        `).join("");

    } catch (error) {
        alert("No se pudo conectar con la API")
    }
}

cargarSalones();
