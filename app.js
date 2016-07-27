window.addEventListener("DOMContentLoaded", function() {
  var font = new FontFaceObserver('Raleway', {
    weight: 400
  });

  font.load().then(function() {
    document.documentElement.className += "fonts-loaded";
  });
}, false);
