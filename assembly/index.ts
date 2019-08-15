// The entry file of your WebAssembly module.

export const ID_Uint8Array = idof<Uint8Array>();
export const ID_Uint32Array = idof<Int32Array>();

const FULL_ALPHA = 0xff000000;
const BYTES_PER_PIXEL = 4; // r, g, b and a
const MAX_ENERGY = 255 * 255 * 4; // 255*255 per channel * 4 channels

// This was a test to make sure that creating an array on th wasm side
// worked ok and it could be passed back
// NEXT Up: write the code to generate a pixel difference (left-right and top-bottom)
// for each pixel into the energy map
export function calculateEnergyMap(
  pixels: Uint8Array,
  width: i32,
  height: i32
): Uint32Array {
  let energyMap = new Uint32Array(pixels.length / 4);
  let maxEnergy = 0;
  let energyIndex = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let energy = calculateEnergy(pixels, x, y, width, height);
      assert(energy >= 0, 'energy is >= 0');
      assert(energy <= MAX_ENERGY, 'energy is within bounds');
      if (energy > maxEnergy) {
        trace(
          'max energy exceeded at x,y,energyIndex,prevE,maxE',
          4,
          x,
          y,
          energyIndex,
          energy,
          maxEnergy
        );
        maxEnergy = energy;
      }
      energyMap[energyIndex] = energy;
      energyIndex++;
    }
  }
  return energyMap;
}

function calculateEnergy(
  pixels: Uint8Array,
  x: i32,
  y: i32,
  width: i32,
  height: i32
): i32 {
  let leftX = max(x - 1, 0);
  let leftY = y;
  let rightX = min(x + 1, width - 1);
  let rightY = y;

  let upY = max(y - 1, 0);
  let upX = x;
  let downY = min(y + 1, height - 1);
  let downX = x;

  let diff = 0;
  diff += calculateEnergyDiff(
    pixels,
    getPixelIndex(leftX, leftY, width),
    getPixelIndex(rightX, rightY, width)
  );
  diff += calculateEnergyDiff(
    pixels,
    getPixelIndex(upX, upY, width),
    getPixelIndex(downX, downY, width)
  );
  return diff;
}

function calculateEnergyDiff(
  pixels: Uint8Array,
  leftPixelIdx: i32,
  rightPixelIdx: i32
): i32 {
  let diff: i32 = 0;
  for (let i = 0; i < 4; i++) {
    let channelDiff: i32 = pixels[leftPixelIdx + i] - pixels[rightPixelIdx + i];
    assert(channelDiff >= 0, 'channelDiff is >= 0');
    assert(channelDiff <= 255, 'channelDiff is <= 255');
    diff += channelDiff * channelDiff;
  }
  return diff;
}

function getPixelIndex(x: i32, y: i32, width: i32): i32 {
  return BYTES_PER_PIXEL * (y * width + x);
}

export function invertImage8(pixels: Uint8Array): void {
  trace('invertImage8, # pixels: ', 1, pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i];
    pixels[i + 1] = 255 - pixels[i + 1];
    pixels[i + 2] = 255 - pixels[i + 2];
  }
}

export function invertImage32(pixels: Uint32Array): void {
  trace('invertImage32, # pixels: ', 1, pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = FULL_ALPHA | (0xffffffff - pixels[i]);
  }
}
