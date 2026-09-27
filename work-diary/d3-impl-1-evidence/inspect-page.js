(async () => {
  await document.fonts.ready;
  const resources = performance.getEntriesByType('resource').map(r => ({
    path: new URL(r.name).pathname, type: r.initiatorType,
    transferBytes: r.transferSize, encodedBytes: r.encodedBodySize,
    decodedBytes: r.decodedBodySize, durationMs: Math.round(r.duration),
  }));
  const daybreak = document.querySelector('.daybreak');
  const style = element => element ? {
    color: getComputedStyle(element).color,
    background: getComputedStyle(element).backgroundColor,
    font: getComputedStyle(element).fontFamily,
    fontSize: getComputedStyle(element).fontSize,
    direction: getComputedStyle(element).direction,
    outline: getComputedStyle(element).outline,
  } : null;
  const navigation = performance.getEntriesByType('navigation')[0];
  return {
    url: location.pathname, viewport: { width: innerWidth, height: innerHeight },
    documentWidth: document.documentElement.scrollWidth,
    documentHeight: document.documentElement.scrollHeight,
    navigation: navigation?.toJSON(),
    paints: performance.getEntriesByType('paint').map(p => ({ name: p.name, startTimeMs: p.startTime })),
    resources, resourceTransferBytes: resources.reduce((n, r) => n + r.transferBytes, 0),
    resourceEncodedBytes: resources.reduce((n, r) => n + r.encodedBytes, 0),
    fonts: [...document.fonts].filter(f => f.family.includes('Daybreak')).map(f => ({ family: f.family, weight: f.weight, status: f.status })),
    styles: { body: style(daybreak), heading: style(document.querySelector('h1')), selectedOption: style(document.querySelector('#next-stage option:checked')) },
    overflowing: daybreak ? [...daybreak.querySelectorAll('*')].filter(e => {
      const r = e.getBoundingClientRect();
      return r.width && (r.right > innerWidth + 1 || r.left < -1);
    }).map(e => ({ tag: e.tagName, class: e.className, text: e.textContent?.trim().slice(0, 70) })) : [],
    undersizedTargets: daybreak ? [...daybreak.querySelectorAll('a,button,input,select,summary')].filter(e => {
      const r = e.getBoundingClientRect();
      return r.width && (r.width < 44 || r.height < 44);
    }).map(e => ({ text: e.textContent?.trim().slice(0, 70), width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })) : [],
    active: { tag: document.activeElement?.tagName, id: document.activeElement?.id, text: document.activeElement?.textContent?.trim().slice(0, 100) },
  };
})()
