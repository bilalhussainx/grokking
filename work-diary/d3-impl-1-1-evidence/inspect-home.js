(() => {
  const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  const targets = [...document.querySelectorAll('.daybreak a,.daybreak button,.daybreak input,.daybreak select,.daybreak summary')].filter(visible);
  const fonts = performance.getEntriesByType('resource').filter(r=>/\.(woff2?|ttf)(\?|$)/.test(r.name)).map(r=>({url:r.name,encodedBytes:r.encodedBodySize,transferBytes:r.transferSize}));
  return JSON.stringify({url:location.href,width:innerWidth,documentWidth:document.documentElement.scrollWidth,
    overflowing:[...document.querySelectorAll('.daybreak *')].filter(visible).filter(el=>{const r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1;}).map(el=>({tag:el.tagName,text:el.textContent.slice(0,70)})),
    smallTargets:targets.filter(el=>{const r=el.getBoundingClientRect();return r.width<44||r.height<44;}).map(el=>({text:el.textContent,rect:el.getBoundingClientRect().toJSON()})),
    language:document.querySelector('.db-hero-intro')?.lang,direction:document.querySelector('.db-quick-check')?.dir,
    fontFaces:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,status:f.status})),fonts,
    preloads:[...document.querySelectorAll('link[rel=preload][as=font]')].map(el=>el.href),
    footerLinks:[...document.querySelectorAll('footer nav a')].map(a=>({name:a.textContent,href:a.getAttribute('href')})),
    brandImages:[...document.querySelectorAll('.db-brand img')].map(el=>({src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>0})),
  },null,2);
})();
