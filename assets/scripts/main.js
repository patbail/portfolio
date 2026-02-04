document.documentElement.classList.add("js");

const DEFAULT_CARD = "apropos";
const DEFAULT_CV_VIEW = "profil";

function setActiveCvLink(viewId) {
  document.querySelectorAll("[data-cvview]").forEach(a => {
    const active = a.dataset.cvview === viewId;
    if (active) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}

function setCvSubmenu(open) {
  const submenu = document.getElementById("submenu-cv");
  const toggleBtn = document.querySelector('[data-submenu-toggle="cv"]');
  if (!submenu || !toggleBtn) return;

  submenu.hidden = !open;
  toggleBtn.setAttribute("aria-expanded", String(open));
}

function focusSectionTitle(container) {
  const title = container?.querySelector("h1, h2");
  title?.focus?.();
}

function showCvView(viewId) {
  const views = document.querySelectorAll("[data-cv-view]");
  let activeView = null;

  views.forEach(view => {
    const isActive = view.dataset.cvView === viewId;
    view.hidden = !isActive;
    if (isActive) activeView = view;
  });

  setActiveCvLink(viewId);

  // Focus sur le titre de la vue interne (accessibilité)
  if (activeView) {
    const t = activeView.querySelector("h2, h3");
    t?.focus?.();
  }
}

function showCard(cardId, options = { forceCvDefault: false }) {
  document.querySelectorAll("[data-card]").forEach(sec => {
    sec.hidden = (sec.id !== cardId);
  });

  const isCv = cardId === "cv";
  setCvSubmenu(isCv);

  if (isCv && options.forceCvDefault) {
    showCvView(DEFAULT_CV_VIEW);
  }

  const active = document.getElementById(cardId);
  focusSectionTitle(active);
}

function initSpa() {
  // Par défaut, tout est visible en no-JS.
  // JS active le mode SPA en cachant tout puis en montrant une card.
  document.querySelectorAll("[data-card]").forEach(sec => (sec.hidden = true));
  document.querySelectorAll("[data-cv-view]").forEach(view => (view.hidden = true));

  // État initial SPA
  showCard(DEFAULT_CARD);
  // Prépare une vue CV par défaut si l'utilisateur y va ensuite
  // (Pas besoin de l'afficher ici)
}

initSpa();

document.addEventListener("click", (e) => {
  const cvToggle = e.target.closest('[data-submenu-toggle="cv"]');
  if (cvToggle) {
    e.preventDefault();
    // Entrée dans CV → profil par défaut
    showCard("cv", { forceCvDefault: true });
    return;
  }

  const routeLink = e.target.closest("[data-route]");
  if (routeLink) {
    e.preventDefault();
    const route = routeLink.dataset.route;
    if (route === "apropos") showCard("apropos");
    if (route === "portfolio") showCard("portfolio");
    // si tu ajoutes "services", "contact", etc: showCard(route)
    return;
  }

  const cvLink = e.target.closest("[data-cvview]");
  if (cvLink) {
    e.preventDefault();
    // On va sur CV mais on NE force PAS profil, car l'utilisateur a choisi une vue
    showCard("cv", { forceCvDefault: false });
    showCvView(cvLink.dataset.cvview);
    return;
  }
});
