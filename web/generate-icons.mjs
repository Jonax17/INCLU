import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'public', 'icons');
mkdirSync(outDir, { recursive: true });

// Extract RGBA pixel data from the SVG programmatically (simple geometric renderer).
const W = 512;
const H = 512;

// Colors
const bg = [26, 35, 126, 255];      // #1A237E
const white = [255, 255, 255, 255];  // #FFFFFF
const teal = [3, 218, 198, 255];     // #03DAC6

function px(x, y, color) {
  return color;
}

// Render the same logo geometry scaled to 512x512 (108 viewBox).
function render() {
  const data = Buffer.alloc(W * H * 4);
  const inHead = (x, y) => {
    // head circle centered (54,36) r10 -> scale ~4.74 (512/108)
    const s = W / 108;
    const cx = 54 * s, cy = 36 * s, r = 10 * s;
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };
  const inBody = (x, y) => {
    const s = W / 108;
    return x >= 44 * s && x <= 64 * s && y >= 58 * s && y <= 87 * s;
  };
  const inArmL = (x, y) => {
    const s = W / 108;
    // approx left arm triangle
    const x1 = 37 * s, y1 = 62 * s, x2 = 44 * s, y2 = 66 * s;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2 && (x1 <= x && x <= x2);
  };
  const inArmR = (x, y) => {
    const s = W / 108;
    const x1 = 64 * s, y1 = 62 * s, x2 = 71 * s, y2 = 66 * s;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      let c = bg;
      if (inHead(x, y)) c = white;
      else if (inBody(x, y)) c = white;
      else if (inArmL(x, y)) c = white;
      else if (inArmR(x, y)) c = white;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = c[3];
    }
  }
  return data;
}

// Create 8-bit RGBA PNG
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function pngEncode(rgba, w, h) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const rgba = render();
const sizes = [
  [192, 192, 'icon-192.png'],
  [512, 512, 'icon-512.png']
];

for (const [w, h, name] of sizes) {
  // rescale the 512 render down to target size
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = Math.floor((y / h) * H);
    for (let x = 0; x < w; x++) {
      const sx = Math.floor((x / w) * W);
      const src = (sy * W + sx) * 4;
      const dst = (y * w + x) * 4;
      out[dst] = rgba[src];
      out[dst + 1] = rgba[src + 1];
      out[dst + 2] = rgba[src + 2];
      out[dst + 3] = rgba[src + 3];
    }
  }
  writeFileSync(join(outDir, name), pngEncode(out, w, h));
  console.log('generated', name);
}

// Maskable: pad background so content is in safe zone
const mSize = 512;
const mask = Buffer.alloc(mSize * mSize * 4, 0);
for (let y = 0; y < mSize; y++) {
  for (let x = 0; x < mSize; x++) {
    const i = (y * mSize + x) * 4;
    // Entire background = bg
    mask[i] = bg[0]; mask[i + 1] = bg[1]; mask[i + 2] = bg[2]; mask[i + 3] = 255;
  }
}
// Draw content scaled to 70% centered (safe zone)
const s = (mSize / 108) * 0.7;
const ox = mSize / 2 - (54 * s);
const oy = mSize / 2 - (54 * s);
function maskHead(x, y) {
  const cx = 54 * s + ox, cy = 36 * s + oy, r = 10 * s;
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}
function maskBody(x, y) {
  return x >= 44 * s + ox && x <= 64 * s + ox && y >= 58 * s + oy && y <= 87 * s + oy;
}
function maskArmL(x, y) {
  return x >= 37 * s + ox && x <= 44 * s + ox && y >= 62 * s + oy && y <= 66 * s + oy;
}
function maskArmR(x, y) {
  return x >= 64 * s + ox && x <= 71 * s + ox && y >= 62 * s + oy && y <= 66 * s + oy;
}
for (let y = 0; y < mSize; y++) {
  for (let x = 0; x < mSize; x++) {
    const i = (y * mSize + x) * 4;
    let c = null;
    if (maskHead(x, y)) c = white;
    else if (maskBody(x, y)) c = white;
    else if (maskArmL(x, y)) c = white;
    else if (maskArmR(x, y)) c = white;
    if (c) { mask[i] = c[0]; mask[i + 1] = c[1]; mask[i + 2] = c[2]; mask[i + 3] = c[3]; }
  }
}
writeFileSync(join(outDir, 'icon-512-maskable.png'), pngEncode(mask, mSize, mSize));
console.log('generated icon-512-maskable.png');

// Apple touch icon 180x180
const aSize = 180;
const apple = Buffer.alloc(aSize * aSize * 4);
for (let y = 0; y < aSize; y++) {
  const sy = Math.floor((y / aSize) * H);
  for (let x = 0; x < aSize; x++) {
    const sx = Math.floor((x / aSize) * W);
    const src = (sy * W + sx) * 4;
    const dst = (y * aSize + x) * 4;
    apple[dst] = rgba[src];
    apple[dst + 1] = rgba[src + 1];
    apple[dst + 2] = rgba[src + 2];
    apple[dst + 3] = 255;
  }
}
writeFileSync(join(outDir, 'apple-touch-icon.png'), pngEncode(apple, aSize, aSize));
console.log('generated apple-touch-icon.png');
