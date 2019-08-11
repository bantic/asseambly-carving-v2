import loader from 'assemblyscript/lib/loader';
import { ImageLoader, ImageDisplayer } from './image-utils';

const MODULE_PATH = 'wasm/untouched.wasm';
const IMAGE_URL = 'public/images/silly.jpg';

(async function run() {
  let imports = {};
  let module = await loader.instantiateStreaming(fetch(MODULE_PATH), imports);
  let imgLoader = new ImageLoader(IMAGE_URL, true);
  let imageData = await imgLoader.load();

  let pixelsRef = module.__retain(
    module.__allocArray(module.ID_UINT8_ARRAY, imageData.data)
  );

  module.invertImage(pixelsRef);

  let newPixels = new Uint8ClampedArray(module.__getArray(pixelsRef));
  let imageDisplayer = new ImageDisplayer(
    newPixels,
    imageData.width,
    imageData.height
  );
  await imageDisplayer.drawIntoCanvas();
})();
