import { useEffect, useState } from 'react';
import Masonry from './Masonry.jsx';
import InfiniteMenu from './InfiniteMenu.jsx';
import './typography.css';

const specimens = [
  ['flower', '花間語', 1076, 239], ['evolution', '进化论', 970, 415], ['simplicity', '抱朴守真', 1203, 279],
  ['gravity', '引力失控', 1104, 325], ['silence', '不言不語', 1132, 369], ['learn', '學無止境', 1115, 288],
  ['cat-coffee', '猫爪咖啡', 1118, 301], ['cyberpunk', '赛博朋克', 1192, 305], ['emei', '峨眉', 803, 367],
  ['stardew', '星露谷', 925, 315], ['north-china', '华北浪革', 1201, 275], ['double-joy', '加倍快乐', 1116, 312],
  ['mountains', '流落山川', 1053, 387], ['summit', '會當凌絕頂', 1045, 203], ['mario', '马里奥', 1174, 339],
  ['frontier', '拓界', 556, 330], ['line-lettering', '连笔字样', 971, 359], ['battle', '超战斗', 1153, 409]
].map(([id, title, width, height]) => ({
  id, title, width, height: height + Math.round(width * 0.14), img: `assets/works/type-specimens/${id}.png`
}));

const sphereItems = specimens.map(item => ({ ...item, image: item.img }));

export default function Typography({ scroller, onPreview }) {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('sphere');
  const [sphereUnavailable, setSphereUnavailable] = useState(false);
  const showWall = mode === 'wall' || sphereUnavailable;
  const [columns, setColumns] = useState(() => matchMedia('(min-width: 850px)').matches ? 3 : 2);

  useEffect(() => {
    const breakpoint = matchMedia('(min-width: 850px)');
    const update = () => setColumns(breakpoint.matches ? 3 : 2);
    breakpoint.addEventListener('change', update);
    return () => breakpoint.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    let frame;
    let position = scroller.scrollTop;
    let lastTime = performance.now() + 950;
    const pause = () => setRunning(false);
    const pauseForKey = event => {
      if (['Tab', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) pause();
    };
    const tick = time => {
      if (time > lastTime) {
        const bottom = scroller.scrollHeight - scroller.clientHeight;
        if (bottom - position <= 1) {
          pause();
          return;
        }
        position = Math.min(bottom, position + Math.min(time - lastTime, 50) * 0.026);
        scroller.scrollTop = position;
        lastTime = time;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    scroller.addEventListener('wheel', pause, { passive: true });
    scroller.addEventListener('touchmove', pause, { passive: true });
    scroller.addEventListener('keydown', pauseForKey);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('wheel', pause);
      scroller.removeEventListener('touchmove', pause);
      scroller.removeEventListener('keydown', pauseForKey);
    };
  }, [running, scroller]);

  const selectMode = next => {
    if (next === mode) return;
    setMode(next);
    setRunning(next === 'wall' && !matchMedia('(prefers-reduced-motion: reduce)').matches);
    scroller.scrollTop = 0;
  };

  const preview = (item, trigger) => {
    setRunning(false);
    onPreview(trigger, item.title, item.title, item.img);
  };

  return (
    <section className="works-typography" aria-labelledby="works-type-title">
      <div className="works-type-toolbar">
        <h3 id="works-type-title">字有其型 <span>{specimens.length} 件作品</span></h3>
        <div className="works-type-actions">
          <div className="works-type-modes" role="group" aria-label="字体展示方式">
            <button type="button" disabled={sphereUnavailable} aria-pressed={!showWall} onClick={() => selectMode('sphere')}>球形展览</button>
            <button type="button" aria-pressed={showWall} onClick={() => selectMode('wall')}>作品墙</button>
          </div>
        </div>
      </div>
      {!showWall ? (
        <div className="works-type-sphere">
          <InfiniteMenu
            items={sphereItems}
            count={54}
            tileSize={0.78}
            roundness={0.12}
            zoom={1.05}
            dim={0.2}
            autoplay={0}
            grayscale={false}
            onUnavailable={() => setSphereUnavailable(true)}
            pulseOnClick
          />
          <p>拖动球面浏览，点击卡片轻微放大</p>
        </div>
      ) : (
        <>
          {sphereUnavailable && <p role="status">当前浏览器无法显示球形展览，已切换到作品墙。</p>}
          <Masonry
            className="works-type-masonry"
            items={specimens}
            columns={columns}
            gap={12}
            radius={6}
            captions="none"
            draggable={false}
            lightbox={false}
            blurToFocus={false}
            duration={0.44}
            stagger={0.025}
            hoverEffect="lift"
            onItemClick={(item, index, event) => preview(item, event.currentTarget)}
          />
        </>
      )}
    </section>
  );
}
