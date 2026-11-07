import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import StrokeText from './StrokeText';
import './title-layout.css';

// Registry component with an optional total-duration adapter; original source is in registry.json.
const options = {
  strokeColor: '#066aff',
  strokeStyle: 'solid',
  strokeWidth: 1.4,
  dashLength: 10,
  drawDuration: 1.6,
  animationDuration: 1,
  fillDelay: 0.2,
  stagger: 0.05,
  ease: 'power2.out',
  trigger: 'mount',
  fillMode: 'wipe',
  wipeFrom: 'left',
  fontSize: 128,
  fontWeight: 800,
  fontFamily: '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif',
  letterSpacing: -4,
  marching: false,
  hoverRedraw: true,
  shadow: false,
  fillColor: null,
  shadowColor: '#066aff'
};

async function mountTitle() {
  const heading = document.getElementById('hero-title');
  if (!heading) return;
  // Measure only after fonts are ready; preserve readable HTML if loading fails.
  await document.fonts?.ready;
  const host = document.createElement('div');
  host.className = 'stroke-title';
  heading.setAttribute('aria-label', '个人作品集');
  heading.append(host);
  const root = createRoot(host);
  try {
    flushSync(() => root.render(
      <button type="button" className="stroke-title__replay" aria-label="重新播放个人作品集标题动画"
        onClick={event => event.currentTarget.querySelectorAll('.stroke-text').forEach(node => node.dispatchEvent(new Event('stroke-text:replay')))}>
        <div className="stroke-title__line stroke-title__line--short" aria-hidden="true"><StrokeText {...options} text="个人" /></div>
        <div className="stroke-title__line" aria-hidden="true"><StrokeText {...options} text="作品集" /></div>
      </button>
    ));
    heading.classList.add('has-stroke-title');
  } catch (error) {
    root.unmount();
    host.remove();
    console.warn('Title animation unavailable; keeping original heading.', error);
  }
}

mountTitle();
