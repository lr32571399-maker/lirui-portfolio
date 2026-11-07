import { useEffect, useRef } from 'react';

const columns = 12;
const rows = 5;
const motionQuery = '(min-width: 760px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

// Each image stays within its allocated row and column, including during
// transitions. Expand the slots near the pointer within the fixed grid bounds.
function lensSlots(count, focus) {
  const weights = Array.from({length: count}, (_, index) => {
    const distance = index + 0.5 - focus;
    return 0.75 + 1.1 * Math.exp(-distance * distance / 2.5);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let start = 0;
  return weights.map(weight => {
    const size = weight * count / total;
    const center = start + size / 2;
    start += size;
    return {size, center};
  });
}

export default function ExpandingIconGrid({items}) {
  const gridRef = useRef(null);
  useEffect(() => {
    const grid = gridRef.current;
    const tiles = [...grid.children];
    const motion = window.matchMedia(motionQuery);
    let frame = 0;
    let pointer;

    function paint() {
      frame = 0;
      const bounds = grid.getBoundingClientRect();
      if (!pointer || !bounds.width || !bounds.height) return;
      const x = (pointer.x - bounds.left) / bounds.width * columns;
      const y = (pointer.y - bounds.top) / bounds.height * rows;
      const xSlots = lensSlots(columns, x);
      const ySlots = lensSlots(rows, y);
      tiles.forEach((tile, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const dx = col + 0.5 - x;
        const dy = row + 0.5 - y;
        const influence = Math.exp(-(dx * dx + dy * dy) / 2.6);
        const scale = Math.min(0.37 + influence * 1.1, 0.88 * Math.min(xSlots[col].size, ySlots[row].size));
        tile.style.setProperty('--icon-x', `${(xSlots[col].center - col - 0.5) * 100}%`);
        tile.style.setProperty('--icon-y', `${(ySlots[row].center - row - 0.5) * 100}%`);
        tile.style.setProperty('--icon-scale', scale);
        tile.style.setProperty('--icon-color', 1 - Math.min(1, influence * 1.6));
        tile.style.setProperty('--icon-opacity', 0.52 + influence * 0.48);
      });
      grid.classList.add('has-icon-lens');
    }

    function move(event) {
      if (event.pointerType !== 'mouse' || !motion.matches) return;
      pointer = {x: event.clientX, y: event.clientY};
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      grid.classList.remove('has-icon-lens');
    }

    grid.addEventListener('pointermove', move);
    grid.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);
    return () => {
      reset();
      grid.removeEventListener('pointermove', move);
      grid.removeEventListener('pointerleave', reset);
      motion.removeEventListener('change', reset);
    };
  }, []);

  return (
    <section className="works-icon-showcase" aria-labelledby="works-icon-title">
      <h3 id="works-icon-title">图标展示</h3>
      <ul className="works-icon-grid" ref={gridRef}>
        {items.map(([file, label, width, height, left, top]) => (
          <li key={file}>
            <span className="works-icon-art">
              <img loading="lazy" decoding="async" alt={label}
                style={{width: `${width}%`, height: `${height}%`, left: `${left}%`, top: `${top}%`}}
                src={`assets/works/icons/${encodeURIComponent(file)}`} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
