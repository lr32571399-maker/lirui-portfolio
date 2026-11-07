(() => {
  const dialog = document.querySelector('.works-dialog');
  const detail = dialog?.querySelector('.works-detail');
  const motion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const entry = '[data-detail], .works-graphic-actions button';
  const target = `${entry}, .works-dialog [data-close], .folder-close, .directory-back`;
  const canvas = document.createElement('canvas');
  canvas.className = 'works-star-border';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!dialog || !context) return;

  const bleed = 24;
  let frame = 0;

  // Adapted from StarBorder's rounded outline and perimeter sampling.
  function outline(width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    const arc = Math.PI * r / 2;
    const across = width - 2 * r;
    const down = height - 2 * r;
    const segments = [
      [across, r, 0, 1, 0], [arc, width - r, r, 0, 0, -Math.PI / 2],
      [down, width, r, 0, 1], [arc, width - r, height - r, 0, 0, 0],
      [across, width - r, height, -1, 0], [arc, r, height - r, 0, 0, Math.PI / 2],
      [down, 0, height - r, 0, -1], [arc, r, r, 0, 0, Math.PI]
    ];
    const total = 2 * across + 2 * down + 4 * arc;
    return {
      total,
      pointAt(distance) {
        let s = ((distance % total) + total) % total;
        for (const [length, x, y, dx, dy, angle] of segments) {
          if (length && s <= length) {
            if (angle === undefined) return [x + dx * s, y + dy * s];
            const a = angle + s / r;
            return [x + Math.cos(a) * r, y + Math.sin(a) * r];
          }
          s -= length;
        }
        return [r, 0];
      }
    };
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.remove();
  }

  function draw(shape, head, opacity) {
    const [x, y] = shape.pointAt(head);
    const bloom = context.createRadialGradient(x, y, 0, x, y, 16);
    bloom.addColorStop(0, `rgb(255 248 233 / ${opacity * .8})`);
    bloom.addColorStop(.22, `rgb(255 248 233 / ${opacity * .36})`);
    bloom.addColorStop(1, 'rgb(255 248 233 / 0)');
    context.fillStyle = bloom;
    context.fillRect(x - 16, y - 16, 32, 32);

    let previous = [x, y];
    context.lineCap = 'round';
    for (let i = 1; i <= 16; i++) {
      const next = shape.pointAt(head - i * 2);
      const fade = (1 - (i - 1) / 16) ** 2 * opacity;
      context.beginPath();
      context.moveTo(...previous);
      context.lineTo(...next);
      context.lineWidth = 6;
      context.strokeStyle = `rgb(255 245 223 / ${fade * .19})`;
      context.stroke();
      context.lineWidth = 2;
      context.strokeStyle = `rgb(255 252 244 / ${fade})`;
      context.stroke();
      previous = next;
    }

    const core = context.createRadialGradient(x, y, 0, x, y, 4);
    core.addColorStop(0, `rgb(255 255 255 / ${opacity})`);
    core.addColorStop(.36, `rgb(255 253 248 / ${opacity * .85})`);
    core.addColorStop(1, 'rgb(255 253 248 / 0)');
    context.fillStyle = core;
    context.fillRect(x - 4, y - 4, 8, 8);
  }

  function canAnimate(button) {
    return !button.disabled && (!button.matches(entry) || detail.hidden);
  }

  document.addEventListener('pointerover', event => {
    const button = event.target.closest(target);
    if (!button || button.contains(event.relatedTarget) || !motion.matches || event.pointerType === 'touch'
      || !canAnimate(button)) return;

    stop();
    const width = button.offsetWidth;
    const height = button.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.ceil((width + bleed * 2) * dpr);
    canvas.height = Math.ceil((height + bleed * 2) * dpr);
    context.setTransform(dpr, 0, 0, dpr, bleed * dpr, bleed * dpr);
    button.append(canvas);
    const shape = outline(width, height, parseFloat(getComputedStyle(button).borderTopLeftRadius));
    const start = performance.now();

    function animate(now) {
      const progress = (now - start) / 1350;
      if (progress >= 1 || !button.matches(':hover') || !canvas.isConnected || !canAnimate(button)) {
        stop();
        return;
      }
      context.clearRect(-bleed, -bleed, width + bleed * 2, height + bleed * 2);
      draw(shape, shape.total * progress, Math.min(1, progress / .09, (1 - progress) / .16));
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
  });
  motion.addEventListener('change', stop);
})();
