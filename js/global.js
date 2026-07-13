const API_BASE_URL = "http://localhost:3000/";

function loadSidebar() {
  fetch("sidebar.html")
    .then((response) => response.text())
    .then(setActiveNavLink);
}

function setActiveNavLink(sidebarHtml) {
  document.getElementById("sidebar-container").innerHTML = sidebarHtml;

  const currentPage = window.location.pathname;
  const links = document.querySelectorAll(".nav-item");

  links.forEach((link) => {
    link.classList.remove("nav-item--active");

    if (currentPage.includes(link.getAttribute("href"))) {
      link.classList.add("nav-item--active");
    }
  });
}

function applySavedPreferences() {
  let theme = localStorage.getItem("theme");
  document.body.dataset.theme = theme || "light";

  let accent = localStorage.getItem("accent");
  document.body.dataset.accent = accent || "lime";
}

loadSidebar();
applySavedPreferences();

function api(endpoint, options = {}) {
  return fetch(`${API_BASE_URL}${endpoint}`, options);
}

function renderEmptyState(container, message) {
  container.innerHTML = `<p class="empty-state">${message}</p>`;
}

function showErrorMessage(message) {
  const errorContainer = document.getElementById("errorContainer");
  if (errorContainer) {
    errorContainer.textContent = message;
  }
}

function showPageError(message) {
  const pageError = document.getElementById("pageError");
  const errorMessage = document.querySelector(".page-error__message");
  const main = document.querySelector(".main-content");
  if (!pageError) return;

  main.classList.add("hidden");
  pageError.classList.remove("hidden");
  errorMessage.textContent = message;
}

function hidePageError() {
  const pageError = document.getElementById("pageError");
  const main = document.querySelector(".main-content");

  if (!pageError) return;

  pageError.classList.add("hidden");
  main.classList.remove("hidden");
}
