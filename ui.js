console.log("ui.js loaded");

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  document.querySelector("#theme-toggler").textContent =
    document.body.classList.contains("dark-mode") ? "Dark" : "️Light";
}

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  toggleTheme();
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    toggleTheme();
  });

document
  .querySelector("#theme-toggler")
  .addEventListener("click", (event) => toggleTheme());
