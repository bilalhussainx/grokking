// Exact approved emblem, resized only. No generated replacement artwork.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
(async () => {
  const source = path.join(root, 'docs/brand/kairos-icon-512.png');
  const out = path.join(root, 'public/icons');
  await fs.mkdir(out, {recursive:true});
  const specs = [['kairos-192.png',192],['kairos-512.png',512],['apple-touch-icon.png',180],['kairos-maskable-512.png',512]];
  const records = [];
  for (const [file,size] of specs) {
    // Entire source square fits in the central 80%-diameter safe circle:
    // 288 * sqrt(2) < 512 * .8. No artwork is cropped by a mask.
    const image = file.includes('maskable')
      ? sharp({create:{width:512,height:512,channels:3,background:'#FFFFFF'}}).composite([{input:await sharp(source).resize(288,288).png().toBuffer(),gravity:'centre'}])
      : sharp(source).resize(size,size);
    const data = await image.flatten({background:'#FFFFFF'}).png({compressionLevel:9}).toBuffer();
    await fs.writeFile(path.join(out,file),data);
    records.push({file:'public/icons/'+file,width:size,height:size,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
  }
  await fs.writeFile(path.join(root,'work-diary/d3-impl-1-1-evidence/icons.json'),JSON.stringify({source:'docs/brand/kairos-icon-512.png',theme_color:'#FFF7EE',background_color:'#FFF7EE',maskableSafeSquare:288,icons:records},null,2)+'\n');
  console.log(records);
})();
