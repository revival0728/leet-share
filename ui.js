console.log("ui.js loaded");

// TODO: add search filter to problemset page

const searchParams = new URLSearchParams(window.location.search);

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

// setup navigation buttons
document
  .querySelector("#theme-toggler")
  .addEventListener("click", (event) => toggleTheme());

document.querySelector("#home-link").addEventListener("click", (event) => {
  window.location.href = leetshareConfig.rootPath;
});

if (searchParams.has("problemset")) {
  setupProblemsetPage();
} else if (searchParams.has("p")) {
  setupProblemPage();
} else {
  setupHompage();
}

async function setupProblemsetPage() {
  console.log("Setup problemset page");
  const problemset = await getProblemset();
  const problemsetPage = fillProblemsetTemplate([
    ...problemset.sort((a, b) => a.id.localeCompare(b.id)),
  ]);
  const main = document.querySelector("main");
  main.classList.remove("homepage");
  main.classList.add("problemset-page");
  main.innerHTML = "";
  main.appendChild(problemsetPage);
}

async function setupProblemPage() {
  console.log("Setup problem page");
  if (!searchParams.has("p")) {
    console.error("No problem id specified");
    return;
  }
  const problemId = decodeURIComponent(searchParams.get("p")).trim();
  try {
    const solution = await getSolutionById(problemId);
    const problemPage = fillProblemTemplate(solution);
    const main = document.querySelector("main");
    main.classList.remove("homepage");
    main.classList.add("problem-page");
    main.innerHTML = "";
    main.appendChild(problemPage);

    document
      .querySelector(".view-solutions")
      .addEventListener("click", (event) => {
        window.location.href = `${leetshareConfig.rootPath}?problemset`;
      });
  } catch {
    console.error("Problem not found: " + problemId);
    const main = document.querySelector("main");
    main.classList.remove("homepage");
    main.classList.add("problem-page");
    main.innerHTML = "<h2>Solution not found</h2>";
  }
}

function setupHompage() {
  console.log("Setup homepage");
  const homepageTemplate = document.querySelector(
    "#homepage-container-template"
  );
  const homepage = document.importNode(homepageTemplate.content, true);
  const main = document.querySelector("main");
  main.classList.add("homepage");
  main.innerHTML = "";
  main.appendChild(homepage);
  document
    .querySelector("#view-solutions")
    .addEventListener("click", (event) => {
      window.location.href = `${leetshareConfig.rootPath}?problemset`;
    });
}
