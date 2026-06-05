import { removeSession, getSession, isAdmin } from "@/utils";
import { navigateTo } from "@/router/router";

export default function Sidebar() {
  const user = getSession();

  setTimeout(() => {
    document.querySelector("#logoutBtn")?.addEventListener("click", () => {
      removeSession();
      navigateTo("/");
    });

    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(link.getAttribute("href"));
      });
    });
  });

  return `
    <aside class="w-60 bg-wine-800 text-white min-h-screen p-5 flex flex-col shrink-0">
      <div class="mb-8">
        <h2 class="text-xl font-bold tracking-wide">SpaceBook</h2>
        <p class="text-wine-300 text-xs mt-1">${user?.name}</p>
      </div>

      <nav class="flex flex-col gap-1 flex-1">
        <a
          href="/home"
          data-link
          class="px-3 py-2 rounded text-sm hover:bg-wine-700 transition"
        >
          Inicio
        </a>

        <a
          href="/reservations/new"
          data-link
          class="px-3 py-2 rounded text-sm hover:bg-wine-700 transition"
        >
          Nueva reserva
        </a>

        ${
          isAdmin()
            ? `<a
                href="/workspaces"
                data-link
                class="px-3 py-2 rounded text-sm hover:bg-wine-700 transition"
              >
                Espacios
              </a>`
            : ""
        }
      </nav>

      <div class="pt-4 border-t border-wine-700">
        <p class="text-xs text-wine-400 mb-2 uppercase tracking-widest">Rol: ${user?.role}</p>
        <button
          id="logoutBtn"
          class="w-full text-left text-sm text-wine-300 hover:text-white hover:bg-wine-700 px-3 py-2 rounded transition cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  `;
}
