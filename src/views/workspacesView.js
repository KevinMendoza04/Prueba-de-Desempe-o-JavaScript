import Sidebar from "@/components/Sidebar";
import { workspacesController } from "@/controllers/workspaces.controller";

export default function workspacesView() {
  setTimeout(() => {
    workspacesController();
  });

  return `
    <div class="flex min-h-screen bg-wine-50">
      ${Sidebar()}

      <main class="flex-1 p-6">
        <div class="mb-5 flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold text-wine-800">Gestión de espacios</h1>
            <p class="text-slate-400 text-xs mt-0.5">Administra los espacios de trabajo disponibles.</p>
          </div>
          <button
            id="newWorkspaceBtn"
            class="bg-wine-800 hover:bg-wine-700 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            + Nuevo espacio
          </button>
        </div>

        <!-- Create / Edit Form -->
        <div id="workspaceFormContainer" class="hidden bg-white rounded shadow border border-wine-100 p-5 mb-5">
          <h2 id="formTitle" class="text-sm font-semibold text-wine-800 mb-4">Nuevo espacio</h2>
          <form id="workspaceForm" novalidate>
            <input type="hidden" name="editId" id="editId" value="">

            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej: Sala A"
                  class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                  required
                >
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
                <select
                  name="type"
                  class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Sala de reuniones">Sala de reuniones</option>
                  <option value="Oficina privada">Oficina privada</option>
                  <option value="Espacio de coworking">Espacio de coworking</option>
                  <option value="Auditorio">Auditorio</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Capacidad</label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  placeholder="Ej: 10"
                  class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                  required
                >
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Ubicación</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Ej: Piso 2"
                  class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                  required
                >
              </div>
            </div>

            <div class="mb-3">
              <label class="block text-xs font-medium text-slate-600 mb-1">Estado</label>
              <select
                name="status"
                class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
              >
                <option value="available">Disponible</option>
                <option value="unavailable">No disponible</option>
              </select>
            </div>

            <div id="wsFormError" class="hidden mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2.5"></div>

            <div class="flex gap-2">
              <button
                type="submit"
                class="bg-wine-800 hover:bg-wine-700 text-white px-5 py-2 rounded text-sm font-medium transition"
              >
                Guardar
              </button>
              <button
                type="button"
                id="cancelWsBtn"
                class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 rounded text-sm font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Workspaces list -->
        <div class="bg-white rounded shadow border border-wine-100 p-5">
          <div id="workspacesContainer" class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <p class="text-slate-400 text-sm col-span-3 text-center py-8">Cargando espacios...</p>
          </div>
        </div>
      </main>
    </div>
  `;
}
