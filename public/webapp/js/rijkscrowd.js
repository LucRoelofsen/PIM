//allows popup to have different text
$('#shopModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var voucher = button.data('voucher') // Extract info from data-* attributes
  var price = button.data('price')
  var value = button.data('value')

  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('€' + value + ' ' + voucher + ' ' + 'voucher')
  modal.find('.modal-body').text('Are you sure you want to buy €'+ value + ' ' + voucher + ' ' + 'voucher for' + ' ' + price + ' ' + 'coins' +'?')
})


// highlights current item in navbar
$('body').scrollspy({ target: '#navbar-example' })

// assign wheelzoom
wheelzoom(document.querySelectorAll('img'));

// assign and set the zoom increment percentage
wheelzoom(document.querySelectorAll('img'), {zoom: 0.05});

// set a maximum zoom amount
wheelzoom(document.querySelectorAll('img'), {maxZoom: 2});

// zooming out can be triggered by calling 'wheelzoom.reset'
document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.reset'));

// wheelzoom can be removed from an element by calling 'wheelzoom.destroy'
document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.destroy'));
