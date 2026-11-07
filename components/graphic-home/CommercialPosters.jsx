import { useState } from 'react';
import CircularGallery from './CircularGallery.jsx';
import './commercial-posters.css';

const posters = [
  ['burger', '美味双层堡', 596, 842],
  ['618-sale', '618 钜惠狂欢', 4961, 6732],
  ['baseball', '棒球运动海报', 1076, 1462],
  ['earbuds', 'vivo TWS Air 耳机', 792, 1334],
  ['beauty-portrait', '琉光金妍', 750, 1334],
  ['skincare', 'Dr. Norman 护肤品', 750, 1334],
  ['makima', '玛奇玛', 750, 1334],
  ['rice-noodles', '一碗米线', 750, 1334],
  ['sandwich', '培根三明治', 792, 1343]
].map(([id, text, width, height]) => ({ image: `assets/works/commercial-posters/${id}.png`, text, width, height }));

export default function CommercialPosters() {
  const [unavailable, setUnavailable] = useState(false);
  return unavailable ? (
    <div className="works-commercial-fallback" aria-label="商业海报作品">
      {posters.map(({ image, text, width, height }) => (
        <a key={image} href={image} target="_blank" rel="noopener">
          <img src={image} alt={text} width={width} height={height} loading="lazy" />
        </a>
      ))}
    </div>
  ) : (
    <CircularGallery
      aria-label="商业海报弧形画廊"
      items={posters}
      bend={1.05}
      itemSize={1.42}
      itemAspect={0.74}
      gap={0.08}
      borderRadius={0}
      wave={0}
      fadeEdges={0}
      shadow={0}
      showTitles={false}
      intro={false}
      font="bold 30px system-ui"
      onUnavailable={() => setUnavailable(true)}
    />
  );
}
