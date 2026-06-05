import { saveSession } from "@/utils";
import { navigateTo } from "@/router/router";
import { http } from "@/api/http";

export const loginController = () => {
  const form = document.querySelector("#loginForm");
  const errorBox = document.querySelector("#loginError");

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
  }

  function hideError() {
    errorBox.classList.add("hidden");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      showError("Por favor completa todos los campos.");
      return;
    }

    try {
      const users = await http.get(
        `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      if (!users.length) {
        showError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        return;
      }

      saveSession({
        id: users[0].id,
        name: users[0].name,
        role: users[0].role,
      });

      navigateTo("/home");
    } catch (error) {
      console.error(error);
      showError("Error conectando con el servidor. Verifica que json-server esté activo.");
    }
  });
};
