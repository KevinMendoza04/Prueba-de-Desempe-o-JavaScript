export default function notFoundView() {
  return `
    <div class="min-h-screen flex flex-col items-center justify-center bg-wine-50 px-4">
      <div class="bg-white p-8 rounded shadow border border-wine-100 text-center max-w-sm w-full">
        <h1 class="text-7xl font-bold text-wine-800">404</h1>
        <h2 class="text-lg font-semibold text-slate-700 mt-3">Página no encontrada</h2>
        <p class="text-slate-400 text-sm mt-2">
          La ruta que intentas visitar no existe o fue movida.
        </p>
        <button
          id="goHome"
          class="mt-5 bg-wine-800 hover:bg-wine-700 text-white px-5 py-2 rounded text-sm font-medium transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  `;
}
