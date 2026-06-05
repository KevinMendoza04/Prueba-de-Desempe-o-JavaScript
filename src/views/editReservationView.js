import Sidebar from "@/components/Sidebar";
import { editReservationController } from "@/controllers/reservation.controller";

export default function editReservationView() {
  setTimeout(() => {
    editReservationController();
  });

  return `
    <div class="flex min-h-screen bg-wine-50">
      ${Sidebar()}

      <main class="flex-1 p-6">
        <div class="max-w-xl mx-auto">
          <div class="mb-5">
            <h1 class="text-xl font-bold text-wine-800">Editar reserva</h1>
            <p class="text-slate-400 text-xs mt-0.5">Modifica los datos de la reserva.</p>
          </div>

          <div class="bg-white rounded shadow border border-wine-100 p-5">
            <div id="editFormContainer">
              <p class="text-slate-400 text-sm text-center py-8">Cargando reserva...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}
