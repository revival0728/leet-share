/*
problem = {
  id: string,
  solutions: [
    {
      language: string,
      time: string,
      memory: string,
      code: string
    },
    ...
  ]
}
*/
function checkProblemObject(problem = {}) {
  if (typeof problem.id !== "string")
    throw new Error("Problem id must be a string");
  if (!Array.isArray(problem.solutions))
    throw new Error("Problem solutions must be an array");
  for (const sol of problem.solutions) {
    if (typeof sol.language !== "string")
      throw new Error("Solution language must be a string");
    if (typeof sol.time !== "string")
      throw new Error("Solution time must be a string");
    if (typeof sol.memory !== "string")
      throw new Error("Solution memory must be a string");
    if (typeof sol.code !== "string")
      throw new Error("Solution code must be a string");
  }
}
function fillProblemTemplate(problem = {}) {
  if (!problem || Object.keys(problem).length === 0) {
    return document.createTextNode("No problem data");
  }
  try {
    checkProblemObject(problem);
  } catch (e) {
    console.warn("Invalid problem object:", e);
    return document.createTextNode("Error: Invalid problem data");
  }
  const pct = document.querySelector("#problem-container-template");
  const solt = document.querySelector("#solution-container-template");
  pct.content.querySelector(".problem-id").textContent = problem.id;
  pct.content.querySelector(".problem-link").href =
    "https://leetcode.com/problems/" +
    problem.id.toLowerCase().replaceAll(" ", "-");
  const solList = pct.content.querySelector(".solution-list");
  for (const sol of problem.solutions || []) {
    const solClone = document.importNode(solt.content, true);
    solClone.querySelector(
      ".language"
    ).textContent = `${sol.language.toUpperCase()} solution`;
    solClone.querySelector(".time span").textContent = sol.time;
    solClone.querySelector(".memory span").textContent = sol.memory;
    const codeContainer = solClone.querySelector("pre code");
    codeContainer.textContent = sol.code;
    codeContainer.classList.add(`language-${sol.language.toLowerCase()}`);
    hljs.highlightElement(solClone.querySelector("pre code"));
    solList.appendChild(solClone);
  }
  return document.importNode(pct.content, true);
}

// problemset = [ { id: string }, ... ]
function fillProblemsetTemplate(problemset = []) {
  if (!Array.isArray(problemset) || problemset.length === 0) {
    return document.createTextNode("No problems available");
  }
  const pst = document.querySelector("#problemset-container-template");
  const pet = document.querySelector("#problemset-element-template");
  const probList = pst.content.querySelector(".problem-list");
  for (const prob of problemset) {
    const probClone = document.importNode(pet.content, true);
    probClone.querySelector(".problem-id").textContent = prob.id;
    probClone.querySelector(".problem-lnk").href =
      "https://leetcode.com/problems/" +
      prob.id.toLowerCase().replaceAll(" ", "-");
    probClone.querySelector(".solution-lnk").href = `${
      leetshareConfig.rootPath
    }?p=${encodeURIComponent(prob.id)}`;
    probList.appendChild(probClone);
  }
  return document.importNode(pst.content, true);
}
