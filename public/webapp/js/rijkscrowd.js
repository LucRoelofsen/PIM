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

console.log(1);
// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCSjEyjHH51xNwlftWuYKTwzmFyNBLZFX8",
  authDomain: "pim-app-7028c.firebaseapp.com",
  databaseURL: "https://pim-app-7028c.firebaseio.com",
  projectId: "pim-app-7028c",
  storageBucket: "pim-app-7028c.appspot.com",
  messagingSenderId: "964929947463",
  appId: "1:964929947463:web:de972dacfdd0ef11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore()
db.collection("users").doc("test").collection("lucverdwijntruc").doc("vvJ9Ssp8De7sKWklnR3E").set({
  bobba: 'kentgeen150pokemon3',
  luc: 'bijnamaarwelmeerdanbobba'
})
.then(function(docRef) {
  console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
  console.error("Error adding document: ", error);
});
