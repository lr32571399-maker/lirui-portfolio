import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
// CardSwap.jsx and CardSwap.css are unmodified React Bits sources from 4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4.
import CardSwap, { Card } from './CardSwap.jsx';
import Typography from './Typography.jsx';
import CommercialPosters from './CommercialPosters.jsx';
import EcommerceStacks from './EcommerceStacks.jsx';
import './graphic-home.css';

function GraphicHome({ covers, onOpen }) {
  const deck = useRef(null);
  const stage = useRef(null);
  const [front, setFront] = useState(0);

  useEffect(() => {
    const area = stage.current;
    let distance = 0;
    let lastWheel = -Infinity;
    let switched = false;
    const onWheel = event => {
      if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const cover = document.elementFromPoint(event.clientX, event.clientY)?.closest('.works-graphic-cover');
      if (!cover || !area.contains(cover)) return;
      event.preventDefault();

      const now = performance.now();
      if (now - lastWheel > 180) {
        distance = 0;
        switched = false;
      }
      lastWheel = now;
      if (switched) return;

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? area.clientHeight : 1;
      if (Math.sign(distance) !== Math.sign(event.deltaY)) distance = 0;
      distance += event.deltaY * unit;
      if (Math.abs(distance) < 32) return;
      if (distance > 0) deck.current?.next();
      else deck.current?.prev();
      switched = true;
    };
    area.addEventListener('wheel', onWheel, { passive: false });
    return () => area.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <>
      <div className="works-graphic-stage" ref={stage}>
        <CardSwap
          ref={deck}
          width={820}
          height={504}
          visibleCards={2}
          cardDistance={128}
          verticalDistance={88}
          depth={56}
          skewAmount={4}
          dim={0.13}
          hoverSpread={0.08}
          parallax={0.15}
          autoplay={false}
          onChange={setFront}
          onCardClick={index => {
            if (index === front) onOpen(index);
          }}
        >
          {covers.map(({ title, image }, index) => (
            <Card key={title}>
              <button
                className="works-graphic-cover card-swap-item"
                type="button"
                data-cover-index={index}
                aria-label={`${index === front ? '查看' : '切换到'}${title}`}
              >
                <span className="card-swap-head">
                  <span className="card-swap-title">{title}</span>
                </span>
                <span className="card-swap-media">
                  <img src={image} width="1920" height="1080" alt="" draggable={false} />
                </span>
              </button>
            </Card>
          ))}
        </CardSwap>
      </div>
      <div className="works-graphic-actions">
        <button type="button" onClick={() => onOpen(front)}>查看作品</button>
      </div>
    </>
  );
}

window.mountPortfolioGraphicHome = (element, covers, onOpen) => {
  const root = createRoot(element);
  root.render(<GraphicHome covers={covers} onOpen={onOpen} />);
  return () => root.unmount();
};

window.mountPortfolioTypography = (element, scroller, onPreview) => {
  const root = createRoot(element);
  root.render(<Typography scroller={scroller} onPreview={onPreview} />);
  return () => root.unmount();
};

window.mountPortfolioCommercialPosters = element => {
  const root = createRoot(element);
  root.render(<CommercialPosters />);
  return () => root.unmount();
};

window.mountPortfolioEcommerceStacks = (element, onPreview) => {
  const root = createRoot(element);
  root.render(<EcommerceStacks onPreview={onPreview} />);
  return () => root.unmount();
};
