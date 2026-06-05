import { isAdmin } from "@/utils";

const STATUS_LABELS = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
};

const STATUS_CLASSES = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  cancelled: "bg-slate-100 text-slate-500 border border-slate-200",
};

// Left border accent color per status
const BORDER_CLASSES = {
  pending: "border-l-4 border-l-yellow-400",
  approved: "border-l-4 border-l-green-500",
  rejected: "border-l-4 border-l-red-400",
  cancelled: "border-l-4 border-l-slate-300",
};

export default function ReservationCard(reservation, currentUserId) {
  const { id, workspace, date, startHour, endHour, reason, status, userId } = reservation;

  const statusLabel = STATUS_LABELS[status] || status;
  const statusClass = STATUS_CLASSES[status] || "bg-gray-100 text-gray-600";
  const borderClass = BORDER_CLASSES[status] || "";
  const admin = isAdmin();

  const canEdit = admin || (userId === currentUserId && status === "pending");
  const canDelete = admin;
  const canApprove = admin && status === "pending";
  const canReject = admin && status === "pending";
  const canCancel =
    !admin &&
    userId === currentUserId &&
    (status === "approved" || status === "pending");

  const hasActions = canEdit || canDelete || canApprove || canReject || canCancel;

  return `
    <article
      class="bg-white border border-wine-100 ${borderClass} rounded shadow-sm hover:shadow transition flex flex-col overflow-hidden"
      data-id="${id}"
    >
      <!-- Card body -->
      <div class="p-3 flex flex-col gap-2 flex-1">
        <div class="flex justify-between items-start gap-2">
          <h3 class="font-semibold text-sm text-wine-800 leading-tight">${workspace}</h3>
          <span class="text-xs font-medium px-2 py-0.5 rounded shrink-0 ${statusClass}">
            ${statusLabel}
          </span>
        </div>

        <div class="text-xs text-slate-500 flex flex-col gap-0.5">
          <p><span class="font-medium text-slate-600">Fecha:</span> ${date}</p>
          <p><span class="font-medium text-slate-600">Horario:</span> ${startHour} – ${endHour}</p>
          <p><span class="font-medium text-slate-600">Motivo:</span> ${reason}</p>
          ${admin ? `<p><span class="font-medium text-slate-600">Usuario ID:</span> ${userId}</p>` : ""}
        </div>
      </div>

      <!-- Action bar — pinned to bottom, different background -->
      ${
        hasActions
          ? `<div class="bg-wine-50 border-t border-wine-100 px-3 py-2 flex gap-1.5 flex-wrap">
              ${canEdit    ? `<button class="btn-edit    text-xs font-medium bg-wine-800 hover:bg-wine-700 text-white    px-3 py-1 rounded transition" data-id="${id}">Editar</button>` : ""}
              ${canApprove ? `<button class="btn-approve text-xs font-medium bg-green-600  hover:bg-green-500  text-white    px-3 py-1 rounded transition" data-id="${id}">Aprobar</button>` : ""}
              ${canReject  ? `<button class="btn-reject  text-xs font-medium border border-red-400 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1 rounded transition" data-id="${id}">Rechazar</button>` : ""}
              ${canCancel  ? `<button class="btn-cancel  text-xs font-medium border border-slate-300 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded transition" data-id="${id}">Cancelar</button>` : ""}
              ${canDelete  ? `<button class="btn-delete  text-xs font-medium border border-slate-300 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded transition ml-auto" data-id="${id}">Eliminar</button>` : ""}
            </div>`
          : ""
      }
    </article>
  `;
}
