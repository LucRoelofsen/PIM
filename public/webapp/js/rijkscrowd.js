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
