import Sidebar from "@/components/Sidebar";
import { createReservationController } from "@/controllers/reservation.controller";

export default function createReservationView() {
  setTimeout(() => {
    createReservationController();
  });

  return `
    <div class="flex min-h-screen bg-wine-50">
      ${Sidebar()}

      <main class="flex-1 p-6">
        <div class="max-w-xl mx-auto">
          <div class="mb-5">
            <h1 class="text-xl font-bold text-wine-800">Nueva reserva</h1>
            <p class="text-slate-400 text-xs mt-0.5">Completa el formulario para reservar un espacio.</p>
          </div>

          <div class="bg-white rounded shadow border border-wine-100 p-5">
            <form id="reservationForm" novalidate>

              <div class="mb-3">
                <label class="block text-xs font-medium text-slate-600 mb-1" for="workspaceId">
                  Espacio de trabajo
                </label>
                <select
                  id="workspaceId"
                  name="workspaceId"
                  class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                  required
                >
                  <option value="">Cargando espacios...</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="block text-xs font-medium text-slate-600 mb-1" for="date">
                  Fecha
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                  required
                >
              </div>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1" for="startHour">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    id="startHour"
                    name="startHour"
                    class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                    required
                  >
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1" for="endHour">
                    Hora de fin
                  </label>
                  <input
                    type="time"
                    id="endHour"
                    name="endHour"
                    class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label class="block text-xs font-medium text-slate-600 mb-1" for="reason">
                  Motivo
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows="3"
                  placeholder="Describe el motivo..."
                  class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600 resize-none"
                  required
                ></textarea>
              </div>

              <div id="formError" class="hidden mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2.5"></div>

              <div class="flex gap-2">
                <button
                  type="submit"
                  class="bg-wine-800 hover:bg-wine-700 text-white px-5 py-2 rounded text-sm font-medium transition"
                >
                  Crear reserva
                </button>
                <button
                  type="button"
                  id="cancelBtn"
                  class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 rounded text-sm font-medium transition"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  `;
}
