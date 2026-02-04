document.documentElement.classList.add("js");

function initSpa() {
  // cacher toutes les cards sauf la première (ou celle dans l'URL)
  document.querySelectorAll("[data-card]").forEach((sec) => {
    sec.hidden = true;
  });

  // afficher la section par défaut
  showCard("apropos");

  // idem pour les vues CV
  document.querySelectorAll("[data-cv-view]").forEach((view) => {
    view.hidden = true;
  });
  showCvView("competence");
}

initSpa();


// function showCard(cardId) {
//   document.querySelectorAll("[data-card]").forEach(sec => {
//     sec.hidden = (sec.id !== cardId);
//   });

//   const active = document.getElementById(cardId);
//   const title = active?.querySelector("h1, h2");
//   title?.focus?.();
// }

function showCard(cardId) {
  document.querySelectorAll("[data-card]").forEach(sec => {
    sec.hidden = (sec.id !== cardId);
  });

  // 👉 règle UX : le sous-menu CV reste ouvert tant qu'on est dans CV
  const isCv = cardId === "cv";
  setCvSubmenu(isCv);

  // focus accessibilité
  const active = document.getElementById(cardId);
  const title = active?.querySelector("h1, h2");
  title?.focus?.();
}


function showCvView(viewId) {
  document.querySelectorAll("[data-cv-view]").forEach(view => {
    view.hidden = (view.dataset.cvView !== viewId);
  });
}

// Toggle submenu
function setCvSubmenu(open) {
  const submenu = document.getElementById("submenu-cv");
  const toggleBtn = document.querySelector('[data-submenu-toggle="cv"]');

  if (!submenu || !toggleBtn) return;

  submenu.hidden = !open;
  toggleBtn.setAttribute("aria-expanded", String(open));
}


document.addEventListener("click", (e) => {
  // const toggle = e.target.closest("[data-submenu-toggle]");
  // if (toggle) {
  //   const submenu = document.getElementById("submenu-cv");
  //   const isOpen = !submenu.hidden;
  //   submenu.hidden = isOpen;
  //   toggle.setAttribute("aria-expanded", String(!isOpen));
  //   return;
  // }

	const cvToggle = e.target.closest('[data-submenu-toggle="cv"]');
  if (cvToggle) {
    e.preventDefault();

    // Si on n'est pas dans CV, on y va
    showCard("cv");

    // Le sous-menu sera ouvert automatiquement par showCard("cv")
    return;
  }

  const routeLink = e.target.closest("[data-route]");
  if (routeLink) {
    e.preventDefault();
    const route = routeLink.dataset.route;
    if (route === "apropos") showCard("apropos");
    if (route === "portfolio") showCard("portfolio");
    // CV : ouvre la card CV (et optionnellement garde la dernière vue)
    // showCard("cv");
    return;
  }

  // const cvLink = e.target.closest("[data-cvview]");
  // if (cvLink) {
  //   e.preventDefault();
  //   showCard("cv");
  //   showCvView(cvLink.dataset.cvview);
  //   // optionnel: fermer le submenu après sélection
  //   const submenu = document.getElementById("submenu-cv");
  //   const toggleBtn = document.querySelector('[data-submenu-toggle="cv"]');
  //   submenu.hidden = true;
  //   toggleBtn?.setAttribute("aria-expanded", "false");
  //   return;
  // }

	const cvLink = e.target.closest("[data-cvview]");
	if (cvLink) {
		e.preventDefault();
		showCard("cv");
		showCvView(cvLink.dataset.cvview);

		// IMPORTANT: ne pas fermer le sous-menu ici
		// setCvSubmenu(false); ❌ à NE PAS faire
		return;
	}
});



