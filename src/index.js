import loader from 'assemblyscript/lib/loader';
import './style.css';
import { ImageLoader, ImageDisplayer } from './image-utils';
import { allocArray } from './as-utils';

const MODULE_PATH = 'wasm/untouched.wasm';
const IMAGE_URL = 'public/images/silly.jpg';

(async function run() {
  let imports = {};
  let module = await loader.instantiateStreaming(fetch(MODULE_PATH), imports);
  let imgLoader = new ImageLoader(IMAGE_URL, true);
  let imageData = await imgLoader.load();

  let pixelsRef = allocArray(module, new Uint32Array(imageData.data.buffer));
  module.invertImage32(pixelsRef);

  let newPixels = new Uint8ClampedArray(
    new Uint32Array(module.__getArray(pixelsRef)).buffer
  );
  let imageDisplayer = new ImageDisplayer(
    newPixels,
    imageData.width,
    imageData.height
  );
  await imageDisplayer.drawIntoCanvas();

  module.__release(pixelsRef);
})();
