import loader from 'assemblyscript/lib/loader';
import './style.css';
import { ImageLoader } from './image-utils';
import { invert8bit, invert32bit } from './examples';

const MODULE_PATH = 'wasm/untouched.wasm';
const IMAGE_URL = 'public/images/silly.jpg';

(async function run() {
  let imports = {};
  let module = await loader.instantiateStreaming(fetch(MODULE_PATH), imports);
  let imgLoader = new ImageLoader(IMAGE_URL, true);
  let imageData = await imgLoader.load();

  await invert32bit(imageData, module);
  await invert8bit(imageData, module);
})();
