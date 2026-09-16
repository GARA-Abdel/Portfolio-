/* ============================================================
   GARA — Portfolio
   Script commun (FR + EN)
   - Menu mobile
   - Lien actif (header + subnav)
   - Sélecteur de langue FR / EN
   - Redirection auto selon langue du navigateur
   - Animations à l'apparition
   - Barres de compétences animées
   - Année auto dans le footer
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Menu mobile ---------- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Fermer le menu au clic sur un lien
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2. Détection de la langue depuis l'URL ---------- */
  // Renvoie 'fr' ou 'en' en fonction du chemin
  function currentLang() {
    const path = window.location.pathname;
    if (/\/en(\/|$)/.test(path)) return 'en';
    if (/\/fr(\/|$)/.test(path)) return 'fr';
    return null;
  }

  const LANG = currentLang();

  /* ---------- 3. Lien actif dans le header ---------- */
  // Nom du fichier courant (ex : about.html ou index.html)
  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  document.querySelectorAll('.nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    if (href && href === file) a.classList.add('active');
  });

  /* ---------- 4. Sélecteur de langue FR / EN ---------- */
  // On suppose que les liens du sélecteur ont :
  //   <a data-lang="fr" href="../fr/about.html">FR</a>
  //   <a data-lang="en" href="../en/about.html">EN</a>
  // → le JS ajoute la classe .active sur le bon.
  document.querySelectorAll('.lang-switch a').forEach(a => {
    if (a.dataset.lang === LANG) a.classList.add('active');
  });

  // Mémorise la langue choisie manuellement
  document.querySelectorAll('.lang-switch a').forEach(a => {
    a.addEventListener('click', () => {
      try { localStorage.setItem('gara-lang', a.dataset.lang); } catch (e) {}
    });
  });

  // Redirection auto sur la page d'accueil racine (index.html à la racine n'existe pas ici,
  // donc on cible le cas où on atterrit sur /fr/ ou /en/ sans page précise)
  // → géré au niveau de la racine par un index.html séparé si besoin.

  /* ---------- 5. Sub-navigation : lien actif selon scroll ---------- */
  const subnavLinks = document.querySelectorAll('.subnav a[href^="#"]');
  const blocks = Array.from(subnavLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (subnavLinks.length && blocks.length) {
    const setActive = id => {
      subnavLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    blocks.forEach(b => observer.observe(b));

    // État initial
    setActive(blocks[0].id);
  }

  /* ---------- 6. Animations à l'apparition ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- 7. Barres de compétences ---------- */
  // Chaque barre doit être : <i data-level="80"></i>
  // → JS met la largeur à 80 % quand la barre entre dans le viewport.
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.dataset.level || '0';
        bar.style.width = level + '%';
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar i[data-level]').forEach(b => barObserver.observe(b));

  /* ---------- 8. Année auto dans le footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 9. Sécurité : log discret ---------- */
  if (LANG) {
    console.log('%cGARA Portfolio — lang: ' + LANG.toUpperCase(),
      'color:#22d3a7;font-weight:600');
  }
})();