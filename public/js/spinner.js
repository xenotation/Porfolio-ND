(function () {
  function initEye(eye) {
    const pupil = eye.querySelector('.eye-pupil');
    if (!pupil) return;

    let rect, cx, cy, maxPx;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const followSpeed = 0.0113;

    function measure() {
      rect = eye.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      maxPx = Math.min(rect.width, rect.height) * 0.023;
    }

    function setTarget(mx, my) {
      if (!rect) return;

      let nx = (mx - cx) / (rect.width / 2);
      let ny = (my - cy) / (rect.height / 2);

      const length = Math.hypot(nx, ny);

      if (length > 1) {
        nx /= length;
        ny /= length;
      }

      targetX = nx * maxPx;
      targetY = ny * maxPx;
    }

    function animate() {
      currentX += (targetX - currentX) * followSpeed;
      currentY += (targetY - currentY) * followSpeed;

      pupil.style.transform = `translate3d(
        ${currentX.toFixed(2)}px,
        ${currentY.toFixed(2)}px,
        0
      )`;

      requestAnimationFrame(animate);
    }

    measure();

    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });

    window.addEventListener(
      'mousemove',
      (event) => setTarget(event.clientX, event.clientY),
      { passive: true }
    );

    animate();
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {
    document.querySelectorAll('.eye').forEach(initEye);
  });
})();