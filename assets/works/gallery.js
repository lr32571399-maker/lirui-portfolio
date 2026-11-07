(() => {
  const collections = {
    ui: [['同频', 'cover'], ['ServiceFlow', 62], ['半山咖啡', 35], ['数据可视化', 52], ['图标合集', 80]],
    ip: [['茶啵啵 BOBO', 87, [91,92,93,95,96,97]]]
  };
  const graphicWorks = [
    {
      title: '海报设计',
      image: 'assets/works/graphic-poster-cover.webp',
      sections: [
        ['商业海报'], ['电商主图'], ['电商详情页'],
        ['胶囊 Banner', [118]], ['主题活动 Banner', [119]], ['KT 板', [120]], ['H5 活动页']
      ]
    },
    {
      title: '字体设计',
      image: 'assets/works/graphic-type-cover.webp'
    }
  ];
  const graphicBoardHeights = {118: 2578, 119: 2330, 120: 2364};
  const headings = {ui:'UI 设计',ip:'IP 设计',graphic:'平面设计'};
  const dialog = document.createElement('dialog');
  dialog.className = 'works-dialog';
  dialog.setAttribute('aria-labelledby', 'works-title');
  dialog.innerHTML = `<header><h2 id="works-title"></h2><button type="button" data-close>返回文件夹</button></header>
    <section class="works-ip-home" aria-label="茶啵啵 BOBO" hidden>
      <div data-bobo-card></div>
    </section>
    <section class="works-graphic-home" aria-label="平面设计作品封面" hidden></section>
    <div class="works-track" aria-label="作品画廊"></div>
    <div class="works-controls"><button type="button" data-prev aria-label="上一个作品">←</button><p aria-live="polite"></p><button type="button" data-next aria-label="下一个作品">→</button></div>
    <button type="button" data-detail>查看作品</button>
    <section class="works-detail" hidden></section>`;
  document.body.append(dialog);
  const ipHome = dialog.querySelector('.works-ip-home');
  const boboCard = ipHome.querySelector('[data-bobo-card]');
  const graphicHome = dialog.querySelector('.works-graphic-home');
  const track = dialog.querySelector('.works-track');
  const controls = dialog.querySelector('.works-controls');
  const detail = dialog.querySelector('.works-detail');
  const detailButton = dialog.querySelector('[data-detail]');
  const title = dialog.querySelector('h2');
  let works = [], active = 0, category, unmount, unmountIcons, boboExpressions, unmountBoboPosters;
  let unmountTypography;
  let unmountCommercialPosters;
  let unmountEcommerceStacks;
  let unmountEcommerceDetails;
  const tongpinHeights = {
    cover: 2160, research: 3026, journey: 3160, strategy: 2192, architecture: 2888,
    visual: 5300, logo: 2292, 'type-icons': 4110, discover: 4464, match: 2390,
    voice: 2160, friends: 4372, profile: 3736, 'ui-overview': 5776, 'ui-states': 4034
  };
  const src = page => typeof page === 'number'
    ? `assets/works/page-${page}.webp`
    : `assets/works/tongpin/${page}.jpg`;
  function workImage(page, alt, eager = false) {
    const img = new Image();
    img.src = src(page);
    img.alt = alt;
    img.loading = eager ? 'eager' : 'lazy';
    if (tongpinHeights[page]) {
      img.width = 3840;
      img.height = tongpinHeights[page];
    }
    return img;
  }
  // Image width, height, left and top as percentages of the normalized square.
  const iconWorks = [
    ['icon-00.png', '发现', 115.11, 115.11, -7.27, -7.27],
    ['icon-01.png', '快速组队', 111.16, 111.16, -5.58, -6.21],
    ['selected-03.png', '连接中断 · 断开接口', 90.26, 90.26, 5.13, 7.18],
    ['icon-84.png', '取消匹配 · 暂停', 110.38, 110.38, -5.51, -5.82],
    ['icon-85.png', '圈子风格', 94.01, 94.01, 3, 4.07],
    ['icon-86.png', '头像装扮', 99.31, 99.31, 1.19, 0.91],
    ['icon-87.png', '我的', 92.9, 92.9, 3.55, 2.49],
    ['icon-88.png', '我的游戏圈', 92.09, 91.83, 4.09, 3.57],
    ['icon-89.png', '消息', 108.32, 108.32, -3.36, -6.81],
    ['icon-90.png', '悬浮', 132.52, 132.52, -16.26, -11.04],
    ['selected-11.png', '语音', 91.83, 91.83, 4.09, 3.57],
    ['selected-12.png', '语音主题', 90.26, 90.26, 5.13, 5.13],
    ['selected-13.png', '暂无队友 · 搜索手柄', 103.19, 103.19, -1.3, -5.11],
    ['selected-14.png', '支付成功 · 会员勾选', 112.74, 112.74, -6.05, -7.01],
    ['selected-15.png', '支付处理中 · 订单时钟', 120.46, 120.46, -12.28, -11.94],
    ['selected-16.png', '支付失败 · 钱包提醒', 117.77, 117.77, -9.55, -9.89],
    ['selected-17.png', '主题色彩', 99.94, 99.94, -0.54, 2.59],
    ['icon-55.png', '主页背景', 98.08, 98.08, 0.68, 0.96],
    ['selected-19.png', '专属徽章', 95.71, 95.71, 3.23, 4.05],
    ['icon-23.png', '购物车', 182.33, 182.33, -39.65, -12.26],
    ['icon-24.png', '定位', 232.99, 216.54, -67.52, -39],
    ['icon-25.png', '摄像', 191.25, 181.31, -49.97, -28.44],
    ['icon-28.png', '提醒', 147.85, 178.59, -27.22, -28.39],
    ['icon-30.png', '时钟', 175.45, 194.1, -35.65, -32.09],
    ['icon-31.png', '扬声器', 126.1, 137.7, -17.84, -13.02],
    ['icon-32.png', '收藏', 190.41, 190.41, -47.42, -18.69],
    ['selected-27.png', '图层 1-9', 141.91, 144.18, -20.96, -13.48],
    ['icon-03.png', '首页', 97.24, 97.24, 1.59, 3.86],
    ['icon-04.png', '搜索', 97.24, 97.24, 1.59, 3.86],
    ['icon-05.png', '消息', 97.24, 97.24, 1.59, 3.86],
    ['icon-06.png', '用户', 97.24, 97.24, 1.59, 3.86],
    ['icon-07.png', '文件', 97.24, 97.24, 1.59, 3.86],
    ['icon-08.png', '喜欢', 97.24, 97.24, 1.59, 3.86],
    ['icon-09.png', '收藏', 97.24, 97.24, 1.59, 3.86],
    ['icon-10.png', '通知', 97.24, 97.24, 1.59, 3.86],
    ['icon-11.png', '相机', 97.24, 97.24, 1.59, 3.86],
    ['icon-12.png', '音乐', 97.24, 97.24, 1.59, 3.86],
    ['icon-13.png', '完成', 97.24, 97.24, 1.59, 3.86],
    ['icon-14.png', '日历', 97.24, 97.24, 1.59, 3.86],
    ['icon-15.png', '云端', 97.24, 97.24, 1.59, 3.86],
    ['icon-16.png', '下载', 97.24, 97.24, 1.59, 3.86],
    ['icon-17.png', '安全', 97.24, 97.24, 1.59, 3.86],
    ['icon-18.png', '礼物', 97.24, 97.24, 1.59, 3.86],
    ['icon-19.png', '购物', 97.24, 97.24, 1.59, 3.86],
    ['icon-20.png', '数据', 97.24, 97.24, 1.59, 3.86],
    ['icon-21.png', '设置', 97.24, 97.24, 1.59, 3.86],
    ['icon-22.png', '闪电', 97.24, 97.24, 1.59, 3.86],
    ['icon-58.png', '文档', 111.34, 111.34, -1.59, -1.4],
    ['icon-59.png', '购物车', 111.34, 111.34, -1.59, -1.4],
    ['selected-50.png', 'Frame 19 2', 111.34, 111.34, -1.59, -1.4],
    ['icon-45.png', '发送', 111.34, 111.34, -1.59, -1.4],
    ['icon-62.png', '时钟', 111.34, 111.34, -1.59, -1.4],
    ['icon-47.png', 'Frame 22 2', 111.34, 111.34, -1.59, -1.4],
    ['icon-64.png', '宝石', 111.34, 111.34, -1.59, -1.4],
    ['selected-55.png', 'Frame 39 1', 105.96, 105.96, -0.18, -0.18],
    ['selected-56.png', 'Frame 41 1', 105.96, 105.96, -0.18, -0.18],
    ['selected-57.png', 'Frame 42 1', 105.96, 105.96, -0.18, -0.18],
    ['selected-58.png', 'Frame 46 1', 105.96, 105.96, -0.18, -0.18],
    ['selected-59.png', 'Frame 49 1', 105.96, 105.96, -0.18, -0.18],
    ['selected-60.png', 'Frame 49· 1', 105.96, 105.96, -0.18, -0.18],
  ];
  function tongpinSection(title, description, images) {
    const section = document.createElement('section');
    section.className = 'works-case-section';
    const heading = document.createElement('h3');
    const copy = document.createElement('p');
    heading.textContent = title;
    copy.textContent = description;
    section.append(heading, copy, ...images.map(([page, alt]) => workImage(page, alt)));
    return section;
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function tongpinSidebar(chapters, {label = '同频章节目录', onCurrent, scrollOffset = () => 32} = {}) {
    const nav = document.createElement('nav');
    nav.className = 'works-line-sidebar';
    nav.setAttribute('aria-label', label);
    const list = document.createElement('ol');
    nav.append(list);
    const buttons = chapters.map(([label, target], index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      const caption = document.createElement('span');
      caption.className = 'works-line-label';
      const number = document.createElement('span');
      number.className = 'works-line-number';
      number.textContent = String(index + 1).padStart(2, '0');
      caption.append(number, label);
      button.append(caption);
      button.onclick = () => {
        const top = target.getBoundingClientRect().top - dialog.getBoundingClientRect().top;
        dialog.scrollTo({top: dialog.scrollTop + top - scrollOffset(nav), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
      };
      item.append(button);
      list.append(item);
      return button;
    });
    function highlightChapter() {
      if (detail.hidden || !nav.isConnected || (!onCurrent && !nav.offsetWidth)) return;
      const line = dialog.getBoundingClientRect().top + dialog.clientHeight * 0.3;
      let current = 0;
      chapters.forEach(([, target], index) => {
        if (target.getBoundingClientRect().top <= line) current = index;
      });
      if (dialog.scrollTop + dialog.clientHeight >= dialog.scrollHeight - 2) current = chapters.length - 1;
      buttons.forEach((button, index) => {
        if (button.hasAttribute('aria-current') === (index === current)) return;
        if (index === current) button.setAttribute('aria-current', 'location');
        else button.removeAttribute('aria-current');
      });
      onCurrent?.(current);
      if (nav.offsetWidth) startMotion();
    }
    const targets = buttons.map(() => 0);
    const effects = buttons.map(() => 0);
    let frame = null;
    let lastTime = 0;
    function animate(now) {
      frame = null;
      if (!nav.isConnected || !dialog.open || detail.hidden) return;
      const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-Math.min(now - lastTime, 50) / 100);
      lastTime = now;
      let moving = false;
      buttons.forEach((button, index) => {
        const target = Math.max(targets[index], Number(button.hasAttribute('aria-current')));
        const next = effects[index] + (target - effects[index]) * blend;
        const settled = Math.abs(target - next) < 0.0015;
        effects[index] = settled ? target : next;
        button.style.setProperty('--effect', effects[index].toFixed(4));
        moving ||= !settled;
      });
      if (moving) frame = requestAnimationFrame(animate);
    }
    function startMotion() {
      if (frame !== null) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(animate);
    }
    list.addEventListener('pointermove', event => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      buttons.forEach((button, index) => {
        const rect = button.getBoundingClientRect();
        const proximity = Math.max(0, 1 - Math.abs(event.clientY - rect.top - rect.height / 2) / 100);
        targets[index] = proximity * proximity * (3 - 2 * proximity);
      });
      startMotion();
    });
    list.addEventListener('pointerleave', () => {
      targets.fill(0);
      startMotion();
    });
    nav.updateCurrentChapter = highlightChapter;
    return nav;
  }
  function updateTongpinChapter() {
    const nav = detail.querySelector('.works-line-sidebar');
    if (nav?.classList.contains('works-coffee-nav')) {
      if (!coffeeFrame) coffeeFrame = requestAnimationFrame(() => {
        coffeeFrame = 0;
        nav.updateCurrentChapter();
      });
    } else nav?.updateCurrentChapter();
  }
  dialog.addEventListener('scroll', updateTongpinChapter, {passive: true});
  window.addEventListener('resize', updateTongpinChapter);
  let revealObserver;
  let coffeeFrame = 0;
  const revealedImages = new Set();
  function observeProjectImages(images) {
    if (!('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver((entries, observer) => {
      for (const {isIntersecting, target} of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        revealedImages.add(target.src);
        target.classList.add('works-image-entered');
      }
    }, {root: dialog, threshold: 0.06});
    for (const img of images) {
      if (!revealedImages.has(img.src)) revealObserver.observe(img);
    }
  }
  function coffeeScreens(coverImage) {
    const section = document.createElement('section');
    section.className = 'works-case-section works-coffee';
    const heading = document.createElement('h3');
    heading.textContent = '从点单到取餐';
    section.append(heading);
    const pages = [
      ['competition', '竞品分析', 2812, 3840, 'jpg'],
      ['flow', '产品结构与核心流程', 1292],
      ['visual-system', '字体与色彩', 4302, 3840, 'jpg'],
      ['components', '布局与组件', 4266, 3840, 'jpg'],
      ['home', '小程序首页', 1327],
      ['menu', '菜单与商品详情', 1855],
      ['checkout', '订单与支付', 2210],
      ['membership', '会员、优惠与收藏', 1292],
      ['showcase', '页面展示总览', 3798, 3840, 'jpg'],
    ];
    const chapters = [];
    function addPage(file, label, img, parent) {
      const page = document.createElement('div');
      page.className = 'works-coffee-page';
      page.dataset.coffeePage = file;
      page.append(img);
      parent.append(page);
      chapters.push([label, page]);
    }
    const layout = document.createElement('div');
    layout.className = 'works-coffee-layout';
    const content = document.createElement('div');
    content.className = 'works-coffee-content';
    addPage('cover', '项目封面', coverImage, content);
    content.append(section);
    for (const [file, label, height, width = 1920, extension = 'png'] of pages) {
      const img = new Image(width, height);
      img.src = `assets/works/hillside/${file}.${extension}`;
      img.alt = `半山咖啡 · ${label}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      addPage(file, label, img, section);
    }
    let activePage;
    const nav = tongpinSidebar(chapters, {label: '半山咖啡章节目录', onCurrent: index => {
      const next = chapters[index][1];
      if (activePage === next) return;
      activePage?.classList.remove('is-current');
      next.classList.add('is-current');
      activePage = next;
      layout.classList.add('has-current');
    }});
    nav.classList.add('works-coffee-nav');
    layout.append(nav, content);
    return layout;
  }
  function stopProjectMotion() {
    unmountCommercialPosters?.();
    unmountCommercialPosters = undefined;
    unmountEcommerceStacks?.();
    unmountEcommerceStacks = undefined;
    unmountEcommerceDetails?.();
    unmountEcommerceDetails = undefined;
    unmountTypography?.();
    unmountTypography = undefined;
    unmountBoboPosters?.();
    unmountBoboPosters = undefined;
    boboExpressions?.unmount();
    boboExpressions = undefined;
    unmountIcons?.();
    unmountIcons = undefined;
    revealObserver?.disconnect();
    revealObserver = undefined;
    cancelAnimationFrame(coffeeFrame);
    coffeeFrame = 0;
  }
  const imagePreview = document.createElement('dialog');
  imagePreview.className = 'works-image-preview';
  imagePreview.setAttribute('aria-labelledby', 'works-preview-title');
  imagePreview.innerHTML = '<div class="works-preview-toolbar"><h3 id="works-preview-title"></h3><button type="button" autofocus>退出大图</button></div><img alt="">';
  dialog.append(imagePreview);
  const previewImage = imagePreview.querySelector('img');
  const previewTitle = imagePreview.querySelector('h3');
  const previewExit = imagePreview.querySelector('button');
  let previewTrigger, previewScrollTop;
  function closeImagePreview() {
    imagePreview.close();
    previewImage.removeAttribute('src');
    if (dialog.open && previewTrigger?.isConnected) {
      previewTrigger.focus({preventScroll: true});
      dialog.scrollTop = previewScrollTop;
    }
    previewTrigger = undefined;
  }
  previewExit.onclick = closeImagePreview;
  imagePreview.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeImagePreview();
  });
  imagePreview.addEventListener('cancel', event => {
    event.preventDefault();
    closeImagePreview();
  });
  function openImagePreview(trigger, title, alt, source = trigger.href) {
    imagePreview.classList.toggle('is-type-preview', Boolean(trigger.closest('.works-typography')));
    imagePreview.classList.toggle('is-ecommerce-detail-preview', Boolean(trigger.closest('.ecommerce-stacks--details')));
    previewTrigger = trigger;
    previewScrollTop = dialog.scrollTop;
    trigger.focus({preventScroll: true});
    previewTitle.textContent = title;
    previewImage.alt = alt;
    previewImage.src = source;
    imagePreview.showModal();
    imagePreview.scrollTop = 0;
  }
  function boboDetails() {
    const layout = document.createElement('div');
    layout.className = 'works-bobo-layout';
    const content = document.createElement('div');
    content.className = 'works-bobo-content';
    const boardHeights = {2:1080, 3:1124, 4:1700, 5:1684, 6:2330, 7:1490, 9:1694, 10:1408, 11:1634, 12:1114, 18:1868, 19:1858, 20:1766, 21:1712};
    const boardFile = number => `board-${String(number).padStart(2, '0')}`;
    const imageFile = name => `assets/works/bobo/${name}.webp`;

    const sections = [
      ['品牌登场', '从一杯奶茶，到一份陪伴。', [[2, '茶啵啵项目主视觉'], [3, '品牌介绍与关键词']]],
      ['标志设计', '企鹅、奶茶杯、茶叶和珍珠，构成茶啵啵的标志。', [[4, '设计理念与标志构成'], [5, '字标演化与标志组合']]],
      ['视觉规范', '从制图和安全距离，到黑白、单色、反白与品牌标准色。', [[6, '标志制图规范与组合比例'], [7, '安全距离与最小使用尺寸'], [9, '彩色、黑白、单色与反白应用'], [10, '品牌标准色与颜色使用规范']]],
      ['角色设定', '从角色设定到正面、侧面和背面，建立 BOBO 的形象系统。', [[11, 'BOBO 角色档案'], [12, '角色正面、侧面与背面三视图']]],
      ['表情展', '浏览 BOBO 的全身表情、角色动作与头像。'],
      ['海报展', 'BOBO GOES TO THE MOVIES · 电影主题海报，AIGC 辅助创作。'],
      ['物料延展', '从杯身与包装，到贴纸、周边和门店应用。', [[18, '杯身与品牌包装'], [19, '外带包装与印刷物料'], [20, '周边与品牌服饰'], [21, '品牌视觉的场景应用']]],
    ];

    const chapters = sections.map(([label, copy, boards = []], index) => {
      const section = document.createElement('section');
      section.className = 'works-bobo-section';
      const heading = document.createElement('h3');
      const number = document.createElement('span');
      number.textContent = String(index + 1).padStart(2, '0');
      heading.append(number, label);
      const description = document.createElement('p');
      description.textContent = copy;
      section.append(heading, description);
      for (const [board, alt] of boards) {
        const panel = document.createElement('div');
        panel.className = 'works-bobo-artwork works-bobo-board';
        const image = new Image(1920, boardHeights[board]);
        image.src = imageFile(boardFile(board));
        image.alt = alt;
        image.loading = board === 2 ? 'eager' : 'lazy';
        image.decoding = 'async';
        panel.append(image);
        section.append(panel);
      }
      content.append(section);
      return [label, section];
    });

    const expressionSection = chapters[4][1];
    const groups = [
      ['全身表情', ['开心大笑', '星星眼', '比心眨眼', '奶茶真香', '呜呜大哭', '满头问号', '气鼓鼓', '困困午睡']],
      ['角色动作', ['招手问好', '开心蹦跳', '乖乖坐好', '元气迈步', '开心欢呼', '爱心抱抱', '快乐摇摆', '安心入睡']],
      ['头像表情', ['开心笑笑', '俏皮眨眼', '害羞脸', '惊讶张嘴', '气鼓鼓', '委屈大哭', '疑惑问号', '困困睡觉',
        '得意挑眉', '俏皮吐舌', '尴尬流汗', '放声大笑', '星星眼', '欢呼雀跃', '甜甜比心', '温柔微笑']],
    ];
    const filters = document.createElement('div');
    filters.className = 'works-bobo-filters';
    const wall = document.createElement('div');
    wall.className = 'works-bobo-wall';
    const drift = document.createElement('div');
    drift.className = 'works-bobo-drift-host';
    boboExpressions = window.mountPortfolioBoboExpressions(drift);
    const groupButtons = groups.map(([label], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.onclick = () => showGroup(index);
      filters.append(button);
      return button;
    });
    function showGroup(index) {
      groupButtons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(index === buttonIndex)));
      const items = groups[index][1].map((title, offset) => ({
        title,
        image: imageFile(`expression-${index * 8 + offset + 1}`)
      }));
      boboExpressions.show(items, index);
      wall.replaceChildren(...items.map(({title: label, image}) => {
        const tile = document.createElement('div');
        tile.className = 'works-bobo-artwork';
        const img = new Image(320, 264);
        img.alt = '';
        img.loading = 'lazy';
        img.src = image;
        tile.append(img);
        const caption = document.createElement('span');
        caption.textContent = label;
        tile.append(caption);
        return tile;
      }));
    }
    expressionSection.append(filters, drift, wall);
    showGroup(0);

    const posterSection = chapters[5][1];
    const posters = ['李小啵', '啵啵的世界', '啵的绿皮书', '超级啵啵', '功夫啵啵', '啵啵的救赎', '啵啵教父', '阿啵正传', '奥本海啵', '泰坦啵克号', '啵啵侠', '啵啵队长'];
    const deck = document.createElement('div');
    deck.className = 'works-bobo-poster-stage';
    posterSection.append(deck);
    unmountBoboPosters = window.mountPortfolioBoboPosters(deck, posters.map((title, index) => ({
      image: imageFile(`poster-${index + 1}`) + '?v=hd',
      alt: `《${title}》`
    })));

    layout.append(responsiveChapterSidebar(chapters, '茶啵啵章节目录'), content);
    return layout;
  }

  function responsiveChapterSidebar(chapters, label, mobileGap = 16) {
    let visibleChapter = -1;
    const mobileDirectory = matchMedia('(max-width: 999px)');
    const nav = tongpinSidebar(chapters, {
      label,
      scrollOffset: element => mobileDirectory.matches ? element.offsetHeight + mobileGap : 32,
      onCurrent: index => {
        if (!mobileDirectory.matches || index === visibleChapter) return;
        visibleChapter = index;
        const current = nav.querySelector('[aria-current]');
        if (!current) return;
        const item = current.getBoundingClientRect();
        const bar = nav.getBoundingClientRect();
        if (item.left < bar.left || item.right > bar.right) {
          nav.scrollLeft += (item.left + item.right - bar.left - bar.right) / 2;
        }
      }
    });
    return nav;
  }

  function dataVisualizationShowcase() {
    const section = document.createElement('section');
    section.className = 'works-data-showcase';
    const heading = document.createElement('h3');
    heading.textContent = '大屏作品展示';
    const panels = document.createElement('div');
    panels.className = 'works-data-accordion';
    const labels = ['银行 AI 运营场景', '风电运营场景', '数字城市运营场景', '数字城市大屏',
      '医疗数据大屏', '银行 AI 运营大屏', '风电智慧运营大屏', '工业监控智慧园区', '智慧园区大屏'];
    const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    let active;
    function activate(panel) {
      if (active === panel) return;
      active?.setAttribute('aria-pressed', 'false');
      panel.setAttribute('aria-pressed', 'true');
      active = panel;
    }
    labels.forEach((label, index) => {
      const panel = document.createElement('button');
      panel.type = 'button';
      panel.setAttribute('aria-pressed', 'false');
      panel.setAttribute('aria-label', label);
      const number = String(index + 1).padStart(2, '0');
      const img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = `assets/works/data-visualization/showcase-${number}.webp`;
      const caption = document.createElement('span');
      const name = document.createElement('span');
      name.textContent = label;
      caption.append(number, name);
      panel.append(img, caption);
      panel.onclick = () => activate(panel);
      // Hover follows actual mouse movement, so resizing panels under a
      // stationary pointer during wheel navigation cannot change the selection.
      panel.onpointermove = event => {
        if (desktop.matches && event.pointerType === 'mouse') activate(panel);
      };
      panels.append(panel);
    });
    activate(panels.firstElementChild);
    let wheelDistance = 0;
    let lastWheel = -Infinity;
    let lastSwitch = -Infinity;
    panels.addEventListener('wheel', event => {
      if (!desktop.matches || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const now = performance.now();
      if (now - lastWheel > 180) wheelDistance = 0;
      lastWheel = now;
      const next = event.deltaY > 0 ? active.nextElementSibling : active.previousElementSibling;
      if (!next) {
        wheelDistance = 0;
        return;
      }
      event.preventDefault();
      if (now - lastSwitch < 250) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? panels.clientHeight : 1);
      if (Math.sign(wheelDistance) !== Math.sign(delta)) wheelDistance = 0;
      wheelDistance += delta;
      if (Math.abs(wheelDistance) < 32) return;
      activate(next);
      lastSwitch = now;
      wheelDistance = 0;
    }, {passive: false});
    section.append(heading, panels);
    return section;
  }
  function dataVisualizationDetails(coverImage) {
    const layout = document.createElement('div');
    layout.className = 'works-data-layout';
    const content = document.createElement('div');
    content.className = 'works-data-details';
    const chapters = [];
    function appendBoard(label, img) {
      const board = document.createElement('div');
      board.append(img);
      content.append(board);
      chapters.push([label, board]);
    }
    coverImage.width = 1600;
    coverImage.height = 900;
    appendBoard('项目封面', coverImage);
    for (const [file, label, height] of [
      ['design-system', '设计规范', 1543],
      ['page-layout', '页面布局', 1238],
      ['interface', '界面展示', 1238],
      ['components', '组件库', 1961],
      ['charts', '图表库', 1643],
    ]) {
      const img = new Image(2200, height);
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = `数据可视化 · ${label}`;
      img.src = `assets/works/data-visualization/${file}.webp`;
      appendBoard(label, img);
    }
    const showcase = dataVisualizationShowcase();
    content.append(showcase);
    chapters.push(['大屏作品展示', showcase]);
    layout.append(tongpinSidebar(chapters, {label: '数据可视化章节目录'}), content);
    return layout;
  }
  function serviceflowScreens() {
    const section = document.createElement('section');
    section.className = 'works-case-section works-web-screens';
    const heading = document.createElement('h3');
    heading.textContent = '网站实拍';
    const intro = document.createElement('p');
    intro.textContent = '从车主服务到门店运营，滚动浏览各个页面。点击截图可查看完整大图。';
    section.append(heading, intro);
    const groups = [
      ['ServiceFlow · 车主端', 'serviceflow-cover', [
        ['vehicle', '我的爱车'],
        ['archive', '车辆档案'],
        ['booking-services', '预约服务'],
        ['booking', '预约服务 · 选择日期与时间'],
        ['progress', '服务进度'],
        ['history', '服务记录'],
        ['service-center', '服务中心'],
      ]],
      ['AutoScope · 运营端', 'autoscope-cover', [
        ['overview', '运营总览'],
        ['conversion', '预约转化分析'],
        ['fulfillment', '服务履约分析'],
      ]],
    ];
    for (const [label, cover, pages] of groups) {
      const group = document.createElement('h4');
      group.textContent = label;
      const coverImage = new Image(3840, 3200);
      coverImage.src = `assets/works/serviceflow/${cover}.jpg?v=2`;
      coverImage.alt = `${label}项目封面`;
      coverImage.loading = 'lazy';
      const stack = document.createElement('ol');
      stack.className = 'works-web-stack';
      stack.style.setProperty('--stack-count', pages.length);
      pages.forEach(([file, title], index) => {
        const item = document.createElement('li');
        item.style.setProperty('--layer', index);
        const link = document.createElement('a');
        const thumbnail = `assets/works/serviceflow/${file}.png`;
        link.href = `assets/works/serviceflow/hd/${file}.png`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openImagePreview(link, title, `${label} · ${title}`);
        });
        const caption = document.createElement('span');
        caption.textContent = `${String(index + 1).padStart(2, '0')}  ${title} ↗`;
        const img = new Image();
        img.sizes = '(max-width: 1100px) 90vw, 1000px';
        img.srcset = `${thumbnail} 1440w, ${link.href} 4320w`;
        img.src = thumbnail;
        img.alt = '';
        img.loading = 'lazy';
        link.append(caption, img);
        item.append(link);
        stack.append(item);
      });
      section.append(group, coverImage, stack);
    }
    return section;
  }
  function update(index) {
    active = index;
    controls.querySelector('p').textContent = `${works[index][0]} · ${index + 1} / ${works.length}`;
    dialog.querySelector('[data-prev]').disabled = works.length < 2;
    dialog.querySelector('[data-next]').disabled = works.length < 2;
  }
  function step(key) {
    track.querySelector('.flex-carousel')?.dispatchEvent(new KeyboardEvent('keydown', {key, cancelable:true}));
  }
  for (const [direction, key] of [['prev', 'ArrowLeft'], ['next', 'ArrowRight']]) {
    const button = controls.querySelector(`[data-${direction}]`);
    button.onclick = () => step(key);
    button.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const {left, top, width, height} = button.getBoundingClientRect();
      const x = event.clientX - left - width / 2;
      const y = event.clientY - top - height / 2;
      const proximity = Math.max(Math.abs(x) / (width / 2), Math.abs(y) / (height / 2));
      const angle = Math.atan2(y, x) * 180 / Math.PI + 90;
      button.style.setProperty('--edge-opacity', Math.max(0, (proximity - .3) / .7) * .85);
      button.style.setProperty('--edge-angle', `${angle}deg`);
    });
  }
  function closeGallery() {
    dialog.close();
    stopProjectMotion();
    unmount?.();
    unmount = undefined;
  }
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    if (detail.hidden) closeGallery();
    else detailButton.click();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && event.repeat) event.preventDefault();
    event.stopPropagation();
  });
  // Keep gallery gestures from triggering the homepage scene transitions.
  for (const type of ['wheel', 'touchmove']) {
    dialog.addEventListener(type, event => event.stopPropagation(), { passive: true });
  }
  dialog.querySelector('[data-close]').onclick = closeGallery;

  function h5Gallery() {
    const gallery = document.createElement('div');
    gallery.className = 'works-h5-gallery';
    const projects = [
      ['hong-kong', '天津—香港旅行攻略'],
      ['nanjing', '南京三日游'],
      ['yunnan', '云南·西双版纳旅行打卡']
    ];
    for (const [slug, name] of projects) {
      const viewport = document.createElement('div');
      viewport.className = 'works-h5-scroll';
      viewport.tabIndex = 0;
      viewport.setAttribute('role', 'region');
      viewport.setAttribute('aria-label', name);
      const image = new Image();
      image.alt = `${name}活动长图`;
      image.loading = 'lazy';
      image.src = `assets/works/h5/${slug}.webp`;
      viewport.append(image);
      gallery.append(viewport);
    }
    return gallery;
  }

  function openGraphicWork(index) {
    const { title: name, sections } = graphicWorks[index];
    active = index;
    title.textContent = name;
    const chapterSections = (sections ?? []).map(([label, pages], sectionIndex) => {
      const section = document.createElement('section');
      const heading = document.createElement('h3');
      heading.textContent = label;
      if (label === '商业海报') {
        const gallery = document.createElement('div');
        gallery.className = 'works-commercial-gallery';
        section.append(heading, gallery);
        return section;
      }
      if (label === '电商主图' || label === '电商详情页') {
        const stacks = document.createElement('div');
        stacks.className = label === '电商主图' ? 'works-ecommerce-stacks' : 'works-ecommerce-details';
        section.append(heading, stacks);
        return section;
      }
      if (label === 'H5 活动页') {
        section.append(heading, h5Gallery());
        return section;
      }
      section.append(heading, ...pages.map((page, imageIndex) => {
        const image = workImage(page, `${label} · 作品图 ${imageIndex + 1}`, sectionIndex === 0 && imageIndex === 0);
        if (graphicBoardHeights[page]) {
          image.width = 3840;
          image.height = graphicBoardHeights[page];
        }
        return image;
      }));
      return section;
    });
    detail.replaceChildren();
    if (sections) {
      const layout = document.createElement('div');
      layout.className = 'works-poster-layout';
      const content = document.createElement('div');
      content.className = 'works-poster-content';
      content.append(...chapterSections);
      const chapters = sections.map(([label], index) => [label, chapterSections[index]]);
      layout.append(responsiveChapterSidebar(chapters, '海报设计章节目录', 24), content);
      detail.append(layout);
    }
    graphicHome.hidden = true;
    detail.hidden = detailButton.hidden = false;
    detailButton.textContent = '返回作品列表';
    dialog.scrollTop = 0;
    detailButton.focus({ preventScroll: true });
    const commercialGallery = detail.querySelector('.works-commercial-gallery');
    if (commercialGallery) unmountCommercialPosters = window.mountPortfolioCommercialPosters(commercialGallery);
    const ecommerceStacks = detail.querySelector('.works-ecommerce-stacks');
    if (ecommerceStacks) unmountEcommerceStacks = window.mountPortfolioEcommerceStacks(ecommerceStacks);
    const ecommerceDetails = detail.querySelector('.works-ecommerce-details');
    if (ecommerceDetails) unmountEcommerceDetails = window.mountPortfolioEcommerceStacks(ecommerceDetails, openImagePreview);
    if (!sections) unmountTypography = window.mountPortfolioTypography(detail, dialog, openImagePreview);
    updateTongpinChapter();
  }

  detailButton.onclick = () => {
    if (category === 'graphic') {
      stopProjectMotion();
      detail.hidden = detailButton.hidden = true;
      detail.replaceChildren();
      graphicHome.hidden = false;
      title.textContent = headings.graphic;
      dialog.scrollTop = 0;
      graphicHome.querySelector(`[data-cover-index="${active}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (!detail.hidden) {
      stopProjectMotion();
      detail.hidden = true;
      ipHome.hidden = category !== 'ip';
      track.hidden = controls.hidden = !ipHome.hidden;
      title.textContent = headings[category];
      detailButton.textContent = '查看作品';
      if (category === 'ip') ipHome.append(detailButton);
      dialog.scrollTop = 0;
      detailButton.focus({ preventScroll: true });
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
      return;
    }
    const [name, cover, pages = []] = works[active];
    title.textContent = name;
    ipHome.hidden = track.hidden = controls.hidden = true;
    detail.hidden = false;
    detailButton.textContent = '返回作品列表';
    if (category === 'ip') {
      detail.before(detailButton);
      detailButton.focus();
    }
    const coverImage = category === 'ip' ? null : workImage(cover, `${name} · 封面`, true);
    if (category === 'ip') {
      detail.replaceChildren(boboDetails());
    } else if (cover === 'cover') {
      const chapters = [
        ['项目背景', tongpinSection('项目背景与我的职责',
          '同频是一款面向游戏玩家的语音社交 App，围绕找队友、组队开黑和好友互动展开。我负责用户调研、竞品分析、信息架构和原型设计，并完成高保真界面、视觉规范及功能图标。',
          [['research', '同频用户调研']])],
        ['调研与架构', tongpinSection('用户旅程与信息架构',
          '从找队友、组队到语音协作，梳理各阶段的体验问题，再落实到产品导航与页面层级。',
          [['journey', '用户旅程'], ['strategy', '同频设计策略'], ['architecture', '信息架构与四大导航']])],
        ['视觉规范', tongpinSection('视觉方向与规范',
          '用蓝青渐变、宝石切面和声波建立品牌识别，再把这套语言延伸到字体、图标和交互状态。',
          [['visual', '视觉方向与色彩'], ['logo', '品牌标识演化与应用'], ['type-icons', '字体与图标规范']])],
        ['发现与游戏圈', tongpinSection('发现与游戏圈', '从首页推荐进入感兴趣的游戏圈。', [['discover', '发现与游戏圈']])],
        ['组队匹配', tongpinSection('组队匹配', '设置队友偏好，发起匹配或邀请好友。', [['match', '组队与匹配']])],
        ['语音开黑', tongpinSection('语音开黑', '进入语音房后，可以开麦并与队友实时交流。', [['voice', '语音开黑']])],
        ['好友与消息', tongpinSection('好友与消息', '通过私聊和组队邀请，继续联系上一局的队友。', [['friends', '好友与消息']])],
        ['个人主页', tongpinSection('个人主页与会员中心', '玩家可以整理个人资料，查看会员权益。', [['profile', '个人主页与会员中心']])],
        ['界面全景', tongpinSection('界面全景',
          '集中展示主要页面，以及邀请、匹配失败、语音中断和支付反馈等状态。',
          [['ui-overview', '核心界面全景'], ['ui-states', '扩展界面与异常状态']])],
      ];
      const layout = document.createElement('div');
      layout.className = 'works-tongpin-layout';
      const content = document.createElement('div');
      content.className = 'works-tongpin-content';
      content.append(coverImage, ...chapters.map(([, section]) => section));
      layout.append(tongpinSidebar(chapters), content);
      detail.replaceChildren(layout);
    } else if (cover === 52) {
      detail.replaceChildren(dataVisualizationDetails(coverImage));
    } else {
      detail.replaceChildren(coverImage, ...pages.map((page, index) => workImage(page, `${name} · 作品图 ${index + 1}`)));
      if (cover === 62) detail.append(serviceflowScreens());
      if (cover === 35) detail.replaceChildren(coffeeScreens(coverImage));
      if (cover === 80) {
        const iconContainer = document.createElement('div');
        detail.append(iconContainer);
        unmountIcons = window.mountPortfolioIconGrid(iconContainer, iconWorks);
      }
    }
    dialog.scrollTop = 0;
    observeProjectImages(detail.querySelectorAll('.works-tongpin-content img, .works-coffee-page img'));
    updateTongpinChapter();
  };
  window.openPortfolioWorks = key => {
    category = key;
    works = collections[key];
    title.textContent = headings[key];
    detail.hidden = true;
    detail.replaceChildren();
    ipHome.hidden = key !== 'ip';
    graphicHome.hidden = key !== 'graphic';
    track.hidden = controls.hidden = key !== 'ui';
    detailButton.hidden = key === 'graphic';
    detailButton.textContent = '查看作品';
    if (key === 'ip') ipHome.append(detailButton);
    else detail.before(detailButton);
    dialog.showModal();
    dialog.scrollTop = 0;
    if (key === 'graphic') {
      unmount = window.mountPortfolioGraphicHome(graphicHome, graphicWorks, openGraphicWork);
      return;
    }
    update(0);
    if (key === 'ip') {
      unmount = window.mountPortfolioBoboCard(boboCard);
      return;
    }
    unmount = window.mountPortfolioCarousel(track, works.map(([title, page]) => ({
      title, alt: title, src: src(page)
    })), update);
  };
})();
