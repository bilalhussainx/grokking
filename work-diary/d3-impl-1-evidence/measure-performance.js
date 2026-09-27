(async () => {
  const lcp = [];
  const shifts = [];
  const lcpObserver = new PerformanceObserver(list => lcp.push(...list.getEntries().map(e => ({ startTime: e.startTime, renderTime: e.renderTime, loadTime: e.loadTime, size: e.size, tag: e.element?.tagName }))));
  const shiftObserver = new PerformanceObserver(list => shifts.push(...list.getEntries().filter(e => !e.hadRecentInput).map(e => ({ startTime: e.startTime, value: e.value }))));
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  shiftObserver.observe({ type: 'layout-shift', buffered: true });
  await new Promise(resolve => setTimeout(resolve, 250));
  lcpObserver.disconnect(); shiftObserver.disconnect();
  const nav = performance.getEntriesByType('navigation')[0];
  return {
    environment: 'Local Next development preview, unthrottled, warm navigation; not a Lighthouse score or production benchmark',
    url: location.pathname, viewport: { width: innerWidth, height: innerHeight },
    ttfbMs: nav.responseStart - nav.requestStart,
    domContentLoadedMs: nav.domContentLoadedEventEnd,
    loadMs: nav.loadEventEnd,
    paint: performance.getEntriesByType('paint').map(e => ({ name: e.name, ms: e.startTime })),
    lcpCandidates: lcp, layoutShifts: shifts,
    observedLayoutShiftSum: shifts.reduce((sum, e) => sum + e.value, 0),
    note: 'Observed shift sum is diagnostic; it is not the web-vitals session-window CLS algorithm. INP not measured.',
  };
})()
