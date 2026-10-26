document.documentElement.classList.add("js");

document.querySelectorAll(".header-container").forEach((header, index) => {
  const nav = header.querySelector(".nav");

  if (!nav) {
    return;
  }

  const navId = nav.id || `navegacao-principal-${index + 1}`;
  nav.id = navId;

  const toggle = document.createElement("button");
  toggle.className = "menu-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", navId);
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menu de navegação");
  toggle.innerHTML = "<span></span><span></span><span></span>";
  header.insertBefore(toggle, nav);

  const closeMenu = () => {
    header.classList.remove("menu-aberto");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu de navegação");
  };

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-aberto");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação",
    );
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-aberto")) {
      closeMenu();
      toggle.focus();
    }
  });
});

