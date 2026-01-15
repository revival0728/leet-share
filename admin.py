import argparse
import firebase_admin
from firebase_admin import credentials, firestore
from termcolor import colored
from dotenv import load_dotenv
from typing import Awaitable
import os

load_dotenv()

class CmdResult:
  def __init__(self, success: bool, message: str = ""):
    self.success = success
    self.message = message
  def print(self):
    status = colored("SUCCESS", "green") if self.success else colored("FAILURE", "red")
    print(f"[{status}] {self.message}")

# initialize firebase admin
if os.environ.get("CERT_JSON_PATH") is None:
  raise ValueError("CERT_JSON_PATH environment variable not set.")
try: 
  cred = credentials.Certificate(os.environ.get("CERT_JSON_PATH"))
  firebase_admin.initialize_app(cred)
  db = firestore.client()
except Exception as e:
  raise RuntimeError(f"Failed to initialize Firebase Admin SDK: {e}")

# utils
# parse solution code from file -> (source code, language)
ext_to_lang = {
  ".cpp": "cpp",
  ".c": "c",
  ".rs": "rust",
}
def parse_sol_file(path: str) -> tuple[str, str]:
  if not os.path.isfile(path):
    raise ValueError(f"Solution code file {path} does not exist.")
  source_code = ""
  with open(path, "r") as f:
    source_code = f.read()
  _, ext = os.path.splitext(path)
  return source_code, ext_to_lang.get(ext, "unknown")

# commands
# initialize the database
def init() -> CmdResult:
  # db structure
  # collections: problems, solutions
  # problems: problem_id (document) -> { id: str }
  # solutions: problem_id (document) -> 
  #   { solutions: [{ id: str, code: str, language: str, time: str, memory: str }] }
  return CmdResult(True, "Database initialized.")

# list solutions for a problem
def list_solutions(problem_id: str) -> CmdResult:
  ss = db.collection("solutions").document(problem_id).get()
  if isinstance(ss, Awaitable):
    raise ValueError("Unexpected Awaitable type for Firestore document get.")
  if not ss.exists:
    return CmdResult(False, f"No solutions found for problem '{problem_id}'.")
  data = ss.to_dict()
  assert data is not None
  solutions = data["solutions"]
  print(f"Solutions for problem '{problem_id}':")
  for idx, sol in enumerate(solutions):
    print(f"- Solution ID: {idx}, Time: {sol['time']}, Memory: {sol['memory']}")
  return CmdResult(True, f"Listed solutions for problem '{problem_id}'.")

# post a solution
def post_solution(problem_id: str, solution_code: str, time: str, memory: str) -> CmdResult:
  doc = db.collection("solutions").document(problem_id)
  source_code, language = parse_sol_file(solution_code)
  data = {
    "solutions": firestore.firestore.ArrayUnion([{
      "code": source_code,
      "language": language,
      "time": time,
      "memory": memory,
    }])
  }
  ref = doc.get();
  if isinstance(ref, Awaitable):
    raise ValueError("Unexpected Awaitable type for Firestore document get.")
  if not ref.exists:
    doc.set(data)
  else:
    doc.update(data)
  return CmdResult(True, f"Solution for problem '{problem_id}' posted.")

# delete a solution
def delete_solution(problem_id: str, solution_id: int) -> CmdResult:
  trans = db.transaction()
  doc_ref = db.collection("solutions").document(problem_id)

  @firestore.firestore.transactional
  def delete_in_transaction(trans, doc_ref):
    ss = doc_ref.get(transaction=trans)
    if isinstance(ss, Awaitable):
      raise ValueError("Unexpected Awaitable type for Firestore document get.")
    if not ss.exists:
      return CmdResult(False, f"No solutions found for problem '{problem_id}'.")
    data = ss.to_dict()
    assert data is not None
    solutions = data["solutions"]
    if not solutions:
      return CmdResult(False, f"No solutions to delete for '{problem_id}'.")
    if solution_id < 0 or solution_id >= len(solutions):
      return CmdResult(False, f"Solution ID {solution_id} out of range for '{problem_id}'.")
    del solutions[solution_id]
    trans.update(doc_ref, {"solutions": solutions})
    return CmdResult(True, f"Solution #{solution_id} of '{problem_id}' deleted.")
  
  return delete_in_transaction(trans, doc_ref)

if __name__ == "__main__":
  aspr = argparse.ArgumentParser(description="Manage Leet Share solutions.")
  sub_aspr = aspr.add_subparsers(help="Commands to execute", dest="command")

  init_cmd = sub_aspr.add_parser("init", help="Initialize the database")

  list_cmd = sub_aspr.add_parser("list", help="List solutions for a problem")
  list_cmd.add_argument("-p", "--problem_id", type=str, required=True, help="Problem ID to list solutions for")

  post_cmd = sub_aspr.add_parser("post", help="Post a solution for a problem")
  post_cmd.add_argument("-p", "--problem_id", type=str, required=True, help="Problem ID to post solution for")
  post_cmd.add_argument("-s", "--solution_code", type=str, required=True, help="Solution code to post, provide as file path.")
  post_cmd.add_argument("-t", "--time", type=str, required=True, help="Execution time of the solution")
  post_cmd.add_argument("-m", "--memory", type=str, required=True, help="Memory usage of the solution")

  delete_cmd = sub_aspr.add_parser("delete", help="Delete a solution by ID")
  delete_cmd.add_argument("-p", "--problem_id", type=str, required=True, help="Problem ID of the solution")
  delete_cmd.add_argument("-i", "--solution_id", type=int, required=True, help="Solution ID to delete")

  args = aspr.parse_args()
  result = None

  if args.command == "init":
    result = init()
  elif args.command == "list":
    result = list_solutions(args.problem_id.strip())
  elif args.command == "post":
    result = post_solution(args.problem_id.strip(), args.solution_code, args.time, args.memory)
  elif args.command == "delete":
    result = delete_solution(args.problem_id.strip(), args.solution_id)
  else:
    result = CmdResult(False, "Unknown command.")

  assert result is not None

  result.print()