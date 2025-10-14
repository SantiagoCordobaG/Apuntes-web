<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-purple-700">
        Iniciar Sesión
      </h2>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="font-semibold">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          />
        </div>

        <div class="mb-6">
          <label class="font-semibold">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          class="bg-purple-600 w-full text-white py-2 rounded-md hover:bg-purple-700"
        >
          Ingresar
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        ¿No tienes cuenta?
        <a href="#" class="text-purple-600 hover:underline">Regístrate aquí</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        alert(`Bienvenido, ${this.email} 👋`);
        this.$router.push("/"); // redirige al home
      } else {
        alert("Por favor, completa todos los campos.");
      }
    },
  },
};
</script>
