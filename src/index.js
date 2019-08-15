import loader from 'assemblyscript/lib/loader';
import './style.css';
import { ImageLoader, ImageDisplayer } from './image-utils';
import { invert8bit, invert32bit } from './examples';
import { allocArray } from './as-utils';

const MODULE_PATH = 'wasm/untouched.wasm';
const IMAGE_URL = 'public/images/silly.jpg';

(async function run() {
  let imports = {};
  let module = await loader.instantiateStreaming(fetch(MODULE_PATH), imports);
  let imgLoader = new ImageLoader(IMAGE_URL, true);
  let imageData = await imgLoader.load();

  let inputPtr = allocArray(module, imageData.data);
  let outputPtr = module.calculateEnergyMap(
    inputPtr,
    imageData.width,
    imageData.height
  );

  let energyMap = module.__getArray(outputPtr); // Uint32Array
  // normalizeEnergyMap(energyMap);
  fullAlphaEnergyMap(energyMap);
  let energyMapU8 = new Uint8ClampedArray(Uint32Array.from(energyMap).buffer);

  let displayer = new ImageDisplayer(
    energyMapU8,
    imageData.width,
    imageData.height
  );
  displayer.drawIntoCanvas();

  // await invert32bit(imageData, module);
  // await invert8bit(imageData, module);
})();

/**
 *
 * @param {Uint32Array} energyMap
 */
function normalizeEnergyMap(energyMap) {
  const FULL_ALPHA = 0xff000000;
  const MAX_RGB = 0xffffff;
  const FULL_RGBA = FULL_ALPHA | MAX_RGB;

  let max = 0;
  for (let i = 0; i < energyMap.length; i++) {
    let energy = energyMap[i];
    if (energy > max) {
      max = energy;
    }
  }

  for (let i = 0; i < energyMap.length; i++) {
    let energy = energyMap[i] / max;
    energyMap[i] = FULL_ALPHA | (energy * MAX_RGB);
    // let normalizedValue = (rgbaValue / max) * FULL_RGBA;
    // energyMap[i] = normalizedValue;
  }
}

function fullAlphaEnergyMap(energyMap) {
  const FULL_ALPHA = 0xff000000;
  for (let i = 0; i < energyMap.length; i++) {
    energyMap[i] = FULL_ALPHA | energyMap[i];
  }
}
