import React from 'react';
import { createRoot } from 'react-dom/client';
import HoloCard from './HoloCard';
import DriftWall from './DriftWall';
import DepthCarousel from './DepthCarousel';

window.mountPortfolioBoboPosters = (container, items) => {
  const root = createRoot(container);
  root.render(<DepthCarousel items={items} cardWidth={286} cardHeight={430}
    radius={10} spread={76} depth={155} tilt={10} visibleCards={3} blur={2} />);
  return () => root.unmount();
};

window.mountPortfolioBoboExpressions = container => {
  const root = createRoot(container);
  return {
    show(items, group) {
      root.render(<DriftWall key={group} items={items}
        className="works-bobo-drift" columns={4} tileWidth={172} tileHeight={158}
        gap={14} tilt={10} turn={-9} roll={-5} depth={50} speed={32}
        parallax={0.4} lift={24} fade={0.2} dim={0.94} />);
    },
    unmount() { root.unmount(); }
  };
};

const cream = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#F5E6D0"/></svg>'
);

window.mountPortfolioBoboCard = container => {
  const mobile = matchMedia('(pointer: coarse), (max-width: 560px)').matches;
  const root = createRoot(container);
  root.render(
    <HoloCard image={cream} alt="茶啵啵 TEA BOBO · 原创 IP 形象与品牌视觉设计 · 2026" className="works-ip-card"
      style={{ '--hc-ratio': 0.75 }}
      preset="collectible" frame={4.4} radius={18} idle={false} shadow={false}
      foilColor="#bac1ce" scale={mobile ? 0.9 : 1.15}
      intensity={mobile ? 0.48 : 0.79} edgeSparkle={mobile ? 0.6 : 0.92}
      glare={mobile ? 0.12 : 0.26} tiltMax={mobile ? 3 : 12} hoverScale={mobile ? 1 : 1.02}>
      <div className="works-ip-card-print" aria-hidden="true">
        <div className="works-ip-card-heading">
          <span className="works-ip-card-wordmark">
            <img src="assets/works/bobo-wordmark.png" alt="" draggable={false} />
          </span>
          <span className="works-ip-card-label">
            <span>TEA BOBO</span>
            <span className="works-ip-card-badge">ORIGINAL IP</span>
          </span>
        </div>
        <div className="works-ip-card-footer">
          <span className="works-ip-card-note">原创 IP 形象与品牌视觉设计</span>
          <span>CHARACTER DESIGN · 2026</span>
        </div>
      </div>
    </HoloCard>
  );
  return () => root.unmount();
};
