// FIREBASE JavaScript
// ============================

// Initialize FIREBASE
var config = {
  apiKey: "AIzaSyCSjEyjHH51xNwlftWuYKTwzmFyNBLZFX8",
  authDomain: "pim-app-7028c.firebaseapp.com",
  databaseURL: "https://pim-app-7028c.firebaseio.com",
  projectId: "pim-app-7028c",
  storageBucket: "pim-app-7028c.appspot.com",
  messagingSenderId: "964929947463",
  appId: "1:964929947463:web:de972dacfdd0ef11"
};
firebase.initializeApp(config);
var db = firebase.firestore();

// Get document name for the preview screen
window.currentDocPath = [];
db.collection('projects').doc('1').collection('documents').onSnapshot((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    currentDocPath.push(doc.id);
  });
});

// Count the amount of documents in the project
db.collection('projects').doc('1').collection('documents').get().then(snap => {
  window.projectSize = snap.size;
});

function loadProgress() {
  db.collection('projects').doc('1').collection('users').get().then((snapshot) => {
    window.userProgress = snapshot.docs[0].data().progress;
  }).then(function() {
    db.collection('projects').doc('1').collection('documents').get().then((snapshot) => {
      var imageURL = snapshot.docs[userProgress].data().image;
      var docNumber = userProgress + 1;
      var showProgress = (userProgress / projectSize) * 100
      $("#submissionImage").attr("data", imageURL);
      $("#currentDoc").empty().append("<h3>Document " + docNumber + "/" + projectSize + "</h3>");
      $("#progressBar").css('width', showProgress + "%");
    });
  });
};

db.collection('projects').doc('1').collection('users').onSnapshot(function() { loadProgress(); } );

loadProgress();

// Listen for form submit
document.getElementById("submissionForm").addEventListener("submit", submitForm);

// Submit form
function submitForm(e) {
  e.preventDefault();

  // Get values from form
  var title = getInputVal("title");
  var keywordsubject = getInputVal("keywordsubject");
  var keywordperson = getInputVal("keywordperson");
  var doctype = getInputVal("doctype");
  var date = getInputVal("date");
  var author = getInputVal("author");

  // Save submission
  saveSubmission(title, keywordsubject, keywordperson, doctype, date, author);
  updateProgress();

  // Clear form
  document.getElementById("submissionForm").reset();
}

// Function to get get form values
function getInputVal(id) {
  return document.getElementById(id).value
};

// Save message to firebase
function saveSubmission(title, keywordsubject, keywordperson, doctype, date, author) {
  db.collection("projects").doc("1").collection("documents").doc(currentDocPath[userProgress]).collection("submissions").doc("1").set({
    title: title,
    keywordsubject: keywordsubject,
    keywordperson: keywordperson,
    doctype: doctype,
    date: date,
    author: author
  });
  loadProgress();
};

// Update progress in firebase
function updateProgress() {
  db.collection("projects").doc("1").collection("users").doc("kGlrZAGj4y5INSPFmiqM").set({
    progress: userProgress + 1
  });
};
