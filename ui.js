console.log("ui.js loaded");

const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has("problemset")) {
  setupProblemsetPage();
} else if (searchParams.has("p")) {
  setupProblemPage();
} else {
  setupHompage();
}

function setupProblemsetPage() {
  console.log("Setup problemset page");
  const problemsetPage = fillProblemsetTemplate([
    { id: "Two Sum" },
    { id: "Add Two Numbers" },
    { id: "Longest Substring Without Repeating Characters" },
  ]);
  const main = document.querySelector("main");
  main.classList.remove("homepage");
  main.classList.add("problemset-page");
  main.innerHTML = "";
  main.appendChild(problemsetPage);
}

function setupProblemPage() {
  console.log("Setup problem page");
  const problemPage = fillProblemTemplate({
    id: "Two Sum",
    solutions: [
      {
        language: "C",
        time: "0ms",
        memory: "3.45KB",
        code: `#include <stdio.h>\n\nint main() {\n    return 0;\n}`,
      },
      {
        language: "C",
        time: "0ms",
        memory: "3.45KB",
        code: `#include <stdio.h>\n\nint main() {\n    return 0;\n}`,
      },
    ],
  });
  const main = document.querySelector("main");
  main.classList.remove("homepage");
  main.classList.add("problem-page");
  main.innerHTML = "";
  main.appendChild(problemPage);
}

function setupHompage() {
  document
    .querySelector("#view-solutions")
    .addEventListener("click", (event) => {
      window.location.href = "/leet-share/?problemset";
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
