
document.addEventListener('DOMContentLoaded', function() {
    const miBoton = document.getElementById('miBoton');

    miBoton.addEventListener('click', guardar);

    function guardar() {
        const nombre = document.getElementById('nombre').value;
        console.log();
    }
});
const carrito = cargarCarritoDesdeLocalStorage() || [];

document.addEventListener('click', function (event) {
    if (event.target.id === 'carrito-icono') {
        mostrarCarrito();
    } else if (event.target.classList.contains('agregar-al-carrito')) {
        const nombre = event.target.getAttribute('data-nombre');
        const precio = parseFloat(event.target.getAttribute('data-precio'));

        // Mostrar el formulario flotante
        document.getElementById('formularioFlotante').style.display = 'block';

        // Configurar el manejo del formulario
        const formularioCarrito = document.getElementById('formularioCarrito');
        formularioCarrito.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obtener valores del formulario
            const cantidad = parseInt(document.getElementById('cantidad').value, 10);
            const cuotas = parseInt(document.getElementById('cuotas').value, 10);

            // Agregar al carrito
            agregarAlCarrito(nombre, precio, cantidad, cuotas);

            // Ocultar el formulario flotante
            document.getElementById('formularioFlotante').style.display = 'none';

            // Mostrar el carrito actualizado
            mostrarCarrito();
        });
    } else if (event.target.id === 'cerrar-carrito') {
        cerrarCarrito();
    } else if (event.target.id === 'vaciar-carrito') {
        vaciarCarrito();
        mostrarCarrito(); // Actualiza la vista del carrito después de vaciarlo
    } else if (event.target.classList.contains('eliminar-producto')) {
        const index = parseInt(event.target.getAttribute('data-index'), 10);
        eliminarProducto(index);
        mostrarCarrito();
    }
});

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : null;
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio, cantidad, cuotas) {
    document.getElementById('formularioFlotante').style.display = 'block';
    const productoExistente = carrito.find(producto => producto.nombre === nombre);

    // Recargo según la tarjeta
    const recargo = calcularRecargo(cuotas);

    if (productoExistente) {
        // Si ya está en el carrito, puedes aumentar la cantidad o mostrar un mensaje
        productoExistente.cantidad += cantidad;
        productoExistente.recargo = recargo;
    } else {
        // Si no está en el carrito, agrégalo
        carrito.push({ nombre, precio, cantidad, recargo });
    }

    // Guardar en localStorage
    guardarCarritoEnLocalStorage();
}

function mostrarCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.innerHTML = '';

    carrito.forEach((producto, index) => {
        const productoDiv = document.createElement('div');
        productoDiv.textContent = `${producto.nombre} - $${(producto.precio * producto.cantidad).toFixed(2)} (${producto.cantidad}x)`;

        // Mostramos el recargo si está definido
        if (producto.recargo !== undefined) {
            productoDiv.innerHTML += `<br>Recargo: $${producto.recargo.toFixed(2)}`;
        }

        // Botón de eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.classList.add('eliminar-producto');
        eliminarBtn.setAttribute('data-index', index);
        productoDiv.appendChild(eliminarBtn);

        carritoContainer.appendChild(productoDiv);
    });

    // También puedes agregar el total del carrito
    const totalDiv = document.createElement('div');
    const total = carrito.reduce((acc, producto) => acc + (producto.precio + producto.recargo) * producto.cantidad, 0);
    totalDiv.textContent = `Total del carrito: $${total.toFixed(2)}`;
    carritoContainer.appendChild(totalDiv);

    // Botón de vaciar
    const vaciarBtn = document.createElement('button');
    vaciarBtn.textContent = 'Vaciar Carrito';
    vaciarBtn.id = 'vaciar-carrito';
    vaciarBtn.addEventListener('click', vaciarCarrito);
    carritoContainer.appendChild(vaciarBtn);

    // Botón de cierre
    const cerrarBtn = document.createElement('button');
    cerrarBtn.textContent = 'Cerrar';
    cerrarBtn.id = 'cerrar-carrito';
    cerrarBtn.addEventListener('click', cerrarCarrito);
    carritoContainer.appendChild(cerrarBtn);

    // Muestra el carrito (puedes personalizar el estilo)
    carritoContainer.style.display = 'block';
}

function cerrarCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.style.display = 'none';
}

function vaciarCarrito() {
    carrito.length = 0; // Vacía el array del carrito
    // Limpiar localStorage
    localStorage.removeItem('carrito');
}

function eliminarProducto(index) {
    carrito.splice(index, 1); // Elimina el producto en el índice especificado
    // Actualizar localStorage después de eliminar un producto
    guardarCarritoEnLocalStorage();
}

function calcularRecargo(cuotas) {
    // Modifica esta función según tus necesidades específicas
    const recargoPorCuota = 0.05; // 5% de recargo por cuota
    return cuotas * recargoPorCuota;
}

// Ejemplo de carga de datos desde una API externa usando fetch
fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(data => nombre = data.userId)
    .catch(error => console.error('Error:', error));

// Ejemplo de carga de datos desde un JSON local
const jsonDataLocal = {
    "nombre": "Producto desde JSON local",
    "precio": 19.99
};
if (carrito.length > 0) {
    mostrarCarrito();
}
