if ('serviceWorker' in navigator) {
    // declaring scope manually
    navigator.serviceWorker.register('/sw.js', {scope: './'}).then(function(registration) {
        console.log('Service worker registration succeeded:', registration);
    }, /*catch*/ function(error) {
        console.log('Service worker registration failed:', error);
    });
} else {
    console.log('Service workers are not supported.');
}