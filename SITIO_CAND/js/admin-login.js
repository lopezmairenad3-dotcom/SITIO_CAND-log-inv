// Admin Login JavaScript
const API_URL = 'http://localhost:3000';

// ============================================
// 1. TOGGLE PASSWORD VISIBILITY
// ============================================
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    const isPassword = passwordField.type === 'password';
    
    passwordField.type = isPassword ? 'text' : 'password';
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// ============================================
// 2. SHOW/HIDE ALERT
// ============================================
function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('alert-container');
    alertDiv.innerHTML = `
        <div class="alert alert-${type} alert-custom alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'danger' ? 'exclamation-circle' : 'check-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Auto-hide after 5 seconds if success
    if (type === 'success') {
        setTimeout(() => {
            alertDiv.innerHTML = '';
        }, 3000);
    }
}

// ============================================
// 3. CLEAR ALERT
// ============================================
function clearAlert() {
    document.getElementById('alert-container').innerHTML = '';
}

// ============================================
// 4. LOGIN FORM SUBMIT
// ============================================
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validation
    if (!username || !password) {
        showAlert('Por favor complete todos los campos', 'danger');
        return;
    }
    
    if (password.length < 3) {
        showAlert('La contraseña debe tener al menos 3 caracteres', 'danger');
        return;
    }
    
    // Show loading state
    const btnLogin = document.getElementById('btn-login');
    const loginText = document.getElementById('login-text');
    const loginSpinner = document.getElementById('login-spinner');
    
    btnLogin.disabled = true;
    loginText.style.opacity = '0.5';
    loginSpinner.style.display = 'inline';
    
    try {
        // Llamar al endpoint de login del servidor
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: username, password: password })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            // Guardar sesión
            const session = {
                token: result.token || Math.random().toString(36).substr(2, 9),
                user: username,
                timestamp: new Date().getTime(),
                remember: remember
            };
            
            localStorage.setItem('admin_session', JSON.stringify(session));
            
            showAlert('✅ Autenticación exitosa. Redirigiendo...', 'success');
            
            // Redirigir al panel admin
            setTimeout(() => {
                window.location.href = 'admin-panel.html';
            }, 1500);
        } else {
            showAlert(result.mensaje || 'Usuario o contraseña incorrectos', 'danger');
            document.getElementById('password').value = '';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al conectar con el servidor. Intente más tarde.', 'danger');
    } finally {
        // Restore button state
        btnLogin.disabled = false;
        loginText.style.opacity = '1';
        loginSpinner.style.display = 'none';
    }
});

// ============================================
// 5. CHECK EXISTING SESSION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const sesion = localStorage.getItem('admin_session');
    
    if (sesion) {
        try {
            const session = JSON.parse(sesion);
            // Verificar si la sesión sigue siendo válida (menos de 24 horas)
            const ahora = new Date().getTime();
            const hace24Horas = 24 * 60 * 60 * 1000;
            
            if (ahora - session.timestamp < hace24Horas) {
                // Sesión aún válida, redirigir al panel
                window.location.href = 'admin-panel.html';
            } else {
                // Sesión expirada
                localStorage.removeItem('admin_session');
                showAlert('⚠️ Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'warning');
            }
        } catch (e) {
            localStorage.removeItem('admin_session');
        }
    }
});

// ============================================
// 6. ENTER KEY SUBMIT
// ============================================
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('login-form').dispatchEvent(new Event('submit'));
    }
});
