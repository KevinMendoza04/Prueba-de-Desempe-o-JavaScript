import ReservationCard from "@components/ReservationCard";
import {
  getReservations,
  updateReservation,
  deleteReservation,
} from "@services/reservation.service";
import { getSession, isAdmin } from "@/utils";
import { navigateTo } from "@/router/router";

export const homeController = async () => {
  const container = document.querySelector("#reservationsContainer");
  if (!container) return;

  const user = getSession();

  await loadReservations(container, user);
};

async function loadReservations(container, user) {
  container.innerHTML = `
    <div class="col-span-2 text-center py-8">
      <p class="text-slate-400">Cargando reservas...</p>
    </div>
  `;

  try {
    const reservations = await getReservations();

    const filtered = isAdmin()
      ? reservations
      : reservations.filter((r) => r.userId === user.id);

    if (!filtered.length) {
      container.innerHTML = `
        <div class="col-span-2 text-center py-8">
          <p class="text-slate-400">No hay reservas disponibles.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered
      .map((r) => ReservationCard(r, user.id))
      .join("");

    attachCardListeners(container, user);
  } catch (error) {
    container.innerHTML = `
      <div class="col-span-2 text-center py-8">
        <p class="text-red-500">Error al cargar las reservas. Verifica que json-server esté activo.</p>
      </div>
    `;
  }
}

function attachCardListeners(container, user) {
  // Edit button
  container.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      navigateTo(`/reservations/edit?id=${id}`);
    });
  });

  // Approve button (admin only)
  container.querySelectorAll(".btn-approve").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await updateReservation(id, { status: "approved" });
        await loadReservations(container, user);
      } catch {
        alert("Error al aprobar la reserva.");
      }
    });
  });

  // Reject button (admin only)
  container.querySelectorAll(".btn-reject").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await updateReservation(id, { status: "rejected" });
        await loadReservations(container, user);
      } catch {
        alert("Error al rechazar la reserva.");
      }
    });
  });

  // Cancel button (user only, their own reservations)
  container.querySelectorAll(".btn-cancel").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;
      try {
        await updateReservation(id, { status: "cancelled" });
        await loadReservations(container, user);
      } catch {
        alert("Error al cancelar la reserva.");
      }
    });
  });

  // Delete button (admin only)
  container.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return;
      try {
        await deleteReservation(id);
        await loadReservations(container, user);
      } catch {
        alert("Error al eliminar la reserva.");
      }
    });
  });
}
