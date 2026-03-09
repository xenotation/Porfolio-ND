(function () {
  function initEye(eye) {
    const pupil = eye.querySelector('.eye-pupil');
    if (!pupil) return;

    let rect, cx, cy, maxPx;

    function measure() {
      rect = eye.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      maxPx = Math.min(rect.width, rect.height) * 0.06;
    }

    function move(mx, my) {
      if (!rect) return;

      let nx = (mx - cx) / (rect.width / 2);
      let ny = (my - cy) / (rect.height / 2);

      const len = Math.hypot(nx, ny);
      if (len > 1) {
        nx /= len;
        ny /= len;
      }

      const x = nx * maxPx;
      const y = ny * maxPx;

      pupil.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }

    measure();

    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY), { passive: true });
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