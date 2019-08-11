import { ImageDisplayer } from './image-utils';
import { allocArray } from './as-utils';

export async function invert8bit(imageData, module) {
  let pixelsRef = allocArray(
    module,
    new Uint8ClampedArray(imageData.data.buffer)
  );
  module.invertImage8(pixelsRef);

  let newPixels = new Uint8ClampedArray(module.__getArray(pixelsRef));
  let imageDisplayer = new ImageDisplayer(
    newPixels,
    imageData.width,
    imageData.height
  );
  await imageDisplayer.drawIntoCanvas();
  module.__release(pixelsRef);
}

export async function invert32bit(imageData, module) {
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
}
