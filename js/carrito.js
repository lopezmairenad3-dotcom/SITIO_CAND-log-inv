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
    

    }else
    {

    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
    }
    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito();


//función para el botón eliminar que va a escuchar la función eliminarDelCarrito
function actualizarBotonesEliminar()
{
    botonesEliminar=document.querySelectorAll(".carrito-producto-eliminar");
  
    botonesEliminar.forEach(boton=>{
      boton.addEventListener("click", eliminarDelCarrito);
    });
  }

  //función para eliminar del carrito los productos que se seleccionaron
  function eliminarDelCarrito(e)
  {
    const idBoton=e.currentTarget.id;
    //const productoEliminado=productosEnCarrito.find(producto=>producto.id===idBoton);
    const index=productosEnCarrito.findIndex(producto=>producto.id===idBoton);

    productosEnCarrito.splice(index,1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito",JSON.stringify(productosEnCarrito));

  }

  botonVaciar.addEventListener("click", vaciarCarrito);

  //funcion para que funcione el boton vaciar el carrito
  function vaciarCarrito()
  {
    productosEnCarrito.length=0;
    localStorage.setItem("productos-en-carrito",JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
  }


//funcion para actualizar el total
function actualizarTotal()
{
  const totalCalculado=productosEnCarrito.reduce((acc, producto)=>acc+(producto.precio *producto.cantidad),0);
  total.innerText=`C$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

  //funcion para que funcione el boton comprar
  function comprarCarrito() {
      const total = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
      
      fetch('http://localhost:3000/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario_id: 1, total, productos: productosEnCarrito }) 
      })
      .then(res => res.json())
      .then(datos => {
          if (datos.ok) {
              productosEnCarrito.length = 0;
              localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
              contenedorCarritoVacio.classList.add("disabled");
              contenedorCarritoProductos.classList.add("disabled");
              contenedorCarritoAcciones.classList.add("disabled");
              contenedorCarritoComprado.classList.remove("disabled");
          }
      });
  }        

  
    
    

    
    
    
  
