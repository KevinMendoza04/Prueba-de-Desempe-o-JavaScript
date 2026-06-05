import Sidebar from "@/components/Sidebar";
import { getSession, isAdmin } from "@/utils";
import { homeController } from "@/controllers/home.controller";

export default function homeView() {
  const user = getSession();

  setTimeout(() => {
    homeController();
  });

  return `
    <div class="flex min-h-screen bg-wine-50">
      ${Sidebar()}

      <main class="flex-1 p-6">
        <div class="mb-5">
          <h1 class="text-xl font-bold text-wine-800">
            Bienvenido, ${user?.name}
          </h1>
          <p class="text-slate-400 text-xs mt-0.5">
            ${isAdmin() ? "Administrador — acceso completo a todas las reservas." : "Usuario — solo tus reservas."}
          </p>
        </div>

        <section class="bg-white rounded shadow border border-wine-100 p-5">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-semibold text-wine-800">
              ${isAdmin() ? "Todas las reservas" : "Mis reservas"}
            </h2>
            <span class="text-xs text-slate-400">
              ${isAdmin() ? "Puedes aprobar, rechazar, editar o eliminar" : "Edita pendientes · Cancela aprobadas"}
            </span>
          </div>

          <div
            id="reservationsContainer"
            class="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
          >
            <div class="col-span-3 text-center py-8">
              <p class="text-slate-400 text-sm">Cargando reservas...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}
