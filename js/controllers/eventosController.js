import { obtenerEventos, obtenerEventosPorId, crearEvento, actualizarEvento, cambiarEstadoEvento, eliminarEvento } from "../services/eventosService.js";
import { obtenerSalones } from "../services/salonesService.js";
import { obtenerClientes } from "../services/clientesService.js";

const tablaEvento = document.getElementById("tablaEvento")
const formularioEvento = document.getElementById("formularioEvento")
const tituloFormulario = document.getElementById("tituloFormulario")
const idEvento = document.getElementById("idEvento")
const nombreEvento = document.getElementById("nombreEvento")
const fechaEvento = document.getElementById("fechaEvento")
const cantidadPersonasEvento = document.getElementById("cantidadPersonasEvento")
const cantidadHorasEvento = document.getElementById("cantidadHorasEvento")
const selectClienteEvento = document.getElementById("selectClienteEvento")
const selectSalonEvento = document.getElementById("selectSalonEvento")
const selectEstadoEvento = document.getElementById("selectEstadoEvento")
const totalPagoEvento = document.getElementById("totalPagoEvento")
const btnEvento = document.getElementById("btnEvento")
const btnCancelarEvento = document.getElementById("btnCancelarEvento")

let listaSalones = [];
let estadoAnterior = "";


async function cargarSelectClientes() {
    const respuesta = await obtenerClientes();

    if (!respuesta.success) {
        alert(respuesta.message);
        return
    }

    selectClienteEvento.innerHTML = `<option value="">Selecciona el cliente</option>` +
        respuesta.data.map(cli => `<option value="${cli.idCliente}">${cli.nombre} ${cli.apellido}</option>`).join("");
}

async function cargarSelectSalones() {
    const respuesta = await obtenerSalones();

    if (!respuesta.success) {
        alert(respuesta.message);
        return
    }

    listaSalones = respuesta.data;
    selectSalonEvento.innerHTML = `<option value="">Selecciona el salon</option>` +
        listaSalones.map(salon => `<option value="${salon.idSalon}">${salon.nombreSalon} (${salon.capacidad} personas - $${salon.precioRenta.toFixed(2)} la hora)</option>`).join("");
}


function calcularTotal() {
    const salon = listaSalones.find(s => s.idSalon == selectSalonEvento.value);
    const horas = Number(cantidadHorasEvento.value);

    if (salon && horas > 0) {
        totalPagoEvento.value = `$${(horas * salon.precioRenta).toFixed(2)}`;
    } else {
        totalPagoEvento.value = "$0.00";
    }
}

selectSalonEvento.addEventListener("change", calcularTotal);
cantidadHorasEvento.addEventListener("input", calcularTotal);


async function cargarEventos() {
    const respuesta = await obtenerEventos();

    if (!respuesta.success) {
        alert(respuesta.message);
        return
    }

    if (respuesta.data.length === 0) {
        tablaEvento.innerHTML = `<tr><td colspan="9" class="text-center">No hay eventos registrados</td></tr>`
        return
    }

    tablaEvento.innerHTML = respuesta.data.map(evento => `
        <tr>
            <td>${evento.nombreEvento}</td>
            <td>${evento.nombreCliente}</td>
            <td>${evento.nombreSalon}</td>
            <td>${evento.fechaEvento}</td>
            <td>${evento.cantidadPersonas}</td>
            <td>${evento.cantidadHoras}</td>
            <td>${evento.estado}</td>
            <td class="text-end">
                <strong>$${evento.totalPago.toFixed(2)}</strong>
            </td>
            <td class="text-end text-nowrap">
                <button class="btn btn-sm btn-outline-warning btnEditar" data-id="${evento.idEvento}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${evento.idEvento}">Eliminar</button>
            </td>
        </tr>
    `).join("");

    document.querySelectorAll(".btnEditar").forEach(btn => {
        btn.addEventListener("click", () => editarEvento(btn.dataset.id));
    });

    document.querySelectorAll(".btnEliminar").forEach(btn => {
        btn.addEventListener("click", () => borrarEvento(btn.dataset.id));
    });
}


formularioEvento.addEventListener("submit", async (e) => {
    e.preventDefault();

    const salon = listaSalones.find(s => s.idSalon == selectSalonEvento.value);
    if (salon && Number(cantidadPersonasEvento.value) > salon.capacidad) {
        alert(`El ${salon.nombreSalon} solo tiene capacidad para ${salon.capacidad} personas`);
        return
    }

    const evento = {
        idCliente: Number(selectClienteEvento.value),
        idSalon: Number(selectSalonEvento.value),
        nombreEvento: nombreEvento.value.trim(),
        fechaEvento: fechaEvento.value,
        cantidadPersonas: Number(cantidadPersonasEvento.value),
        cantidadHoras: Number(cantidadHorasEvento.value)
    };

    try {
        let respuesta;

        if (idEvento.value === "") {
            respuesta = await crearEvento(evento);
        } else {
            respuesta = await actualizarEvento(idEvento.value, evento);

            if (respuesta.success && selectEstadoEvento.value !== estadoAnterior) {
                respuesta = await cambiarEstadoEvento(idEvento.value, selectEstadoEvento.value);
            }
        }

        if (!respuesta.success) {
            mostrarError(respuesta);
            return
        }

        alert(respuesta.message);
        limpiarFormulario();
        await cargarEventos();

    } catch (error) {
        alert("No se pudo conectar con la API")
    }
});


async function editarEvento(id) {
    try {
        const respuesta = await obtenerEventosPorId(id);

        if (!respuesta.success) {
            alert(respuesta.message);
            return
        }

        const evento = respuesta.data;
        idEvento.value = evento.idEvento;
        nombreEvento.value = evento.nombreEvento;
        fechaEvento.value = evento.fechaEvento;
        cantidadPersonasEvento.value = evento.cantidadPersonas;
        cantidadHorasEvento.value = evento.cantidadHoras;
        selectClienteEvento.value = evento.idCliente;
        selectSalonEvento.value = evento.idSalon;
        selectEstadoEvento.value = evento.estado;
        selectEstadoEvento.disabled = false;
        estadoAnterior = evento.estado;

        calcularTotal();
        tituloFormulario.textContent = "Editar Evento";
        btnEvento.textContent = "Actualizar";
        window.scrollTo(0, 0);

    } catch (error) {
        alert("No se pudo conectar con la API")
    }
}


async function borrarEvento(id) {
    if (!confirm("¿Seguro que quieres eliminar este evento?")) {
        return
    }

    try {
        const respuesta = await eliminarEvento(id);
        alert(respuesta.message);

        if (respuesta.success) {
            await cargarEventos();
        }
    } catch (error) {
        alert("No se pudo conectar con la API")
    }
}


function limpiarFormulario() {
    formularioEvento.reset();
    idEvento.value = "";
    selectEstadoEvento.value = "CONFIRMADO";
    selectEstadoEvento.disabled = true;
    estadoAnterior = "";
    totalPagoEvento.value = "$0.00";
    tituloFormulario.textContent = "Crear Evento";
    btnEvento.textContent = "Guardar";
}

function mostrarError(respuesta) {
    if (respuesta.data) {
        alert(Object.values(respuesta.data).join("\n"));
    } else {
        alert(respuesta.message);
    }
}

btnCancelarEvento.addEventListener("click", limpiarFormulario);
async function reiniciar() {
    limpiarFormulario();
    try {
        await cargarSelectClientes();
        await cargarSelectSalones();
        await cargarEventos();
    } catch (error) {
        alert("No se pudo conectar con la API")
    }
}

reiniciar();
