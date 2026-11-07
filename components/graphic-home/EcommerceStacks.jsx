// Unmodified JS/CSS Stack from https://reactbits.dev/r/Stack-JS-CSS.json.
import { useState } from 'react';
import Stack from './Stack.jsx';
import './ecommerce-stacks.css';

const series = [
  { folder: 'ecoflow', name: '正浩 EcoFlow 户外电源', boards: [1, 2, 3, 4, 5] },
  { folder: 'egg-tart', name: '皇家小虎葡式蛋挞', boards: [1, 3, 5, 6, 7] },
  { folder: 'iniu', name: 'INIU 迷你自带线充电宝', boards: [2, 1, 3, 4, 5] }
];

const detailBoards = [1, 2, 3, 4, 5, 6, 7, 8];

function ProductStack({ folder, name, boards, onPreview }) {
  const [active, setActive] = useState(0);
  const isDetail = Boolean(onPreview);
  const assetPath = isDetail ? 'ecommerce-details' : 'ecommerce';
  const imageSource = board => `assets/works/${assetPath}/${folder}/${board}.webp`;
  const imageLabel = index => `${name} · ${isDetail ? `第 ${index + 1} 屏` : `主图 ${index + 1}`}`;

  return (
    <figure>
      <div className="ecommerce-stack-stage">
        <div className="ecommerce-stack-size">
          <Stack
            tilt={20}
            threshold={110}
            spread={0.55}
            radius={12}
            sendToBackOnClick
            onChange={isDetail ? setActive : undefined}
            cards={boards.map((board, index) => (
              <img
                key={board}
                src={imageSource(board)}
                alt={imageLabel(index)}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ))}
          />
        </div>
      </div>
      <figcaption>
        <h4>{name}</h4>
        {isDetail ? (
          <>
            <p>拖动或点击切换 <span aria-live="polite">{active + 1} / {boards.length}</span></p>
            <button
              className="ecommerce-detail-preview-button"
              type="button"
              aria-label={`查看大图 · ${imageLabel(active)}`}
              onClick={event => {
                const label = imageLabel(active);
                onPreview(event.currentTarget, label, label, imageSource(boards[active]));
              }}
            >
              查看当前屏
            </button>
          </>
        ) : <p>DRAG TO EXPLORE</p>}
      </figcaption>
    </figure>
  );
}

export default function EcommerceStacks({ onPreview }) {
  return (
    <div className={onPreview ? 'ecommerce-stacks ecommerce-stacks--details' : 'ecommerce-stacks'}>
      {series.map(product => (
        <ProductStack key={product.folder} {...product} boards={onPreview ? detailBoards : product.boards} onPreview={onPreview} />
      ))}
    </div>
  );
}
