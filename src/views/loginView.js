import { loginController } from "@/controllers/login.controller";

export default function loginView() {
  setTimeout(() => {
    loginController();
  });

  return `
    <div class="min-h-screen flex justify-center items-center bg-wine-50">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-sm border border-wine-100">

        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-wine-800">SpaceBook</h1>
          <p class="text-slate-400 text-sm mt-1">Sistema de reserva de espacios</p>
        </div>

        <form id="loginForm" novalidate>
          <div class="mb-4">
            <label class="block text-xs font-medium text-slate-600 mb-1" for="email">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="correo@empresa.com"
              class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-xs font-medium text-slate-600 mb-1" for="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
              required
            >
          </div>

          <div id="loginError" class="hidden mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2.5"></div>

          <button
            type="submit"
            class="bg-wine-800 hover:bg-wine-700 text-white w-full py-2 rounded text-sm font-medium transition"
          >
            Iniciar sesión
          </button>
        </form>

      </div>
    </div>
  `;
}
