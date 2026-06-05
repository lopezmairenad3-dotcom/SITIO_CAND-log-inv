//el . es para una clase en los query selector


const productos = [
  //Computadoras
{
  id:"laptop_i9",
  titulo:"Laptop i9",
  imagen:"./img/computadoras/laptop 9.png",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
{
  id:"laptop_i5",
  titulo:"Laptop i5",
  imagen:"./img/computadoras/laptop 15.png",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
{
  id:"laptop_i5",
  titulo:"Laptop i5",
  imagen:"./img/computadoras/s-l1200.png",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
{
  id:"laptop_i5",
  titulo:"Laptop i7",
  imagen:"./img/computadoras/laptop-asus-tuf-f15.png",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
{
  id:"desktop01",
  titulo:"Gamer i7",
  imagen:"./img/computadoras/gamer desktop.jpg",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
{
  id:"desktop02",
  titulo:"Escritorio i7",
  imagen:"./img/computadoras/ASUS-2025-Consumer-Desktops-AIO-PC.jpg",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
{
  id:"desktop03",
  titulo:"Escritorio i5pro",
  imagen:"./img/computadoras/ASUS-All-in-One-Desktop-w-23-8-FHD-Touchscreen-Core-i5-8GB-512GB-SSD-White-A3402WBA.png",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
{
  id:"desktop04",
  titulo:"Escritorio mini i7, 16 RAM, SSD",
  imagen:"./img/computadoras/ASUS_ExpertCenter_PB64-minipc.png",
  categoria:{
    nombre:"Computadoras portátiles y de escritorio",
    id:"pc"
  },
  precio:350
},
//Accesorios para redes
{
  id:"redes_01",
  titulo:"Tester-redes 01",
  imagen:"./img/redes/tester01.png",
  categoria:{
    nombre:"Accesorios de redes",
    id:"net"
  },
  precio:350
},
{
  id:"redes_02",
  titulo:"Tester-redes 02",
  imagen:"./img/redes/tester02.png",
  categoria:{
    nombre:"Accesorios de redes",
    id:"net"
  },
  precio:350
},
{
  id:"redes_03",
  titulo:"Tester-redes 03",
  imagen:"./img/redes/tester03.png",
  categoria:{
    nombre:"Accesorios de redes",
    id:"net"
  },
  precio:350
},
{
  id:"redes_04",
  titulo:"Tester-redes 04",
  imagen:"./img/redes/fluke networks.jpeg",
  categoria:{
    nombre:"Accesorios de redes",
    id:"net"
  },
  precio:350
},
{
  id:"redes_05",
  titulo:"Cable UTP Cat6 05",
  imagen:"./img/redes/cables utp.png",
  categoria:{
    nombre:"Accesorios de redes",
    id:"net"
  },
  precio:350
},

//Accesorios
{
  id:"hdd_01",
  titulo:"Discos mecanicos",
  imagen:"./img/varios/92057_63.jpg.webp",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

{
  id:"hdd_02",
  titulo:"Disco duro mecánico 2 TB",
  imagen:"./img/varios/hdd_mec01.webp",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

{
  id:"hdd_03",
  titulo:"Disco duro mecánico 16 TB",
  imagen:"./img/varios/hdd_mec02.jpg",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

{
  id:"hdd_04",
  titulo:"Disco duro mecánico 16 TB",
  imagen:"./img/varios/hdd_mec03.jpg",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

{
  id:"hdd_05",
  titulo:"Discos SSD",
  imagen:"./img/varios/internal-ssd-sata-m2-nvme-comparison.avif",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

{
  id:"hdd_06",
  titulo:"Disco SSD SATA",
  imagen:"./img/varios/sata_ssd01.jpg",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

{
  id:"memram_pc01",
  titulo:"Memorias RAM-PC 1",
  imagen:"./img/varios/memorias_ram_all.jpeg",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:925
},
{
  id:"memram_laptop01",
  titulo:"Memorias RAM-laptop 1",
  imagen:"./img/varios/memram_laptop_all05.jpg",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:925
},

{
  id:"memram_laptop02",
  titulo:"Memorias RAM-laptop 2",
  imagen:"./img/varios/memram_laptop01.jpg",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

{
  id:"memram_laptop03",
  titulo:"Memorias RAM-laptop 3",
  imagen:"./img/varios/memram_laptop02.webp",
  categoria:{
    nombre:"Accesorios",
    id:"varios"
  },
  precio:500
},

];

const contenedorProductos=document.querySelector("#contenedor-productos");
const botonesCategorias=document.querySelectorAll(".boton-categoria");
const tituloPrincipal=document.querySelector("#titulo-principal");
let botonesAgregar=document.querySelectorAll(".producto-agregar");
const numerito=document.querySelector("#numerito");

//function cargarProductos(){
//función para agregar los datos de cada producto
  function cargarProductos(productosElegidos){
//productos.forEach(producto=>{
  contenedorProductos.innerHTML="";
  productosElegidos.forEach(producto=>{
  const div=document.createElement("div");
  div.classList.add("producto");
  div.innerHTML=`
  <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
  <div class="producto-detalles">
      <h3 class="producto-titulo">${producto.titulo}</h3>
      <p class="producto-precio">C$${producto.precio}</p>
      <button class="producto-agregar" id="${producto.id}">Agregar</button>
  </div>
  `;
  contenedorProductos.append(div);

})
actualizarBotonesAgregar();
}
 

//cargarProductos();
cargarProductos(productos);
//cargar los pantallas según el menú
botonesCategorias.forEach(boton=>{
  boton.addEventListener("click", (e)=>{
      botonesCategorias.forEach(boton=>boton.classList.remove("active"));
      e.currentTarget.classList.add("active");

      if(e.currentTarget.id ==="about"){
        contenedorProductos.innerHTML="";
         tituloPrincipal.innerText="BIENVENIDOS A TECNOCAND"
         const div=document.createElement("div");
         div.innerHTML=`
          <div class="tienda">
            <img class="logo-imagen" src="./img/logo/logo cand sosti.png" alt="">
            <div class="tienda-detalles">
                         
             <ul class="menu">
             <li>
             <h1>BIENVENIDOS A SU TIENDA TECNOCAND</h1>
             </li>
             <li> 
             <p class="menu-detalles">SOMOS SU SOLUCIÓN TECNOLOGICA.</p>
             </li>
             <li>
             <p class="menu-detalles">CON NOSOTROS ENCONTRARÁS LA MEJOR CALIDAD EN COMPUTADORAS DE ESCRITORIO, PORTÁTILES, REDES Y ACCESORIOS.</p>
             </li>
             <li>
            <p class="menu-detalles"> ELIGE NUESTRA TIENDA TECNOCAND TU SOS EN TI ... ¡VIVE EL MUNDO TECNOLOGICO CON CONFIANZA!</p>
            </li>
            </ul>
            
           </div>
        </div>
         `;
         contenedorProductos.append(div);
      }

      if(e.currentTarget.id ==="contacto"){
        contenedorProductos.innerHTML="";
         tituloPrincipal.innerText="BIENVENIDOS A TECNOCAND"
         const div=document.createElement("div");
         div.innerHTML=`
          
         
         <div class="tienda">
           <img class="logo-imagen" src="./img/logo/logo cand sosti.png" alt="">
           <div class="tienda-detalles">
             
            
             <ul class="menu">
             <li>
              <h1>CONTÁCTANOS</h1>
              </li>
             <li>
             <p class="menu-detalles"><i class="bi bi-whatsapp"></i>WHATSAPP: 5866-1403</p>
             </li>
             <li>
             <p class="menu-detalles"><i class="bi bi-facebook"></i>FACEBOOK:TECNOCAND Nicaragua</p>
             </li>
             <li>
             <p class="menu-detalles"><i class="bi bi-instagram"></i>INSTAGRAM:TECNOCAND_NI</p>
             </li>
              <li>
              <p class="menu-detalles"> ELIGE NUESTRA TIENDA TECNOCAND ... ¡VIVE EL MUNDO TECNOLOGICO CON CONFIANZA!</p>
             </li>
            </ul>
           
          </div>
         </div>
         `;
         contenedorProductos.append(div);
      }

      if(e.currentTarget.id !="todos"){
        const productoCategoria=productos.find(producto=>producto.categoria.id===e.currentTarget.id);
        tituloPrincipal.innerText=productoCategoria.categoria.nombre;

        const productosBoton=productos.filter(producto=>producto.categoria.id===e.currentTarget.id);
        cargarProductos(productosBoton);
      }else{
        tituloPrincipal.innerText="BIENVENIDOS A TECNOCAND"
        cargarProductos(productos);
      }

     
     
  })
});

//función para el botón agregar que va a escuchar la función agregarAlCarrito
function actualizarBotonesAgregar(){
  botonesAgregar=document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach(boton=>{
    boton.addEventListener("click", agregarAlCarrito);
  });
}

//const productosEnCarrito=[];
//para que al regresar al inicio si hay productos en el carrito no se limpie el contador
let productosEnCarrito;

let productosEnCarritoLS=localStorage.getItem("productos-en-carrito");
//const productosEnCarritoLS=JSON.parse(localStorage.getItem("productos-en-carrito")); 

if(productosEnCarritoLS){
  productosEnCarrito=JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
}else{
  productosEnCarrito=[];
}


//función para agregar al carrito los productos que vayamos seleccionando
function agregarAlCarrito(e){
const idBoton=e.currentTarget.id;
const productoAgregado=productos.find(producto=>producto.id===idBoton);

if(productosEnCarrito.some(producto=>producto.id===idBoton)){
  const index=productosEnCarrito.findIndex(producto=>producto.id===idBoton);
  productosEnCarrito[index].cantidad++;
}else{
  productoAgregado.cantidad=1;
  productosEnCarrito.push(productoAgregado);
}
actualizarNumerito();
//guardando lo que agreguemos al carrito en el localstorage
localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

//actualizamos el numerito que aparece a la par del menú Carrito
function actualizarNumerito(){
 let nuevoNumerito=productosEnCarrito.reduce((acc, producto)=>acc+producto.cantidad,0);
  numerito.innerText=nuevoNumerito;
}
// cargar productos desde mySQL
fetch('http://localhost:3000/productos')
    .then(res => res.json())
    .then(productosDB => {
      productosDB.forEach(p => {
          if (!productos.some(prod => prod.titulo === p.nombre)) {
              productos.push({
                  id: 'db_' + p.id,
                  titulo: p.nombre,
                  precio: p.precio,
                  categoria: { id: p.categoria, nombre: p.categoria },
                  imagen: p.imagen
              });
          }
      });
      renderizarProductos(productos);
                  
  });
