// Admin Panel JavaScript - Versión Pro
const API_URL = '';

// ============================================
// 1. VARIABLES GLOBALES
// ============================================
let productosGlobal = [];
let usuariosGlobal = [];
let pedidosGlobal = [];
let chartCategorias = null;
let chartIngresos = null;
let chartPagos = null;

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
// 3. DASHBOARD CON GRÁFICOS PRO
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

        // Actualizar tarjetas con animación
        animarContador('total-productos', productos.length);
        animarContador('total-usuarios', usuarios.length);
        animarContador('total-pedidos', pedidos.length);

        const totalIngresos = pedidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
        document.getElementById('ingresos-totales').textContent = `C$${totalIngresos.toFixed(2)}`;

        // Pedido más reciente
        if (pedidos.length > 0) {
            const ultimo = pedidos[0];
            document.getElementById('ultimo-pedido').textContent = `#${String(ultimo.id).padStart(5,'0')} — C$${ultimo.total}`;
        }

        setTimeout(() => {
            generarGraficoCategorias(productos);
            generarGraficoIngresos(pedidos);
            generarGraficoPagos(pedidos);
        }, 100);

    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// Animación de contadores
function animarContador(id, final) {
    const el = document.getElementById(id);
    if (!el) return;
    let inicio = 0;
    const duracion = 800;
    const paso = Math.ceil(final / (duracion / 16));
    const timer = setInterval(() => {
        inicio += paso;
        if (inicio >= final) { el.textContent = final; clearInterval(timer); }
        else el.textContent = inicio;
    }, 16);
}

// Gráfico dona — Productos por categoría
function generarGraficoCategorias(productos) {
    const ctx = document.getElementById('chart-categorias')?.getContext('2d');
    if (!ctx) return;
    if (chartCategorias) chartCategorias.destroy();

    const categoriaCount = {};
    productos.forEach(p => {
        categoriaCount[p.categoria] = (categoriaCount[p.categoria] || 0) + 1;
    });

    chartCategorias = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoriaCount),
            datasets: [{
                data: Object.values(categoriaCount),
                backgroundColor: ['#4e73df','#1cc88a','#36b9cc','#f6c23e','#e74a3b'],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { padding: 15, font: { size: 12 } } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.raw} productos`
                    }
                }
            }
        }
    });
}

// Gráfico línea — Ingresos por día
function generarGraficoIngresos(pedidos) {
    const ctx = document.getElementById('chart-ingresos')?.getContext('2d');
    if (!ctx) return;
    if (chartIngresos) chartIngresos.destroy();

    const ingresosPorFecha = {};
    pedidos.forEach(p => {
        const fecha = new Date(p.fecha).toLocaleDateString('es-NI', { month: 'short', day: 'numeric' });
        ingresosPorFecha[fecha] = (ingresosPorFecha[fecha] || 0) + parseFloat(p.total || 0);
    });

    const ultimos7 = Object.entries(ingresosPorFecha).slice(-7);

    // Si no hay datos, mostrar datos de ejemplo
    const labels = ultimos7.length > 0 ? ultimos7.map(([f]) => f) : ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const data   = ultimos7.length > 0 ? ultimos7.map(([,v]) => v) : [0,0,0,0,0,0,0];

    chartIngresos = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Ingresos (C$)',
                data,
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78,115,223,0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#4e73df',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: ctx => ` C$${ctx.raw.toFixed(2)}` }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { callback: v => 'C$' + v }
                },
                x: { grid: { display: false } }
            }
        }
    });
}

// Gráfico barras — Métodos de pago
function generarGraficoPagos(pedidos) {
    const ctx = document.getElementById('chart-pagos')?.getContext('2d');
    if (!ctx) return;
    if (chartPagos) chartPagos.destroy();

    const pagos = { efectivo: 0, tarjeta: 0 };
    pedidos.forEach(p => {
        if (p.metodo_pago === 'tarjeta') pagos.tarjeta++;
        else pagos.efectivo++;
    });

    chartPagos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['💵 Efectivo', '💳 Tarjeta'],
            datasets: [{
                data: [pagos.efectivo, pagos.tarjeta],
                backgroundColor: ['#1cc88a', '#4e73df'],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` ${ctx.raw} pedidos` } }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
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
        document.getElementById('search-productos').addEventListener('input', filtrarProductos);
        document.getElementById('filter-categoria').addEventListener('change', filtrarProductos);
        document.getElementById('btn-clear-filters').addEventListener('click', limpiarFiltrosProductos);
    } catch (error) {
        document.getElementById('tabla-productos').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar</td></tr>';
    }
}

function renderizarProductos(productos) {
    const tabla = document.getElementById('tabla-productos');
    if (productos.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4"><i class="fas fa-box-open fa-2x d-block mb-2"></i>No hay productos</td></tr>';
        return;
    }
    tabla.innerHTML = productos.map(p => `
        <tr>
            <td><span class="badge bg-secondary">#${p.id}</span></td>
            <td><strong>${p.nombre}</strong></td>
            <td><span class="text-success fw-bold">C$${parseFloat(p.precio).toFixed(2)}</span></td>
            <td><span class="badge bg-info text-dark">${p.categoria}</span></td>
            <td>${p.imagen ? `<img src="${p.imagen}" style="max-width:45px;border-radius:6px;border:1px solid #ddd;">` : '<span class="text-muted">—</span>'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${p.id})" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filtrarProductos() {
    const search = document.getElementById('search-productos').value.toLowerCase();
    const categoria = document.getElementById('filter-categoria').value;
    const filtrados = productosGlobal.filter(p => {
        return p.nombre.toLowerCase().includes(search) && (!categoria || p.categoria === categoria);
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
        const tabla = document.getElementById('tabla-usuarios');
        if (usuariosGlobal.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4"><i class="fas fa-users fa-2x d-block mb-2"></i>No hay usuarios</td></tr>';
            return;
        }
        tabla.innerHTML = usuariosGlobal.map(u => `
            <tr>
                <td><span class="badge bg-secondary">#${u.id}</span></td>
                <td><strong>${u.nombre}</strong></td>
                <td>${u.email || '<span class="text-muted">—</span>'}</td>
                <td>${u.telefono || '<span class="text-muted">—</span>'}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${u.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
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
            tabla.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4"><i class="fas fa-shopping-cart fa-2x d-block mb-2"></i>No hay pedidos</td></tr>';
            return;
        }
        tabla.innerHTML = pedidosGlobal.map(p => `
            <tr>
                <td><strong>#${String(p.id).padStart(5,'0')}</strong></td>
                <td>Usuario #${p.usuario_id}</td>
                <td><span class="text-success fw-bold">C$${p.total}</span></td>
                <td>${new Date(p.fecha).toLocaleDateString('es-NI', {year:'numeric',month:'short',day:'numeric'})}</td>
                <td><span class="badge bg-warning text-dark">Pendiente</span></td>
                <td>
                    <button class="btn btn-sm btn-info text-white" onclick="verPedido(${p.id})"><i class="fas fa-eye"></i> Ver</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

// ============================================
// 7. FORMULARIOS
// ============================================
document.getElementById('modal-producto')?.addEventListener('show.bs.modal', () => {
    const id = document.getElementById('producto-id').value;
    if (!id) {
        document.getElementById('form-producto').reset();
        document.getElementById('modal-producto-title').textContent = 'Nuevo Producto';
    }
});

document.getElementById('form-producto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('producto-id').value;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    delete data.id;
    try {
        const url = id ? `${API_URL}/productos/${id}` : `${API_URL}/productos`;
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await response.json();
        if (result.ok) {
            mostrarToast(id ? '✅ Producto actualizado' : '✅ Producto creado', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modal-producto')).hide();
            e.target.reset();
            document.getElementById('producto-id').value = '';
            loadProductos();
        }
    } catch (error) { mostrarToast('❌ Error al guardar producto', 'danger'); }
});

document.getElementById('form-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('usuario-id').value;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    delete data.id;
    try {
        const url = id ? `${API_URL}/usuarios/${id}` : `${API_URL}/usuarios`;
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await response.json();
        if (result.ok) {
            mostrarToast(id ? '✅ Usuario actualizado' : '✅ Usuario creado', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modal-usuario')).hide();
            e.target.reset();
            document.getElementById('usuario-id').value = '';
            loadUsuarios();
        }
    } catch (error) { mostrarToast('❌ Error al guardar usuario', 'danger'); }
});

// ============================================
// 8. EDITAR / ELIMINAR
// ============================================
function editarProducto(id) {
    const p = productosGlobal.find(p => p.id === id);
    if (!p) return;
    document.getElementById('modal-producto-title').textContent = 'Editar Producto';
    document.getElementById('producto-id').value = p.id;
    document.querySelector('#form-producto input[name="nombre"]').value = p.nombre;
    document.querySelector('#form-producto input[name="precio"]').value = p.precio;
    document.querySelector('#form-producto select[name="categoria"]').value = p.categoria;
    document.querySelector('#form-producto input[name="imagen"]').value = p.imagen || '';
    new bootstrap.Modal(document.getElementById('modal-producto')).show();
}

function editarUsuario(id) {
    const u = usuariosGlobal.find(u => u.id === id);
    if (!u) return;
    document.getElementById('modal-usuario-title').textContent = 'Editar Usuario';
    document.getElementById('usuario-id').value = u.id;
    document.querySelector('#form-usuario input[name="nombre"]').value = u.nombre;
    document.querySelector('#form-usuario input[name="email"]').value = u.email || '';
    document.querySelector('#form-usuario input[name="telefono"]').value = u.telefono || '';
    document.querySelector('#form-usuario input[name="password"]').value = '';
    new bootstrap.Modal(document.getElementById('modal-usuario')).show();
}

async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
        const r = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
        const result = await r.json();
        if (result.ok) { mostrarToast('✅ Producto eliminado', 'success'); loadProductos(); }
    } catch { mostrarToast('❌ Error al eliminar', 'danger'); }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
        const r = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
        const result = await r.json();
        if (result.ok) { mostrarToast('✅ Usuario eliminado', 'success'); loadUsuarios(); }
    } catch { mostrarToast('❌ Error al eliminar', 'danger'); }
}

function verPedido(id) {
    const p = pedidosGlobal.find(p => p.id === id);
    if (p) alert(`📦 Pedido #${String(p.id).padStart(5,'0')}\n💰 Total: C$${p.total}\n📅 Fecha: ${new Date(p.fecha).toLocaleDateString('es-NI')}`);
}

// ============================================
// 9. TOAST NOTIFICACIONES
// ============================================
function mostrarToast(mensaje, tipo = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.style.cssText = `background:${tipo==='success'?'#1cc88a':'#e74a3b'};color:white;padding:12px 20px;border-radius:8px;margin-bottom:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-weight:500;min-width:220px;`;
    toast.textContent = mensaje;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// 10. AUTENTICACIÓN
// ============================================
function verificarAutenticacion() {
    const sesion = localStorage.getItem('admin_session');
    if (!sesion) { window.location.href = 'admin-login.html'; return false; }
    try {
        const session = JSON.parse(sesion);
        const hace24h = 24 * 60 * 60 * 1000;
        if (new Date().getTime() - session.timestamp > hace24h) {
            localStorage.removeItem('admin_session');
            window.location.href = 'admin-login.html';
            return false;
        }
        // Mostrar nombre en navbar
        const brandEl = document.querySelector('.navbar-brand');
        if (brandEl) brandEl.innerHTML += ` <small style="font-size:0.65em;opacity:0.7;">| ${session.user}</small>`;
        return true;
    } catch { localStorage.removeItem('admin_session'); window.location.href = 'admin-login.html'; return false; }
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
   
 

// deploy 06/28/2026 11:27:21