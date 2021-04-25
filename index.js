if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', {scope: './'})
    .then( registration => console.log('Service worker registration succeeded:', registration))
    .catch( error => console.log('Service worker registration failed:', error))
}

// Debugger > Allow unsigned requests
