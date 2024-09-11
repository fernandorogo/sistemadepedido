// scripts.js

const productos = [
  { id: 1, nombre: 'COSTILLA AHUMADA AL HORNO', precio: 38000, imagen: 'images/producto1.jpeg' },
  { id: 2, nombre: 'FILETE DE MOJARRA', precio: 21000, imagen: 'images/producto2.jpeg' },
  { id: 3, nombre: 'PINCHO DE RES-POLLO', precio: 21000, imagen: 'images/producto3.jpeg' },
  { id: 4, nombre: 'PICADA PARA DOS PERSONAS ', precio: 25000, imagen: 'images/producto4.jpeg' },
  { id: 5, nombre: 'POLLO AL HORNO', precio: 23000, imagen: 'images/producto5.jpeg' },
  { id: 6, nombre: 'HAMBURGUESA DOBLE CARNE CON PAN', precio: 17000, imagen: 'images/producto6.jpeg' },
  { id: 7, nombre: 'TENTACIÓN', precio: 27000, imagen: 'images/producto7.jpeg' },
  { id: 8, nombre: 'CHOCOLIFE', precio: 27000, imagen: 'images/producto8.jpeg' },
  { id: 9, nombre: 'ENSUEÑO', precio: 27000, imagen: 'images/producto9.jpeg' },
  { id: 10, nombre: 'MILADA', precio: 28000, imagen: 'images/producto10.jpeg' },
  { id: 11, nombre: 'PALENQUERA', precio: 27000, imagen: 'images/producto11.jpeg' }
  // Agrega más productos aquí
];

const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function cargarProductos() {
  const productosContainer = document.getElementById('productos');
  productos.forEach(producto => {
    productosContainer.innerHTML += `
      <div class="col-md-4">
        <div class="card product-card">
          <img src="${producto.imagen}" class="card-img-top product-image" alt="${producto.nombre}">

          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$${producto.precio.toFixed(2)}</p>
            <div class="mb-2">
              <label for="cantidad-${producto.id}" class="form-label">Cantidad</label>
              <input type="number" id="cantidad-${producto.id}" class="form-control" value="1" min="1">
            </div>
            <div class="d-flex justify-content-between">
              <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
              <button class="btn btn-success" onclick="irAlCarrito()">
                <i class="fas fa-shopping-cart"></i> Ir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function irAlCarrito() {
  window.location.href = 'carrito.html';  // Reemplaza con la URL de tu página de carrito
}


function agregarAlCarrito(id) {
  const cantidadInput = document.getElementById(`cantidad-${id}`);
  const cantidad = parseInt(cantidadInput.value, 10);
  const producto = productos.find(p => p.id === id);

  const itemExistente = carrito.find(p => p.id === id);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();

  // Mostrar alerta con SweetAlert2
  Swal.fire({
    title: 'Producto agregado',
    text: `El producto ${producto.nombre} ha sido agregado al carrito.`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}


function actualizarContadorCarrito() {
  const carritoCount = document.getElementById('carrito-count');
  carritoCount.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
}

function cargarCarrito() {
  const carritoContainer = document.getElementById('carrito');
  let total = 0;
  carritoContainer.innerHTML = ''; // Limpia el carrito antes de cargar
  
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    carritoContainer.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>$${item.precio.toFixed(2)}</td>
        <td><input type="number" value="${item.cantidad}" min="1" class="form-control" onchange="actualizarCantidad(${item.id}, this.value)"></td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="btn btn-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
      </tr>
    `;
    total += subtotal;
  });

  document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;

  Swal.fire({
    title: 'Carrito cargado',
    text: 'El carrito se ha cargado correctamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}


function actualizarCantidad(id, cantidad) {
  const item = carrito.find(p => p.id === id);
  if (item) {
    item.cantidad = parseInt(cantidad, 10);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
    actualizarContadorCarrito();
  }
}

function eliminarDelCarrito(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const index = carrito.findIndex(p => p.id === id);
      if (index > -1) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
        actualizarContadorCarrito();

        Swal.fire(
          'Eliminado!',
          'El producto ha sido eliminado del carrito.',
          'success'
        );
      }
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productos')) {
    cargarProductos();
  }
  if (document.getElementById('carrito')) {
    cargarCarrito();
  }
  actualizarContadorCarrito();
});

function mostrarFormularioCliente() {
  document.getElementById('formulario-cliente').style.display = 'block';
  document.getElementById('carrito-container').style.display = 'none';
}

// Manejamos el envío del formulario del cliente
document.getElementById('clienteForm').addEventListener('submit', function(event) {
  event.preventDefault();  // Evitar el envío por defecto del formulario

  // Obtener la información del cliente
  const nombre = document.getElementById('nombre').value;
  const direccion = document.getElementById('direccion').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;

  const cliente = {
    nombre: nombre,
    direccion: direccion,
    telefono: telefono,
    correo: correo
  };

  // Obtener los datos del carrito
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Combinar la información del cliente con los productos del carrito
  const pedido = {
    cliente: cliente,
    productos: carrito
  };

  // Enviar el pedido al servidor o al encargado
  enviarPedido(pedido);
});


document.addEventListener('DOMContentLoaded', function() {
  // Simulamos un número de orden
  const numeroOrden = Math.floor(Math.random() * 100000);
  document.getElementById('numero-orden').innerText = numeroOrden;

  // Cargar productos del pedido desde el almacenamiento local (localStorage)
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const detalleProductos = document.getElementById('detalle-productos');
  let totalCompra = 0;

  carrito.forEach(producto => {
    const totalProducto = producto.precio * producto.cantidad;
    totalCompra += totalProducto;

    // Crear una fila para cada producto en la tabla
    const fila = `
      <tr>
        <td>${producto.nombre}</td>
        <td>$${producto.precio.toFixed(2)}</td>
        <td>${producto.cantidad}</td>
        <td>$${totalProducto.toFixed(2)}</td>
      </tr>
    `;
    detalleProductos.innerHTML += fila;
  });

  // Mostrar el total de la compra
  document.getElementById('total-compra').innerText = `$${totalCompra.toFixed(2)}`;
});

function actualizarEstadoPedido() {
  const estado = document.getElementById('estado-pedido').value;
  
  // Aquí puedes enviar el estado actualizado al servidor o realizar otra acción
  alert(`El estado del pedido ha sido actualizado a: ${estado}`);
}


