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
