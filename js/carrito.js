//si hay algo en el carrito que aparezan los productos y se quite el mensaje de Carrito vacío
let productosEnCarrito=localStorage.getItem("productos-en-carrito");
productosEnCarrito=JSON.parse(productosEnCarrito);

const contenedorCarritoVacio=document.querySelector("#carrito-vacio");
const contenedorCarritoProductos=document.querySelector("#carrito-productos");
const contenedorCarritoAcciones=document.querySelector("#carrito-acciones");
const contenedorCarritoComprado=document.querySelector("#carrito-comprado");
let botonesEliminar=document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar=document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal=document.querySelector("#total");
const botonComprar=document.querySelector("#carrito-acciones-comprar");


//mandando a cargar los productos agregados y sus datos
function cargarProductosCarrito()
{
    if(productosEnCarrito && productosEnCarrito.length>0){
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoProductos.innerHTML="";

    productosEnCarrito.forEach(producto=>{
      const div=document.createElement("div");
      div.classList.add("carrito-producto");  
      div.innerHTML=`
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Título</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>C$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>C$${producto.precio*producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash"></i></button>
     `;
        contenedorCarritoProductos.append(div);
    })

    }else{
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
    }
    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito();

function actualizarBotonesEliminar(){
    botonesEliminar=document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton=>{
      boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e){
    const idBoton=e.currentTarget.id;
    const index=productosEnCarrito.findIndex(producto=>producto.id===idBoton);
    productosEnCarrito.splice(index,1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito",JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito(){
    productosEnCarrito.length=0;
    localStorage.setItem("productos-en-carrito",JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

function actualizarTotal(){
  const totalCalculado=productosEnCarrito.reduce((acc, producto)=>acc+(producto.precio *producto.cantidad),0);
  total.innerText=`C$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
  const total = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked') 
                        ? document.querySelector('input[name="paymentMethod"]:checked').value 
                        : 'efectivo';

  // Guardar copia de los productos antes de vaciar
  const productosComprados = JSON.parse(JSON.stringify(productosEnCarrito));

  fetch('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      usuario_id: 1, 
      total, 
      productos: productosEnCarrito,
      paymentMethod: paymentMethod 
    })
  })
  .then(res => res.json())
  .then(datos => {
    if (datos.ok) {
      productosEnCarrito.length = 0;
      localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
      contenedorCarritoVacio.classList.add("disabled");
      contenedorCarritoProductos.classList.add("disabled");
      contenedorCarritoAcciones.classList.add("disabled");
      contenedorCarritoComprado.classList.add("disabled");

      // Mostrar el bauche digital
      mostrarBauche(datos.pedido_id, productosComprados, total, paymentMethod);
    }
  })
  .catch(err => {
    alert('Error al procesar el pedido. Intente de nuevo.');
    console.error(err);
  });
}

// ============================================
// FUNCIÓN BAUCHE DIGITAL
// ============================================
function mostrarBauche(pedidoId, productos, total, metodoPago) {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-NI', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  const hora = ahora.toLocaleTimeString('es-NI', { 
    hour: '2-digit', minute: '2-digit' 
  });

  const metodoPagoTexto = metodoPago === 'tarjeta' 
    ? '💳 Tarjeta de Crédito / Débito' 
    : '💵 Pago en Efectivo (al recibir el pedido)';

  // Generar filas de productos
  const filasProductos = productos.map(p => `
    <tr>
      <td style="padding:8px 10px; border-bottom:1px solid #eee;">${p.titulo}</td>
      <td style="padding:8px 10px; border-bottom:1px solid #eee; text-align:center;">${p.cantidad}</td>
      <td style="padding:8px 10px; border-bottom:1px solid #eee; text-align:right;">C$${p.precio}</td>
      <td style="padding:8px 10px; border-bottom:1px solid #eee; text-align:right;">C$${p.precio * p.cantidad}</td>
    </tr>
  `).join('');

  // Crear el overlay con el bauche
  const overlay = document.createElement('div');
  overlay.id = 'bauche-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; box-sizing: border-box;
  `;

  overlay.innerHTML = `
    <div id="bauche-contenido" style="
      background: #fff; border-radius: 12px; max-width: 520px; width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3); font-family: Arial, sans-serif;
      max-height: 90vh; overflow-y: auto;
    ">
      <!-- Cabecera -->
      <div style="background: linear-gradient(135deg, #5b9bd5, #3a78b5); color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 6px;">🧾</div>
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 1px;">TECNOCAND</h2>
        <p style="margin: 4px 0 0; opacity: 0.85; font-size: 13px;">Comprobante de Compra</p>
      </div>

      <!-- Cuerpo -->
      <div style="padding: 25px;">

        <!-- Número de pedido y fecha -->
        <div style="display: flex; justify-content: space-between; background: #f0f6ff; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
          <div>
            <small style="color: #888; font-size: 11px;">N° DE PEDIDO</small>
            <p style="margin: 2px 0 0; font-weight: bold; font-size: 18px; color: #3a78b5;">#${String(pedidoId).padStart(5, '0')}</p>
          </div>
          <div style="text-align: right;">
            <small style="color: #888; font-size: 11px;">FECHA Y HORA</small>
            <p style="margin: 2px 0 0; font-size: 13px; color: #444;">${fecha}</p>
            <p style="margin: 0; font-size: 13px; color: #444;">${hora}</p>
          </div>
        </div>

        <!-- Tabla de productos -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="background: #f8f8f8;">
              <th style="padding: 8px 10px; text-align: left; font-size: 12px; color: #666; border-bottom: 2px solid #ddd;">PRODUCTO</th>
              <th style="padding: 8px 10px; text-align: center; font-size: 12px; color: #666; border-bottom: 2px solid #ddd;">CANT.</th>
              <th style="padding: 8px 10px; text-align: right; font-size: 12px; color: #666; border-bottom: 2px solid #ddd;">PRECIO</th>
              <th style="padding: 8px 10px; text-align: right; font-size: 12px; color: #666; border-bottom: 2px solid #ddd;">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${filasProductos}
          </tbody>
        </table>

        <!-- Total -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #3a78b5; color: white; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
          <span style="font-size: 15px; font-weight: bold;">TOTAL A PAGAR</span>
          <span style="font-size: 22px; font-weight: bold;">C$${total}</span>
        </div>

        <!-- Método de pago -->
        <div style="background: #f8f9fa; border-left: 4px solid #5b9bd5; border-radius: 4px; padding: 12px 16px; margin-bottom: 20px;">
          <small style="color: #888; font-size: 11px;">FORMA DE PAGO</small>
          <p style="margin: 4px 0 0; font-size: 14px; color: #333;">${metodoPagoTexto}</p>
          ${metodoPago === 'efectivo' ? `<p style="margin: 4px 0 0; font-size: 12px; color: #e67e22;"><i>⚠️ Tenga listo el monto exacto al recibir su pedido</i></p>` : ''}
        </div>

        <!-- Mensaje de gracias -->
        <div style="text-align: center; padding: 10px 0; border-top: 1px dashed #ddd; margin-bottom: 20px;">
          <p style="color: #3a78b5; font-weight: bold; margin: 0;">¡Gracias por su compra! 😊</p>
          <p style="color: #888; font-size: 12px; margin: 4px 0 0;">Nos pondremos en contacto pronto para coordinar la entrega.</p>
        </div>

        <!-- Botones -->
        <div style="display: flex; gap: 10px;">
          <button onclick="imprimirBauche()" style="
            flex: 1; padding: 12px; background: #3a78b5; color: white;
            border: none; border-radius: 8px; font-size: 14px; font-weight: bold;
            cursor: pointer; transition: background 0.2s;
          ">🖨️ Imprimir / Guardar PDF</button>
          <button onclick="cerrarBauche()" style="
            flex: 1; padding: 12px; background: #f0f0f0; color: #333;
            border: none; border-radius: 8px; font-size: 14px; font-weight: bold;
            cursor: pointer;
          ">✖ Cerrar</button>
        </div>

      </div>
    </div>

    <!-- Estilos de impresión -->
    <style>
      @media print {
        body * { visibility: hidden !important; }
        #bauche-contenido, #bauche-contenido * { visibility: visible !important; }
        #bauche-contenido { 
          position: fixed; left: 50%; top: 0;
          transform: translateX(-50%);
          width: 480px; box-shadow: none !important;
          max-height: none !important; overflow: visible !important;
        }
        #bauche-overlay { 
          position: fixed; top: 0; left: 0;
          background: white !important; 
        }
        button { display: none !important; }
      }
    </style>
  `;

  document.body.appendChild(overlay);
}

function imprimirBauche() {
  window.print();
}

function cerrarBauche() {
  const overlay = document.getElementById('bauche-overlay');
  if (overlay) overlay.remove();
  // Mostrar mensaje de compra completada
  contenedorCarritoComprado.classList.remove("disabled");
}
