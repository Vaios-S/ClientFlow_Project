//Fetch Sidebar

function fetchSideBar() {
  fetch("sidebar.html")
    .then((response) => response.text())
    .then((sidebarHtml) => {
      document.getElementById("sidebar-container").innerHTML = sidebarHtml;

      const currentPage = window.location.pathname;
      const links = document.querySelectorAll(".nav-item");

      links.forEach((link) => {
        link.classList.remove("nav-item--active");

        if (currentPage.includes(link.getAttribute("href"))) {
          link.classList.add("nav-item--active");
        }
      });
    });
}
fetchSideBar();

// Toggle Theme

let theme = localStorage.getItem("theme");
document.body.dataset.theme = theme || "light";

// Toggle Accent

let accent = localStorage.getItem("accent");
document.body.dataset.accent = accent || "lime";
