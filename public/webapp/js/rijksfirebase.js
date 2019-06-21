/*
RijksCrowd Firebase JavaScript
Andrew Tan, Luc Roelofsen, Bob Pietersen
*/

// Initialize Firebase
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


/*
 * --------------------------------------------------
 * Shows real-time data of the transcribing progress
 * --------------------------------------------------
*/

// Listen for real-time changes
db.collection('projects').doc('1').collection('users').onSnapshot(function() { loadProgress(); } );

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

// Get current transcribing progress and show corresponding data
function loadProgress() {
  db.collection('projects').doc('1').collection('users').get().then((snapshot) => {
    window.userProgress = snapshot.docs[0].data().progress;
  }).then(function() {
    db.collection('projects').doc('1').collection('documents').get().then((snapshot) => {

      // Show transcribing process
      // Redirect the user to project preview if end of project has been reached
      if (userProgress < projectSize) {
        var imageURL = snapshot.docs[userProgress].data().image;
        var docNumber = userProgress + 1;
        var showProgress = (userProgress / projectSize) * 100
        $("#submissionImage").attr("data", imageURL);
        $("#currentDoc").empty().append("<h3>Document " + docNumber + "/" + projectSize + "</h3>");
        $("#progressBar").css('width', showProgress + "%");
      } else {
        db.collection("projects").doc("1").collection("users").doc("kGlrZAGj4y5INSPFmiqM").update({
          completed: true
        });
        window.location.assign("transcribe_preview.html");
      };

    });
  });
};


/*
------------------------------------------------------------
Transcribing functionality
> Form handling on the transcribe page
------------------------------------------------------------
*/

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

// Save data to Firebase
function saveSubmission(title, keywordsubject, keywordperson, doctype, date, author) {
  db.collection("projects").doc("1").collection("documents").doc(currentDocPath[userProgress]).collection("submissions").doc("1").update({
    title: title,
    keywordsubject: keywordsubject,
    keywordperson: keywordperson,
    doctype: doctype,
    date: date,
    author: author
  });
};

// Update progress in Firebase
function updateProgress() {
  db.collection("projects").doc("1").collection("users").doc("kGlrZAGj4y5INSPFmiqM").update({
    progress: userProgress + 1
  });

};

// Handles skipping documents
document.getElementById("confirmSkip").addEventListener("click", function(){
  updateProgress();
})

// Handles reporting illegible documents
// Future implementation: report to admin
document.getElementById("confirmIllegible").addEventListener("click", function(){
  updateProgress();
})


/*
------------------------------------------------------------
Transcribe preview
> Retrieve and show real-time on the preview page
------------------------------------------------------------
*/

// // Listen for real-time changes
// db.collection('projects').doc('1').collection('users').onSnapshot(function() { loadProgress(); } );
//
// // Get document name for the preview screen
// window.currentDocPath = [];
// db.collection('projects').doc('1').collection('documents').onSnapshot((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     currentDocPath.push(doc.id);
//   });
// });
//
// // Count the amount of documents in the project
// db.collection('projects').doc('1').collection('documents').get().then(snap => {
//   window.projectSize = snap.size;
// });
//
// // Get current transcribing progress and show corresponding data
// function loadProgress() {
//   db.collection('projects').doc('1').collection('users').get().then((snapshot) => {
//     window.userProgress = snapshot.docs[0].data().progress;
//   }).then(function() {
//     db.collection('projects').doc('1').collection('documents').get().then((snapshot) => {
//
//       // Show transcribing process
//       // Redirect the user to project preview if end of project has been reached
//       if (userProgress < projectSize) {
//         var imageURL = snapshot.docs[userProgress].data().image;
//         var docNumber = userProgress + 1;
//         var showProgress = (userProgress / projectSize) * 100
//         $("#submissionImage").attr("data", imageURL);
//         $("#currentDoc").empty().append("<h3>Document " + docNumber + "/" + projectSize + "</h3>");
//         $("#progressBar").css('width', showProgress + "%");
//       } else {
//         db.collection("projects").doc("1").collection("users").doc("kGlrZAGj4y5INSPFmiqM").update({
//           completed: true
//         });
//         window.location.replace("transcribe_preview.html");
//       };
//
//     });
//   });
// };
