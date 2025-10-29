// lander.js
document.addEventListener('DOMContentLoaded', function () {
    var videoFiles = [
      'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_01.mp4',
      'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_03.mp4',
      'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_04.mp4',
      'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_05.mp4',
      'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_06.mp4',
      'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_07.mp4'
    ];
  
    function nextIndex(prev) {
      if (videoFiles.length < 2) return Math.floor(Math.random() * videoFiles.length);
      var i = prev;
      while (i === prev) i = Math.floor(Math.random() * videoFiles.length);
      return i;
    }
  
    function mount(container, prevIdx) {
      var idx = nextIndex(prevIdx);
      var v = document.createElement('video');
      v.src = videoFiles[idx];
      v.autoplay = true;
      v.muted = true;               // required for autoplay
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.preload = 'auto';
  
      // make sure we don't accidentally target a <video> as a container
      container.innerHTML = '';
      container.appendChild(v);
  
      v.addEventListener('ended', function () {
        mount(container, idx);      // pick a new random video
      });
  
      // optional tiny diagnostics
      v.addEventListener('error', function () {
        // try another one if a file fails
        mount(container, idx);
      });
  
      // kick autoplay if blocked momentarily
      v.play && v.play().catch(function () {});
    }
  
    var containers = document.getElementsByClassName('video-container');
    Array.from(containers).forEach(function (c) {
      mount(c, -1);
      c.addEventListener('click', function () { window.location.href = '/work'; });
    });
  });
  