import loginView from "@/views/loginView";
import homeView from "@/views/homeView";
import createReservationView from "@/views/createReservationView";
import editReservationView from "@/views/editReservationView";
import workspacesView from "@/views/workspacesView";
import notFoundView from "@/views/notFound";
import accessDeniedView from "@/views/accessDeniedView";
import { isAuthenticated, isAdmin } from "@/utils";

// Route definitions: path → { view, requiresAuth, requiresAdmin }
const routes = {
  "/": { view: loginView, requiresAuth: false },
  "/home": { view: homeView, requiresAuth: true },
  "/reservations/new": { view: createReservationView, requiresAuth: true },
  "/reservations/edit": { view: editReservationView, requiresAuth: true },
  "/workspaces": { view: workspacesView, requiresAuth: true, requiresAdmin: true },
};

export const navigateTo = (path) => {
  history.pushState({}, "", path);
  router();
};

export const router = () => {
  const app = document.querySelector("#app");

  const path = window.location.pathname;
  const route = routes[path];

  // Unknown route → 404
  if (!route) {
    app.innerHTML = notFoundView();
    attachNotFoundListeners();
    return;
  }

  // Route requires authentication
  if (route.requiresAuth && !isAuthenticated()) {
    navigateTo("/");
    return;
  }

  // Already authenticated and trying to access login
  if (!route.requiresAuth && isAuthenticated()) {
    navigateTo("/home");
    return;
  }

  // Route requires admin role
  if (route.requiresAdmin && !isAdmin()) {
    app.innerHTML = accessDeniedView();
    attachAccessDeniedListeners();
    return;
  }

  app.innerHTML = route.view();
};

function attachNotFoundListeners() {
  setTimeout(() => {
    document.querySelector("#goHome")?.addEventListener("click", () => {
      navigateTo(isAuthenticated() ? "/home" : "/");
    });
  });
}

function attachAccessDeniedListeners() {
  setTimeout(() => {
    document.querySelector("#goHome")?.addEventListener("click", () => {
      navigateTo("/home");
    });
  });
}

window.addEventListener("popstate", router);
