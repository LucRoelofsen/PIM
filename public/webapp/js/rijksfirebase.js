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

indexNumber();

// Get current transcribing progress and show corresponding data
function indexNumber(){
  db.collection('projects').doc('1').collection('users').onSnapshot(function(snapshot) {
    var index = snapshot.docs[0].data().progress;

    db.collection('projects').doc('1').collection('documents').get().then((snapshot) => {
      var imageURL = snapshot.docs[index].data().image;
      var docNumber = index + 1;
      console.log('IMAGE >> ' + imageURL);
      $("#submissionImage").attr("src", imageURL);
      $("#currentDoc").empty().append("<h3>Document " + docNumber + "/100</h3>");
      $("#progressBar").css('width', index + "%");
    });
  });
};

// HANDLE SUBMISSIONS
// Listen for form submit
document.getElementById("submissionForm").addEventListener("submit", submitForm);

// Submit form
function submitForm(e) {
  e.preventDefault();

  // Get values
  var name = getInputVal("name");
  var year = getInputVal("year");

  // Save submission
  saveSubmission(name, year);
  updateProgress();

  // Clear form
  document.getElementById("submissionForm").reset();
}

// Function to get get form values
function getInputVal(id) {
  return document.getElementById(id).value
};

// Save message to firebase
function saveSubmission(name, year) {
  db.collection("projects").doc("1").collection("documents").doc("1").collection("submissions").doc("1").set({
    name: name,
    year: year
  });
};

// update progress in firebase
function updateProgress() {
  db.collection('projects').doc('1').collection('users').get().then((snapshot) => {
    var index = snapshot.docs[0].data().progress;
    db.collection("projects").doc("1").collection("users").doc("kGlrZAGj4y5INSPFmiqM").set({
      progress: index + 1
    });
  });
};
