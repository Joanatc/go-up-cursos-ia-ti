/* =========================================================
   NEXTSKILL — interacciones de la página
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del HTML que usaremos más de una vez.
  const menuToggle = document.querySelector("#menuToggle");
  const mainNav = document.querySelector("#mainNav");
  const courseSearch = document.querySelector("#courseSearch");
  const filterButtons = document.querySelectorAll(".filter-chip");
  const courseCards = document.querySelectorAll(".course-card");
  const emptyState = document.querySelector("#emptyState");
  const newsletterForm = document.querySelector("#newsletterForm");
  const emailInput = document.querySelector("#emailInput");
  const formMessage = document.querySelector("#formMessage");
  const currentYear = document.querySelector("#currentYear");

  // Mantiene el año del pie de página actualizado automáticamente.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Menú móvil: abrir/cerrar y actualizar atributos accesibles.
  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
      mainNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    // Al elegir una sección, el menú móvil se cierra.
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Escape permite cerrar el menú con el teclado.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
      // Atajo de teclado: Ctrl/Cmd + K enfoca la búsqueda de cursos.
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        if (courseSearch) {
          event.preventDefault();
          courseSearch.focus();
          courseSearch.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    });

    // Si se vuelve a una pantalla grande, se limpia el estado móvil.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Filtros y búsqueda funcionan juntos para encontrar cursos.
  let activeCategory = "Todos";

  function filterCourses() {
    const searchTerm = courseSearch ? courseSearch.value.trim().toLocaleLowerCase("es") : "";
    let visibleCount = 0;

    courseCards.forEach((card) => {
      const category = card.dataset.category || "";
      const searchableText = `${card.dataset.search || ""} ${card.textContent}`.toLocaleLowerCase("es");
      const matchesCategory = activeCategory === "Todos" || category === activeCategory;
      const matchesSearch = searchableText.includes(searchTerm);
      const shouldShow = matchesCategory && matchesSearch;

      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "Todos";

      // Solo un filtro queda visual y semánticamente seleccionado.
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      filterCourses();
    });
  });

  if (courseSearch) {
    courseSearch.addEventListener("input", filterCourses);
  }

  // Formulario demostrativo: valida el correo, pero no lo envía a un servidor.
  if (newsletterForm && emailInput && formMessage) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      formMessage.classList.remove("success", "error");

      if (!email) {
        formMessage.textContent = "Escribe tu correo electrónico para continuar.";
        formMessage.classList.add("error");
        emailInput.focus();
        return;
      }

      if (!emailPattern.test(email)) {
        formMessage.textContent = "Revisa el formato del correo. Ejemplo: tu@correo.com";
        formMessage.classList.add("error");
        emailInput.focus();
        return;
      }

      formMessage.textContent = "¡Gracias! El formulario funciona correctamente en esta demo; aún no guarda suscripciones.";
      formMessage.classList.add("success");
      newsletterForm.reset();
    });
  }

  // Estado inicial correcto para la lista de cursos.
  filterCourses();
});
