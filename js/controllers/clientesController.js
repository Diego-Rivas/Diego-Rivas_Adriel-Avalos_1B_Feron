import { obtenerClientes, obtenerClientesPorId, crearClientes, actualizarClientes, eliminarClientes } from "../services/clientesService.js";

const tablaCliente = document.getElementById("tablaCliente")
const formularioCliente = document.getElementById("formularioCliente")
const tituloFormulario = document.getElementById("tituloFormulario")
const idCliente = document.getElementById("idCliente")
const nombreCliente = document.getElementById("nombreCliente")
const apellidoCliente = document.getElementById("apellidoCliente")
const telefonoCliente = document.getElementById("telefonoCliente")
const emailCliente = document.getElementById("emailCliente")
const direccionCliente = document.getElementById("direccionCliente")
const btnCliente = document.getElementById("btnCliente")
const btnCancelarCliente = document.getElementById("btnCancelarCliente")


async function cargarClientes() {
    try {
        const respuesta = await obtenerClientes();

        if (!respuesta.success) {
            alert(respuesta.message);
            return
        }

        if (respuesta.data.length === 0) {
            tablaCliente.innerHTML = `<tr><td colspan="6" class="text-center">No hay clientes registrados</td></tr>`
            return
        }

        tablaCliente.innerHTML = respuesta.data.map(cli => `
            <tr>
                <td>${cli.nombre}</td>
                <td>${cli.apellido}</td>
                <td>${cli.telefono}</td>
                <td>${cli.email}</td>
                <td>${cli.direccion || ""}</td>
                <td class="text-end text-nowrap">
                    <button class="btn btn-sm btn-outline-warning btnEditar" data-id="${cli.idCliente}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${cli.idCliente}">Eliminar</button>
                </td>
            </tr>
        `).join("");

        document.querySelectorAll(".btnEditar").forEach(btn => {
            btn.addEventListener("click", () => editarCliente(btn.dataset.id));
        });

        document.querySelectorAll(".btnEliminar").forEach(btn => {
            btn.addEventListener("click", () => borrarCliente(btn.dataset.id));
        });

    } catch (error) {
        alert("No se pudo cargar los clientes")
    }
}


formularioCliente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cliente = {
        nombre: nombreCliente.value.trim(),
        apellido: apellidoCliente.value.trim(),
        telefono: telefonoCliente.value.trim(),
        email: emailCliente.value.trim(),
        direccion: direccionCliente.value.trim()
    };

    try {
        let respuesta;

        if (idCliente.value === "") {
            respuesta = await crearClientes(cliente);
        } else {
            respuesta = await actualizarClientes(idCliente.value, cliente);
        }

        if (!respuesta.success) {
            mostrarError(respuesta);
            return
        }

        alert(respuesta.message);
        limpiarFormulario();
        await cargarClientes();

    } catch (error) {
        alert("No se pudo conectar con la API")
    }
});


async function editarCliente(id) {
    try {
        const respuesta = await obtenerClientesPorId(id);

        if (!respuesta.success) {
            alert(respuesta.message);
            return
        }

        const cli = respuesta.data;
        idCliente.value = cli.idCliente;
        nombreCliente.value = cli.nombre;
        apellidoCliente.value = cli.apellido;
        telefonoCliente.value = cli.telefono;
        emailCliente.value = cli.email;
        direccionCliente.value = cli.direccion || "";

        tituloFormulario.textContent = "Editar Cliente";
        btnCliente.textContent = "Actualizar";
        window.scrollTo(0, 0);

    } catch (error) {
        alert("No se pudo conectar con la API")
    }
}


async function borrarCliente(id) {
    if (!confirm("¿Seguro que quieres eliminar este cliente?")) {
        return
    }

    try {
        const respuesta = await eliminarClientes(id);
        alert(respuesta.message);

        if (respuesta.success) {
            await cargarClientes();
        }
    } catch (error) {
        alert("No se pudo conectar con la API")
    }
}


function limpiarFormulario() {
    formularioCliente.reset();
    idCliente.value = "";
    tituloFormulario.textContent = "Crear Cliente";
    btnCliente.textContent = "Guardar";
}

function mostrarError(respuesta) {
    if (respuesta.data) {
        alert(Object.values(respuesta.data).join("\n"));
    } else {
        alert(respuesta.message);
    }
}

btnCancelarCliente.addEventListener("click", limpiarFormulario);

cargarClientes();
