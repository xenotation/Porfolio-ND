// static/js/brand-scramble.js
(function () {
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—долен=+*^?#________0ьйБники';
        this.update = this.update.bind(this);
      }
      setText(newText) {
        const oldText = this.el.innerText;
        const len = Math.max(oldText.length, newText.length);
        const promise = new Promise(res => (this.resolve = res));
        this.queue = [];
        for (let i = 0; i < len; i++) {
          const from = oldText[i] || '';
          const to = newText[i] || '';
          const start = Math.floor(Math.random() * 40);
          const end = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end, char: '' });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }
      update() {
        let output = '';
        let complete = 0;
        for (let i = 0; i < this.queue.length; i++) {
          let q = this.queue[i];
          if (this.frame >= q.end) {
            complete++;
            output += q.to;
          } else if (this.frame >= q.start) {
            if (!q.char || Math.random() < 0.28) {
              q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
            }
            output += `<span class="dud">${q.char}</span>`;
          } else {
            output += q.from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) this.resolve();
        else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
    }
  
    function initBrandScramble() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
      const el = document.querySelector('.brand');
      if (!el) return;
  
      // Default = whatever is in the markup initially
      const DEFAULT_TEXT = el.textContent.trim();
  
      // Only these variants will appear temporarily
      const VARIANTS = [
        'i know your here',
        'ники долния',
        'Dr. Nilmerg'
      ];
  
      // Timing (ms): wait between MIN–MAX, show variant for HOLD, then revert
      const MIN_INTERVAL = 10000;  // 10s
      const MAX_INTERVAL = 60000;  // 60s
      const HOLD_MS      = 3000;   // how long a variant stays before reverting
  
      const fx = new TextScramble(el);
      let timer = null;
      let lastVariant = -1;
      let paused = false;
  
      // ensure \n renders correctly; harmless if already in your CSS
      el.style.whiteSpace = 'pre-line';
  
      const randDelay = () =>
        MIN_INTERVAL + Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1));
  
      const pickVariantIndex = () => {
        if (VARIANTS.length === 1) return 0;
        let i;
        do i = Math.floor(Math.random() * VARIANTS.length);
        while (i === lastVariant);
        return i;
      };
  
      const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };
  
      // Show a variant briefly, then revert to default and reschedule
      const pingVariant = async () => {
        if (paused) return;
        const idx = pickVariantIndex();
        lastVariant = idx;
        await fx.setText(VARIANTS[idx]);
        if (paused) return;
        setTimeout(async () => {
          await fx.setText(DEFAULT_TEXT);
          if (!paused) schedule();
        }, HOLD_MS);
      };
  
      const schedule = () => {
        clear();
        timer = setTimeout(pingVariant, randDelay());
      };
  
      // Initial render to default (animated once)
      fx.setText(DEFAULT_TEXT).then(schedule);
  
      // On hover/focus/tap: immediately show a variant, then revert and resume schedule
      const onUserTrigger = async () => {
        clear();
        await pingVariant();
      };
      ['mouseenter','focus','touchstart'].forEach(evt =>
        el.addEventListener(evt, onUserTrigger, { passive: true })
      );
  
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBrandScramble);
    } else {
      initBrandScramble();
    }
  })();
  