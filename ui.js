console.log("ui.js loaded");

const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has("p")) {
  setupProblemPage();
} else {
  setupHompage();
}

async function setupProblemPage() {
  const t = document.querySelector("#problem-container-template");
  fillProblemTemplate(t, {
    id: "1234",
    solution: `#include <stdio.h>\n\nint main() {\n    return 0;\n}`,
  });
  t.content.querySelector("pre code");
  const clone = document.importNode(t.content, true);
  const main = document.querySelector("main.homepage");
  main.classList.remove("homepage");
  main.classList.add("problem-page");
  main.innerHTML = "";
  main.appendChild(clone);
  hljs.highlightElement(document.querySelector(".problem-container pre code"));
}

function setupHompage() {
  document.querySelector("#go-daily").addEventListener("click", (event) => {
    window.location.href = "/?p=daily";
  });
}

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
