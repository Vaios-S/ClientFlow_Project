const emailBtn = document.getElementById("emailBtn");
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
const accentButtons = document.querySelectorAll(".accent-option");
const savedOption = localStorage.getItem("accent");

let emailEnabled = true;

themeToggle.checked = savedTheme === "dark";
themeToggle.addEventListener("click", () => {
  if (themeToggle.checked) {
    localStorage.setItem("theme", "dark");
    document.body.dataset.theme = "dark";
  } else {
    localStorage.setItem("theme", "light");
    document.body.dataset.theme = "light";
  }
});

accentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem("accent", button.dataset.accent);
    document.body.dataset.accent = button.dataset.accent;
  });
});
emailBtn.addEventListener("click", () => {
  emailEnabled = !emailEnabled;
  emailBtn.textContent = emailEnabled ? "Enable" : "Disable";
});
// Initial setup
fetchSideBar();
