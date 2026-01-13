function fillProblemTemplate(template, problem = {}) {
  const problemId = template.content.querySelector("#problem-id");
  const firstSolution = template.content.querySelector("pre code");
  problemId.textContent = problem.id;
  firstSolution.textContent = problem.solution;
}
