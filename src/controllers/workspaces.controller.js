import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "@services/workspace.service";

const STATUS_LABELS = {
  available: "Disponible",
  unavailable: "No disponible",
};

const STATUS_CLASSES = {
  available: "bg-green-100 text-green-800",
  unavailable: "bg-red-100 text-red-800",
};

export const workspacesController = async () => {
  const container = document.querySelector("#workspacesContainer");
  const formContainer = document.querySelector("#workspaceFormContainer");
  const form = document.querySelector("#workspaceForm");
  const newBtn = document.querySelector("#newWorkspaceBtn");
  const cancelBtn = document.querySelector("#cancelWsBtn");
  const formTitle = document.querySelector("#formTitle");
  const editIdInput = document.querySelector("#editId");
  const errorBox = document.querySelector("#wsFormError");

  await loadWorkspaces(container);

  // Show create form
  newBtn.addEventListener("click", () => {
    formTitle.textContent = "Nuevo espacio";
    editIdInput.value = "";
    form.reset();
    hideError(errorBox);
    formContainer.classList.remove("hidden");
    formContainer.scrollIntoView({ behavior: "smooth" });
  });

  // Hide form
  cancelBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    form.reset();
    hideError(errorBox);
  });

  // Submit: create or update
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError(errorBox);

    const name = form.name.value.trim();
    const type = form.type.value;
    const capacity = parseInt(form.capacity.value);
    const location = form.location.value.trim();
    const status = form.status.value;
    const editId = editIdInput.value;

    if (!name || !type || !capacity || !location) {
      showError(errorBox, "Por favor completa todos los campos.");
      return;
    }

    if (capacity < 1) {
      showError(errorBox, "La capacidad debe ser mayor a 0.");
      return;
    }

    try {
      if (editId) {
        await updateWorkspace(editId, { name, type, capacity, location, status });
      } else {
        await createWorkspace({ name, type, capacity, location, status });
      }
      formContainer.classList.add("hidden");
      form.reset();
      await loadWorkspaces(container);
    } catch {
      showError(errorBox, "Error al guardar el espacio. Intenta de nuevo.");
    }
  });

  // Event delegation for edit / delete buttons
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-ws-edit");
    const deleteBtn = e.target.closest(".btn-ws-delete");

    if (editBtn) {
      const id = editBtn.dataset.id;
      try {
        const workspaces = await getWorkspaces();
        const ws = workspaces.find((w) => String(w.id) === id);
        if (!ws) return;

        formTitle.textContent = "Editar espacio";
        editIdInput.value = ws.id;
        form.name.value = ws.name;
        form.type.value = ws.type;
        form.capacity.value = ws.capacity;
        form.location.value = ws.location;
        form.status.value = ws.status;
        hideError(errorBox);
        formContainer.classList.remove("hidden");
        formContainer.scrollIntoView({ behavior: "smooth" });
      } catch {
        alert("Error al cargar el espacio.");
      }
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      if (!confirm("¿Estás seguro de que deseas eliminar este espacio?")) return;
      try {
        await deleteWorkspace(id);
        await loadWorkspaces(container);
      } catch {
        alert("Error al eliminar el espacio.");
      }
    }
  });
};

async function loadWorkspaces(container) {
  container.innerHTML = `<p class="text-slate-400 col-span-3 text-center py-8">Cargando espacios...</p>`;
  try {
    const workspaces = await getWorkspaces();

    if (!workspaces.length) {
      container.innerHTML = `<p class="text-slate-400 col-span-3 text-center py-8">No hay espacios registrados.</p>`;
      return;
    }

    container.innerHTML = workspaces.map((ws) => workspaceCard(ws)).join("");
  } catch {
    container.innerHTML = `<p class="text-red-500 col-span-3 text-center py-8">Error al cargar los espacios.</p>`;
  }
}

function workspaceCard(ws) {
  const statusLabel = STATUS_LABELS[ws.status] || ws.status;
  const statusClass = STATUS_CLASSES[ws.status] || "bg-gray-100 text-gray-800";

  return `
    <article class="bg-white border border-wine-100 rounded shadow-sm hover:shadow transition flex flex-col overflow-hidden">
      <!-- Card body -->
      <div class="p-3 flex flex-col gap-2 flex-1">
        <div class="flex justify-between items-start gap-2">
          <h3 class="font-semibold text-sm text-wine-800 leading-tight">${ws.name}</h3>
          <span class="text-xs font-medium px-2 py-0.5 rounded shrink-0 ${statusClass}">
            ${statusLabel}
          </span>
        </div>
        <div class="text-xs text-slate-500 flex flex-col gap-0.5">
          <p><span class="font-medium text-slate-600">Tipo:</span> ${ws.type}</p>
          <p><span class="font-medium text-slate-600">Capacidad:</span> ${ws.capacity} personas</p>
          <p><span class="font-medium text-slate-600">Ubicación:</span> ${ws.location}</p>
        </div>
      </div>

      <!-- Action bar -->
      <div class="bg-wine-50 border-t border-wine-100 px-3 py-2 flex gap-1.5">
        <button
          class="btn-ws-edit text-xs font-medium bg-wine-800 hover:bg-wine-700 text-white px-3 py-1 rounded transition"
          data-id="${ws.id}"
        >
          Editar
        </button>
        <button
          class="btn-ws-delete text-xs font-medium border border-slate-300 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded transition ml-auto"
          data-id="${ws.id}"
        >
          Eliminar
        </button>
      </div>
    </article>
  `;
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
