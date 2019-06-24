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

// Get current filename
var pathArray = window.location.pathname.split('/');
var currentFile = pathArray[pathArray.length-1];


/*
* --------------------------------------------------
* Shows real-time data of the transcribing progress
* --------------------------------------------------
*/

// Get projectID
var currentProjectPath = [];

db.collection('admin').doc('stats').get().then((snapshot) => {
  currentProjectPath2 = snapshot.data().projectClicked;
}).then(function() {
  currentProjectPath += currentProjectPath2;
}).then(function() {
  console.log('deze ' + currentProjectPath);
  db.collection('projects').doc(currentProjectPath).collection('users').onSnapshot(function() { loadProgress(currentProjectPath); } );

  // Get document name for the preview screen
  window.currentDocPath = [];
  db.collection('projects').doc(currentProjectPath).collection('documents').onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      currentDocPath.push(doc.id);
    });
  });

  // Count the amount of documents in the project
  db.collection('projects').doc(currentProjectPath).collection('documents').get().then(snap => {
    window.projectSize = snap.size;
  });

});

// Get current transcribing progress and show corresponding data
function loadProgress() {
  db.collection('projects').doc(currentProjectPath).collection('users').get().then((snapshot) => {
    window.userProgress = snapshot.docs[0].data().progress;
  }).then(function() {
    db.collection('projects').doc(currentProjectPath).collection('documents').get().then((snapshot) => {

      var docNumber = userProgress + 1;
      var showProgress = (userProgress / projectSize) * 100
      $("#progressBar").css('width', showProgress + "%");
      $("#previewTotal").empty().append(projectSize + " documents / <span class='badge badge-secondary'>" + projectSize*5 + " points</span>");
      $("#previewProgress").empty().append("Submitted: " + userProgress + "/" + projectSize + "<br>Approved: " + userProgress + " / <span class='badge badge-success'>" + userProgress*5 + " points</span>");
      $("#previewOverview").empty().append(projectSize);

      // Shows transcribing process
      // Redirect the user to project preview if end of project has been reached
      if (userProgress < projectSize) {
        var imageURL = snapshot.docs[userProgress].data().image;

        $("#submissionImage").attr("data", imageURL);
        $("#currentDoc").empty().append("<h3>Document " + docNumber + "/" + projectSize + "</h3>").css('text-align', 'right');
        $("#startProject").removeClass("d-none");

      } else if (currentFile == 'transcribe.html') {
        db.collection("projects").doc(currentProjectPath).collection("users").doc("kGlrZAGj4y5INSPFmiqM").set({
          completed: true
        });
        window.location.assign("transcribe_preview.html");
        $("#startProject").addClass("d-none");
      } else {
        $("#currentDoc").empty().append("<h3>Project completed</h3>").css('text-align', 'right');
      };

    });
  });
};


/*
* --------------------------------------------------
* Transcribing functionality
* > Form handling on the transcribe page only
* --------------------------------------------------
*/

// Listen for form submit
if (currentFile == 'transcribe.html') {
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
    db.collection("projects").doc(currentProjectPath).collection("documents").doc(currentDocPath[userProgress]).collection("submissions").doc("1").set({
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
    db.collection("projects").doc(currentProjectPath).collection("users").doc("kGlrZAGj4y5INSPFmiqM").set({
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
};


/*
* --------------------------------------------------
* Shows available projects on the user dashboard
* --------------------------------------------------
*/

const projectsList = document.querySelector('#projectsList');

// Create element and render projects
function renderProjects(doc){
  let group = document.createElement('div');
  let item = document.createElement('div');
  let projectID = doc.data().projectID;

  group.setAttribute('class', 'list-group list-group-flush');
  item.setAttribute('id', 'project_' + doc.id);
  item.setAttribute('class', 'list-group-item d-flex align-items-center');

  group.append(item);
  projectsList.before(group);

  $("#" + 'project_' + doc.id).append("<div class=''><div>Project #" + projectID + "</div><div id='previewTotal' class='text-muted'>100 documents / <span class='badge badge-secondary'>500 points</span></div></div>");
  $("#" + 'project_' + doc.id).append("<div class='ml-auto'><a id= '" + doc.id + "'class='btn btn-rijks'>Continue project</a></div>");


  document.getElementById(doc.id).addEventListener("click", redirectUser);

  function redirectUser() {
    db.collection("admin").doc("stats").update({
      projectClicked: parseInt(doc.id)
    }).then(function() {
      window.location.assign("transcribe_preview.html");
    });
    console.log(doc.id);

  }

}

if (currentFile == 'dashboard.html') {
  db.collection('projects').limit(10).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      renderProjects(doc)
    })
  })
};


/*
* --------------------------------------------------
* Redirects user to dynamic project
* --------------------------------------------------
*/


// if (currentFile == 'dashboard.html') {
//   document.getElementById(doc.id).addEventListener("click", redirectUser);
//
//   function redirectUser() {
//     console.log(doc.id);
//   }
//
// };
