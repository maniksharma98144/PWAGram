var deferredPrompt;

//if promise is not supported by browser 
//included though promise.js pollyfill
if (!window.Promise) {
  window.Promise = Promise;
}

//registering a service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    });
}

//manipulation banner on the click of button not on the opening of application
window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});