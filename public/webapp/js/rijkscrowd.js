// FIREBASE related
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
document.getElementById('submissionForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var year = getInputVal('year');

  // Save submission
  saveSubmission(name, year);

  // Clear form
  document.getElementById('submissionForm').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function saveSubmission(name, year){

  var db = firebase.firestore()
                                                                                              // Variable user id
  db.collection("projects").doc("1").collection("documents").doc("1").collection("submissions").doc("1").set({
    name:name,
    year:year
  });
}


// CUSTOM JS
// ============================

// Highlights current item in navbar
$('body').scrollspy({ target: '#navbar-example' });

// Allows popup to have different text
$('#shopModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var voucher = button.data('voucher') // Extract info from data-* attributes
  var price = button.data('price')
  var value = button.data('value')

  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('€' + value + ' ' + voucher + ' ' + 'voucher')
  modal.find('.modal-body').text('Are you sure you want to buy a €'+ value + ' ' + voucher + ' ' + 'voucher for' + ' ' + price + ' ' + 'points' +'?')
});
