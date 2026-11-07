import { createRoot } from 'react-dom/client';
import FlexCarousel from './FlexCarousel';
import ExpandingIconGrid from './ExpandingIconGrid';

window.mountPortfolioIconGrid = (container, items) => {
  const root = createRoot(container);
  root.render(<ExpandingIconGrid items={items} />);
  return () => root.unmount();
};

window.mountPortfolioCarousel = (container, items, onChange) => {
  const root = createRoot(container);
  root.render(
    <FlexCarousel items={items} onChange={onChange} intro="rise"
      preset="liquid" fit="natural" cardHeight={0.5} gap={12}
      squeeze={0.2} focusOnClick captions />
  );
  return () => root.unmount();
};
