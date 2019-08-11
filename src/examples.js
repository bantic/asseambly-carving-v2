import { ImageDisplayer } from './image-utils';
import { allocArray } from './as-utils';

export async function invert8bit(imageData, module) {
  console.time('invert8bit');
  let pixelsRef = allocArray(module, new Uint8Array(imageData.data.buffer));
  module.invertImage8(pixelsRef);

  let newPixels = new Uint8ClampedArray(
    module.__getArrayView(pixelsRef).buffer
  );
  let imageDisplayer = new ImageDisplayer(
    newPixels,
    imageData.width,
    imageData.height
  );
  await imageDisplayer.drawIntoCanvas();
  module.__release(pixelsRef);
  console.timeEnd('invert8bit');
}

export async function invert32bit(imageData, module) {
  console.time('invert32bit');
  let pixelsRef = allocArray(module, new Uint32Array(imageData.data.buffer));
  module.invertImage32(pixelsRef);

  let newPixels = new Uint8ClampedArray(
    module.__getArrayView(pixelsRef).buffer
  );
  let imageDisplayer = new ImageDisplayer(
    newPixels,
    imageData.width,
    imageData.height
  );
  await imageDisplayer.drawIntoCanvas();
  module.__release(pixelsRef);
  console.timeEnd('invert32bit');
}
