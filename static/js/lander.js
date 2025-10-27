document.addEventListener('DOMContentLoaded', function () {
  function playRandomVideoOrImage(videoContainer, videoFiles, imageFiles) {
    // If you really want images on mobile, keep this block and provide image URLs.
    if (isMobileDevice() && imageFiles.length > 0) {
      var randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
      var img = document.createElement('img');
      img.src = randomImage;              // <-- direct URL now
      img.alt = 'Random Image';
      img.classList.add('video-container');
      videoContainer.innerHTML = '';
      videoContainer.appendChild(img);
      return;
    }

    // Otherwise: play a random video
    var randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];
    var videoElement = document.createElement('video');
    videoElement.src = randomVideo;       // <-- direct URL now
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;      // iOS inline playback
    videoElement.setAttribute('playsinline', ''); // extra-safe for iOS
    videoElement.preload = 'auto';
    videoElement.classList.add('video-container');

    videoContainer.innerHTML = '';
    videoContainer.appendChild(videoElement);

    // In case a file ends (loop should prevent this), load a new one
    videoElement.addEventListener('ended', function () {
      playRandomVideoOrImage(videoContainer, videoFiles, imageFiles);
    });
  }

  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  var videoContainers = document.getElementsByClassName('video-container');

  // Your Cloudflare R2 video URLs
  var videoFiles = [
    'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_01.mp4',
    'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_02.mp4',
    'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_03.mp4',
    'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_04.mp4',
    'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_05.mp4',
    'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_06.mp4',
    'https://pub-bf907ed99bd1421abc1452015e98ae3b.r2.dev/Multiscale%20Turing%20Pattern_07.mp4'
  ];

  // Optional: add direct image URLs here if you want static images on mobile
  var imageFiles = []; // e.g. ['https://.../image1.webp', 'https://.../image2.webp']

  Array.from(videoContainers).forEach(function (videoContainer) {
    playRandomVideoOrImage(videoContainer, videoFiles, imageFiles);

    videoContainer.addEventListener('click', function () {
      // Redirect to the /work page when clicked
      window.location.href = '/work';
    });
  });
});