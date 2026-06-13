// Admin Panel JavaScript - Versión Mejorada
const API_URL = 'http://localhost:3000';

// ============================================
// 1. VARIABLES GLOBALES
// ============================================
let productosGlobal = [];
let usuariosGlobal = [];
let pedidosGlobal = [];
let chartCategorias = null;
let chartIngresos = null;

// ============================================
// 2. NAVEGACIÓN ENTRE TABS
// ============================================
document.querySelectorAll('[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.dataset.tab;
        
        document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
        document.getElementById(tabName).style.display = 'block';
        
        if (tabName === 'dashboard') loadDashboard();
        if (tabName === 'productos') loadProductos();
        if (tabName === 'usuarios') loadUsuarios();
        if (tabName === 'pedidos') loadPedidos();
    });
});

// ============================================
// 3. DASHBOARD CON GRÁFICOS
// ============================================
async function loadDashboard() {
    try {
        const [productos, usuarios, pedidos] = await Promise.all([
            fetch(`${API_URL}/productos`).then(r => r.json()),
            fetch(`${API_URL}/usuarios`).then(r => r.json()).catch(() => []),
            fetch(`${API_URL}/pedidos`).then(r => r.json()).catch(() => [])
        ]);
        
        productosGlobal = productos;
        usuariosGlobal = usuarios;
        pedidosGlobal = pedidos;
        
        document.getElementById('total-productos').textContent = productos.length;
        document.getElementById('total-usuarios').textContent = usuarios.length;
        document.getElementById('total-pedidos').textContent = pedidos.length;
        
        const totalIngresos = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
        document.getElementById('ingresos-totales').textContent = `$${totalIngresos.toFixed(2)}`;
        
        // Generar gráficos
        setTimeout(() => {
            generarGraficosCategorias(productos);
            generarGraficosIngresos(pedidos);
        }, 100);
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// Gráfico: Productos por categoría
function generarGraficosCategorias(productos) {
    const categoriaCount = {};
    productos.forEach(p => {
        categoriaCount[p.categoria] = (categoriaCount[p.categoria] || 0) + 1;
    });
    
    const ctx = document.getElementById('chart-categorias')?.getContext('2d');
    if (!ctx) return;
    
    if (chartCategorias) chartCategorias.destroy();
    
    chartCategorias = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoriaCount),
            datasets: [{
                data: Object.values(categoriaCount),
                backgroundColor: ['#0d6efd', '#198754', '#fd7e14', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Gráfico: Ingresos por día
function generarGraficosIngresos(pedidos) {
    // Agrupar por fecha
    const ingresosPorFecha = {};
    pedidos.forEach(p => {
        const fecha = new Date(p.fecha).toLocaleDateString('es-ES');
        ingresosPorFecha[fecha] = (ingresosPorFecha[fecha] || 0) + p.total;
    });
    
    // Últimos 7 días
    const ultimos7 = Object.entries(ingresosPorFecha).slice(-7);
    
    const ctx = document.getElementById('chart-ingresos')?.getContext('2d');
    if (!ctx) return;
    
    if (chartIngresos) chartIngresos.destroy();
    
    chartIngresos = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ultimos7.map(([fecha]) => fecha),
            datasets: [{
                label: 'Ingresos ($)',
                data: ultimos7.map(([, monto]) => monto),
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: '#0d6efd'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => '$' + v }
                }
            }
        }
    });
}

// ============================================
// 4. GESTIÓN DE PRODUCTOS
// ============================================
async function loadProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        productosGlobal = await response.json();
        
        renderizarProductos(productosGlobal);
        
        // Event listeners de búsqueda y filtro
        document.getElementById('search-productos').addEventListener('input', filtrarProductos);
        document.getElementById('filter-categoria').addEventListener('change', filtrarProductos);
        document.getElementById('btn-clear-filters').addEventListener('click', limpiarFiltrosProductos);
    } catch (error) {
        console.error('Error cargando productos:', error);
        document.getElementById('tabla-productos').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar</td></tr>';
    }
}

function renderizarProductos(productos) {
    const tabla = document.getElementById('tabla-productos');
    
    if (productos.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos</td></tr>';
        return;
    }
    
    tabla.innerHTML = productos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${parseFloat(p.precio).toFixed(2)}</td>
            <td><span class="badge bg-info">${p.categoria}</span></td>
            <td>
                ${p.imagen ? `<img src="${p.imagen}" style="max-width: 50px; border-radius: 4px;">` : '-'}
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProducto(${p.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filtrarProductos() {
    const search = document.getElementById('search-productos').value.toLowerCase();
    const categoria = document.getElementById('filter-categoria').value;
    
    const filtrados = productosGlobal.filter(p => {
        const cumpleSearch = p.nombre.toLowerCase().includes(search);
        const cumpleCategoria = !categoria || p.categoria === categoria;
        return cumpleSearch && cumpleCategoria;
    });
    
    renderizarProductos(filtrados);
}

function limpiarFiltrosProductos() {
    document.getElementById('search-productos').value = '';
    document.getElementById('filter-categoria').value = '';
    renderizarProductos(productosGlobal);
}

// ============================================
// 5. GESTIÓN DE USUARIOS
// ============================================
async function loadUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        usuariosGlobal = await response.json();
        
        renderizarUsuarios(usuariosGlobal);
        
        document.getElementById('search-usuarios').addEventListener('input', filtrarUsuarios);
        document.getElementById('btn-clear-search-usuarios').addEventListener('click', limpiarBuscaUsuarios);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        document.getElementById('tabla-usuarios').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar</td></tr>';
    }
}

function renderizarUsuarios(usuarios) {
    const tabla = document.getElementById('tabla-usuarios');
    
    if (usuarios.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center">No hay usuarios</td></tr>';
        return;
    }
    
    tabla.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.email || '-'}</td>
            <td>${u.telefono || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarUsuario(${u.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filtrarUsuarios() {
    const search = document.getElementById('search-usuarios').value.toLowerCase();
    
    const filtrados = usuariosGlobal.filter(u => 
        u.nombre.toLowerCase().includes(search) || 
        (u.email && u.email.toLowerCase().includes(search))
    );
    
    renderizarUsuarios(filtrados);
}

function limpiarBuscaUsuarios() {
    document.getElementById('search-usuarios').value = '';
    renderizarUsuarios(usuariosGlobal);
}

// ============================================
// 6. GESTIÓN DE PEDIDOS
// ============================================
async function loadPedidos() {
    try {
        const response = await fetch(`${API_URL}/pedidos`);
        pedidosGlobal = await response.json();
        
        const tabla = document.getElementById('tabla-pedidos');
        
        if (pedidosGlobal.length === 0) {
            tabla.innerHTML = '<tr><td colspan="6" class="text-center">No hay pedidos</td></tr>';
            return;
        }
        
        tabla.innerHTML = pedidosGlobal.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>Usuario #${p.usuario_id}</td>
                <td>$${p.total}</td>
                <td>${new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                <td><span class="badge bg-info">Pendiente</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verPedido(${p.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

// ============================================
// 7. FORMULARIOS: CREAR Y EDITAR
// ============================================

// Resetear modal cuando se abre nuevo producto
document.getElementById('modal-producto')?.addEventListener('show.bs.modal', (e) => {
    const id = document.getElementById('producto-id').value;
    if (!id) {
        document.getElementById('form-producto').reset();
        document.getElementById('modal-producto-title').textContent = 'Nuevo Producto';
    }
});

// Formulario de producto
document.getElementById('form-producto').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('producto-id').value;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    delete data.id;
    
    try {
        const url = id ? `${API_URL}/productos/${id}` : `${API_URL}/productos`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.ok) {
            alert(id ? 'Producto actualizado ✅' : 'Producto creado ✅');
            bootstrap.Modal.getInstance(document.getElementById('modal-producto')).hide();
            e.target.reset();
            document.getElementById('producto-id').value = '';
            loadProductos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar producto');
    }
});

// Formulario de usuario
document.getElementById('form-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('usuario-id').value;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    delete data.id;
    
    try {
        const url = id ? `${API_URL}/usuarios/${id}` : `${API_URL}/usuarios`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.ok) {
            alert(id ? 'Usuario actualizado ✅' : 'Usuario creado ✅');
            bootstrap.Modal.getInstance(document.getElementById('modal-usuario')).hide();
            e.target.reset();
            document.getElementById('usuario-id').value = '';
            loadUsuarios();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar usuario');
    }
});

// ============================================
// 8. EDITAR REGISTROS
// ============================================

function editarProducto(id) {
    const producto = productosGlobal.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('modal-producto-title').textContent = 'Editar Producto';
    document.getElementById('producto-id').value = producto.id;
    document.querySelector('#form-producto input[name="nombre"]').value = producto.nombre;
    document.querySelector('#form-producto input[name="precio"]').value = producto.precio;
    document.querySelector('#form-producto select[name="categoria"]').value = producto.categoria;
    document.querySelector('#form-producto input[name="imagen"]').value = producto.imagen || '';
    
    const modal = new bootstrap.Modal(document.getElementById('modal-producto'));
    modal.show();
}

function editarUsuario(id) {
    const usuario = usuariosGlobal.find(u => u.id === id);
    if (!usuario) return;
    
    document.getElementById('modal-usuario-title').textContent = 'Editar Usuario';
    document.getElementById('usuario-id').value = usuario.id;
    document.querySelector('#form-usuario input[name="nombre"]').value = usuario.nombre;
    document.querySelector('#form-usuario input[name="email"]').value = usuario.email || '';
    document.querySelector('#form-usuario input[name="telefono"]').value = usuario.telefono || '';
    document.querySelector('#form-usuario input[name="password"]').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('modal-usuario'));
    modal.show();
}

// ============================================
// 9. ELIMINAR REGISTROS
// ============================================

async function eliminarProducto(id) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.ok) {
            alert('Producto eliminado ✅');
            loadProductos();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar producto');
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;
    
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.ok) {
            alert('Usuario eliminado ✅');
            loadUsuarios();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
    }
}

function verPedido(id) {
    const pedido = pedidosGlobal.find(p => p.id === id);
    if (pedido) {
        alert(`Pedido #${pedido.id}\nTotal: $${pedido.total}\nFecha: ${new Date(pedido.fecha).toLocaleDateString('es-ES')}`);
    }
}

// ============================================
// 10. AUTENTICACIÓN
// ============================================

function verificarAutenticacion() {
    const sesion = localStorage.getItem('admin_session');
    if (!sesion) {
        // Redirigir a login si no hay sesión
        window.location.href = 'admin-login.html';
        return false;
    }
    
    try {
        const session = JSON.parse(sesion);
        // Mostrar nombre de usuario en navbar (opcional)
        console.log('Sesión válida de:', session.user);
        return true;
    } catch (e) {
        localStorage.removeItem('admin_session');
        window.location.href = 'admin-login.html';
        return false;
    }
}

document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('¿Desea cerrar sesión?')) {
        localStorage.removeItem('admin_session');
        window.location.href = 'admin-login.html';
    }
});

// ============================================
// 11. INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    loadDashboard();
});
