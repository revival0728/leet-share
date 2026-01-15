firebaseApp = {};

firebaseApp.app = firebase.initializeApp(leetshareConfig.firebaseConfig);
firebaseApp.db = firebase.firestore(firebaseApp.app);

async function getProblemset() {
  const problemset = [];
  const snapshot = await firebaseApp.db.collection("problems").get();
  snapshot.forEach((doc) => {
    problemset.push({ id: doc.id, ...doc.data() });
  });
  return problemset;
}

async function getSolutionById(problemId) {
  const doc = await firebaseApp.db.collection("solutions").doc(problemId).get();
  if (!doc.exists) {
    throw new Error("Problem not found: " + problemId);
  }
  return { id: doc.id, ...doc.data() };
}
