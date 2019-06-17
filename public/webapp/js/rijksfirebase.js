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

// Listen for form submit
document.getElementById("submissionForm").addEventListener("submit", submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal("name");
  var year = getInputVal("year");

  // Save submission
  saveSubmission(name, year);

  // Clear form
  document.getElementById("submissionForm").reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value
};

// Save message to firebase
function saveSubmission(name, year){

  var db = firebase.firestore();
                                                                                              // Variable user id
  db.collection("projects").doc("1").collection("documents").doc("1").collection("submissions").doc("1").set({
    name:name,
    year:year
  });
};
