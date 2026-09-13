"use strict";

import { bus } from "/assets/js/core/eventBus.js";

let currentTheme = "marine";
let stack, panels, sidebar, panelLinks, statusBar, themeBtn, fullscreenBtn;

function themeSwitch() {
  currentTheme = currentTheme === "marine" ? "nature" : "marine";
  document.documentElement.dataset.theme = currentTheme;
  if (themeBtn) themeBtn.textContent = currentTheme === "marine" ? "Thème nature" : "Thème marine";
}

async function fullscreenSwitch() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (e) {
    console.warn("Plein écran indisponible :", e);
  }
}

function openSidebar() {
  sidebar?.classList.add("open");
}

function closeSidebar() {
  sidebar?.classList.remove("open");
}

function initSidebar() {
  if (!sidebar) return;

  bus?.subscribe("sidebar:open", openSidebar);
  bus?.subscribe("sidebar:close", closeSidebar);

  window.openNav = () => bus ? bus.publish("sidebar:open") : openSidebar();
  window.closeNav = () => bus ? bus.publish("sidebar:close") : closeSidebar();

  /* Ouverture du menu PC + mobile */
  sidebar.querySelectorAll(".nav-header-row").forEach(row => {
    row.addEventListener("click", e => {
      if (e.target.closest(".nav-toggle") || e.target.closest(".nav-title") || window.innerWidth >= 768) {
        const article = row.closest(".nav-article");
        if (!article) return;

        const open = article.classList.toggle("open");
        const toggle = article.querySelector(".nav-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
      }
    });
  });

  /* Le clic direct sur le chevron reste prioritaire sur mobile */
  sidebar.querySelectorAll(".nav-toggle").forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      const article = button.closest(".nav-article");
      if (!article) return;

      const open = article.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
}

function switchPanel(index) {
  index = Number.parseInt(index, 10);
  if (Number.isNaN(index) || index < 0 || index >= panels.length) return;

  panels.forEach((panel, i) => panel.classList.toggle("hidden", i !== index));
  panelLinks.forEach((link, i) => link.classList.toggle("active", i === index));

  const title = panels[index]?.querySelector(".panel-title");
  if (title && statusBar) statusBar.textContent = `Automate actif : ${title.textContent.trim()}`;
}

function switchTab(card, id) {
  if (!card || !id) return;

  const target = card.querySelector(`#${CSS.escape(id)}`);
  if (!target) return;

  card.querySelectorAll(".tab-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.tab === id)
  );

  card.querySelectorAll(".tab-content").forEach(content =>
    content.classList.toggle("active", content.id === id)
  );
}

function initMainNavigation() {
  panelLinks = sidebar.querySelectorAll(".nav-toc > li > a[data-target-id]");

  panelLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      switchPanel(link.dataset.targetId);

      if (window.innerWidth < 768) closeSidebar();
    });
  });
}

function initSubNavigation() {
  sidebar.querySelectorAll(".nav-toc a[data-tab-target]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const target = document.getElementById(link.dataset.tabTarget);
      if (!target) return;

      const card = target.closest(".panel-card");
      if (!card) return;

      switchPanel(card.dataset.index);
      switchTab(card, target.id);

      if (window.innerWidth < 768) closeSidebar();

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initTabs() {
  panels.forEach(card => {
    card.querySelectorAll(".tab-btn").forEach(button => {
      button.addEventListener("click", () => switchTab(card, button.dataset.tab));
    });
  });
}

function initPagination() {
  document.querySelectorAll(".switch-tab-btn").forEach(button => {
    button.addEventListener("click", () => switchPanel(button.dataset.targetId));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  stack = document.getElementById("stack");
  sidebar = document.getElementById("sidebar");
  statusBar = document.getElementById("statusBar");
  themeBtn = document.getElementById("themeBtn");
  fullscreenBtn = document.getElementById("fullscreenBtn");

  if (!stack || !sidebar) {
    console.error("uiapp.js : #stack ou #sidebar introuvable");
    return;
  }

  panels = stack.querySelectorAll(".panel-card");

  initSidebar();
  initMainNavigation();
  initSubNavigation();
  initTabs();
  initPagination();

  themeBtn?.addEventListener("click", themeSwitch);
  fullscreenBtn?.addEventListener("click", fullscreenSwitch);

  /* Synchronisation de l'état initial */
  const activePanel = stack.querySelector(".panel-card:not(.hidden)");
  if (activePanel) {
    const index = Number.parseInt(activePanel.dataset.index, 10);
    if (!Number.isNaN(index)) switchPanel(index);
  }
});

