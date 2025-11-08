import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const usuario = ref(
    localStorage.getItem('usuario') 
      ? JSON.parse(localStorage.getItem('usuario')) 
      : null
  );
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = ref(!!token.value);

  // Inicializar usuario si hay token
  const initAuth = async () => {
    if (token.value) {
      try {
        const res = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          usuario.value = data.usuario;
          isAuthenticated.value = true;
          // Actualizar localStorage con la información actualizada
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
        } else {
          // Token inválido, limpiar
          logout();
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Si hay error de conexión, mantener el usuario del localStorage
        // pero marcar como no autenticado si es necesario
        if (usuario.value) {
          isAuthenticated.value = true;
        } else {
          logout();
        }
      }
    }
    // Retornar para que la promesa se resuelva
    return Promise.resolve();
  };

  // Login
  const login = async (correo, password) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (res.ok) {
        usuario.value = data.usuario;
        token.value = data.token;
        isAuthenticated.value = true;
        
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Error al hacer login' };
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      return { success: false, message: 'Error de conexión. Verifica que el backend esté corriendo.' };
    }
  };

  // Registro
  const registro = async (usuarioData) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioData)
      });

      const data = await res.json();

      if (res.ok) {
        usuario.value = data.usuario;
        token.value = data.token;
        isAuthenticated.value = true;
        
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Error al registrar usuario' };
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      return { success: false, message: 'Error de conexión. Verifica que el backend esté corriendo.' };
    }
  };

  // Logout
  const logout = () => {
    usuario.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  // Obtener usuario actual
  const getUsuarioActual = async () => {
    if (!token.value) {
      return null;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        usuario.value = data.usuario;
        return data.usuario;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  };

  return {
    usuario,
    token,
    isAuthenticated,
    login,
    registro,
    logout,
    getUsuarioActual,
    initAuth
  };
});

