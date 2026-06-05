import { getSession, isAdmin } from "@/utils";
import { navigateTo } from "@/router/router";
import {
  getReservations,
  createReservation,
  updateReservation,
  getReservationById,
} from "@services/reservation.service";
import { getWorkspaces } from "@services/workspace.service";

// ─── Create Reservation ───────────────────────────────────────────────────────

export const createReservationController = async () => {
  const form = document.querySelector("#reservationForm");
  const errorBox = document.querySelector("#formError");
  const cancelBtn = document.querySelector("#cancelBtn");
  const workspaceSelect = document.querySelector("#workspaceId");

  // Load available workspaces into select
  try {
    const workspaces = await getWorkspaces();
    const available = workspaces.filter((w) => w.status === "available");
    workspaceSelect.innerHTML = available.length
      ? `<option value="">Selecciona un espacio</option>` +
        available
          .map((w) => `<option value="${w.id}">${w.name} — ${w.type} (cap. ${w.capacity})</option>`)
          .join("")
      : `<option value="">No hay espacios disponibles</option>`;
  } catch {
    workspaceSelect.innerHTML = `<option value="">Error cargando espacios</option>`;
  }

  cancelBtn?.addEventListener("click", () => navigateTo("/home"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError(errorBox);

    const user = getSession();
    const workspaceId = parseInt(form.workspaceId.value);
    const date = form.date.value;
    const startHour = form.startHour.value;
    const endHour = form.endHour.value;
    const reason = form.reason.value.trim();

    // Client-side validation
    if (!workspaceId || !date || !startHour || !endHour || !reason) {
      showError(errorBox, "Por favor completa todos los campos.");
      return;
    }

    if (startHour >= endHour) {
      showError(errorBox, "La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    try {
      // Business rule: no duplicate reservations for same space and time slot
      const existing = await getReservations();
      const duplicate = existing.find(
        (r) =>
          r.workspaceId === workspaceId &&
          r.date === date &&
          r.status !== "cancelled" &&
          r.status !== "rejected" &&
          timeOverlap(startHour, endHour, r.startHour, r.endHour)
      );

      if (duplicate) {
        showError(errorBox, "Ya existe una reserva para ese espacio en ese horario.");
        return;
      }

      // Get workspace name for denormalized storage
      const workspaces = await getWorkspaces();
      const workspace = workspaces.find((w) => w.id === workspaceId);

      await createReservation({
        userId: user.id,
        workspaceId,
        workspace: workspace?.name || "Desconocido",
        date,
        startHour,
        endHour,
        reason,
        status: "pending",
      });

      navigateTo("/home");
    } catch {
      showError(errorBox, "Error al crear la reserva. Intenta de nuevo.");
    }
  });
};

// ─── Edit Reservation ─────────────────────────────────────────────────────────

export const editReservationController = async () => {
  const container = document.querySelector("#editFormContainer");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    navigateTo("/home");
    return;
  }

  try {
    const [reservation, workspaces] = await Promise.all([
      getReservationById(id),
      getWorkspaces(),
    ]);

    const user = getSession();
    const admin = isAdmin();

    // Guard: user can only edit their own pending reservations
    if (!admin && (reservation.userId !== user.id || reservation.status !== "pending")) {
      container.innerHTML = `
        <p class="text-red-500 text-center py-8">
          No tienes permiso para editar esta reserva.
        </p>
        <div class="text-center mt-4">
          <button id="cancelBtn" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 rounded text-sm">
            Volver
          </button>
        </div>
      `;
      document.querySelector("#cancelBtn")?.addEventListener("click", () => navigateTo("/home"));
      return;
    }

    const availableWorkspaces = workspaces.filter((w) => w.status === "available");
    const workspaceOptions = availableWorkspaces
      .map(
        (w) =>
          `<option value="${w.id}" ${w.id === reservation.workspaceId ? "selected" : ""}>
            ${w.name} — ${w.type} (cap. ${w.capacity})
          </option>`
      )
      .join("");

    container.innerHTML = `
      <form id="editForm" novalidate>
        <div class="mb-3">
          <label class="block text-xs font-medium text-slate-600 mb-1">Espacio de trabajo</label>
          <select
            name="workspaceId"
            class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
            required
          >
            ${workspaceOptions}
          </select>
        </div>

        <div class="mb-3">
          <label class="block text-xs font-medium text-slate-600 mb-1">Fecha</label>
          <input
            type="date"
            name="date"
            value="${reservation.date}"
            class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
            required
          >
        </div>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Hora de inicio</label>
            <input
              type="time"
              name="startHour"
              value="${reservation.startHour}"
              class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
              required
            >
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Hora de fin</label>
            <input
              type="time"
              name="endHour"
              value="${reservation.endHour}"
              class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
              required
            >
          </div>
        </div>

        <div class="mb-3">
          <label class="block text-xs font-medium text-slate-600 mb-1">Motivo</label>
          <textarea
            name="reason"
            rows="3"
            class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600 resize-none"
            required
          >${reservation.reason}</textarea>
        </div>

        ${
          admin
            ? `
          <div class="mb-3">
            <label class="block text-xs font-medium text-slate-600 mb-1">Estado</label>
            <select
              name="status"
              class="border border-slate-300 w-full p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-wine-600"
            >
              <option value="pending" ${reservation.status === "pending" ? "selected" : ""}>Pendiente</option>
              <option value="approved" ${reservation.status === "approved" ? "selected" : ""}>Aprobada</option>
              <option value="rejected" ${reservation.status === "rejected" ? "selected" : ""}>Rechazada</option>
              <option value="cancelled" ${reservation.status === "cancelled" ? "selected" : ""}>Cancelada</option>
            </select>
          </div>
        `
            : ""
        }

        <div id="formError" class="hidden mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2.5"></div>

        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-wine-800 hover:bg-wine-700 text-white px-5 py-2 rounded text-sm font-medium transition"
          >
            Guardar cambios
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
    `;

    document.querySelector("#cancelBtn")?.addEventListener("click", () => navigateTo("/home"));

    document.querySelector("#editForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errorBox = document.querySelector("#formError");
      hideError(errorBox);

      const form = e.target;
      const workspaceId = parseInt(form.workspaceId.value);
      const date = form.date.value;
      const startHour = form.startHour.value;
      const endHour = form.endHour.value;
      const reason = form.reason.value.trim();
      const status = form.status?.value || reservation.status;

      if (!workspaceId || !date || !startHour || !endHour || !reason) {
        showError(errorBox, "Por favor completa todos los campos.");
        return;
      }

      if (startHour >= endHour) {
        showError(errorBox, "La hora de inicio debe ser anterior a la hora de fin.");
        return;
      }

      try {
        // Business rule: no duplicate reservations (exclude current one)
        const existing = await getReservations();
        const duplicate = existing.find(
          (r) =>
            r.id !== parseInt(id) &&
            r.workspaceId === workspaceId &&
            r.date === date &&
            r.status !== "cancelled" &&
            r.status !== "rejected" &&
            timeOverlap(startHour, endHour, r.startHour, r.endHour)
        );

        if (duplicate) {
          showError(errorBox, "Ya existe una reserva para ese espacio en ese horario.");
          return;
        }

        const ws = workspaces.find((w) => w.id === workspaceId);

        await updateReservation(id, {
          workspaceId,
          workspace: ws?.name || reservation.workspace,
          date,
          startHour,
          endHour,
          reason,
          status,
        });

        navigateTo("/home");
      } catch {
        showError(errorBox, "Error al guardar los cambios. Intenta de nuevo.");
      }
    });
  } catch {
    container.innerHTML = `<p class="text-red-500 text-center py-8">Error al cargar la reserva.</p>`;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

function showError(box, msg) {
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("hidden");
}

function hideError(box) {
  if (!box) return;
  box.classList.add("hidden");
}
