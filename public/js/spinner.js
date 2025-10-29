/* spinner.js — subtle, size-aware pupil follow with reliable idle recentre */
(function () {
  const RRF = window.requestAnimationFrame;
  const PRM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initEye(eye) {
    const pupil = eye.querySelector('.eye-pupil');
    if (!pupil) return;

    // Physics (spring-damper)
    const W  = 12.0;     // angular frequency (lower = more lag)
    const Z  = 1;    // damping (closer to 1 = less overshoot)
    const IDLE_MS = 5000; // time without input before recenter (ms)

    let rect, cx, cy, maxPx;
    let tx = 0, ty = 0;    // target offset (px)
    let x = 0, y = 0;      // current offset (px)
    let vx = 0, vy = 0;    // velocity
    let lastT = 0;
    let lastInput = performance.now();

    function measure() {
      rect = eye.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top  + rect.height / 2;

      // SUBTLER movement: 5.5% of the shortest side (was ~8.5%)
      maxPx = Math.min(rect.width, rect.height) * 0.013;
    }
    measure();

    // Map pointer -> normalized [-1,1] within the eye box, ellipse-clamped
    function pointTo(mx, my) {
      if (!rect) return;
      lastInput = performance.now();

      let nx = (mx - cx) / (rect.width  * 0.5); // -1..1
      let ny = (my - cy) / (rect.height * 0.5); // -1..1

      // Elliptical clamp
      const r2 = nx*nx + ny*ny;
      if (r2 > 1) {
        const r = Math.sqrt(r2);
        nx /= r; ny /= r;
      }

      // Extra subtlety: smoothstep toward the rim so it never slams the edge
      const m = Math.min(1, Math.hypot(nx, ny));
      const smooth = m * m * (3 - 2 * m); // smoothstep
      const k = 0.85 * smooth;            // reduce reach a bit more

      tx = nx * maxPx * k;
      ty = ny * maxPx * k;
    }

    // Prefer pointer events; fall back to mouse/touch
    const onPointerMove = (e) => pointTo(e.clientX, e.clientY);
    const onMouseMove   = (e) => pointTo(e.clientX, e.clientY);
    const onTouchMove   = (e) => {
      const t = e.touches && e.touches[0];
      if (t) pointTo(t.clientX, t.clientY);
    };

    if (window.PointerEvent) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    } else {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll',  measure, { passive: true });

    if (PRM) { pupil.style.transform = 'translate3d(0,0,0)'; return; }

    function tick(t) {
      const now = t || performance.now();
      const dt = Math.min(0.05, (now - (lastT || now)) / 1000) || 0.0167;
      lastT = now;

      // Always recentre after IDLE_MS — regardless of pointer position
      if (now - lastInput > IDLE_MS) { tx = 0; ty = 0; }

      // Spring: a = w^2 (target - pos) - 2 z w vel
      const ax = W*W*(tx - x) - 2*Z*W*vx;
      const ay = W*W*(ty - y) - 2*Z*W*vy;

      vx += ax * dt;  vy += ay * dt;
      x  += vx * dt;  y  += vy * dt;

      // Tiny jitter removed (was too lively for subtle look)
      pupil.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      RRF(tick);
    }
    RRF(tick);
  }

  function ready(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }
  ready(() => { document.querySelectorAll('.eye').forEach(initEye); });
})();
