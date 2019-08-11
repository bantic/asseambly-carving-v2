// The entry file of your WebAssembly module.

export const ID_Uint8Array = idof<Uint8Array>();
export const ID_Uint32Array = idof<Int32Array>();

const FULL_ALPHA = 0xff000000;

// This was a test to make sure that creating an array on th wasm side
// worked ok and it could be passed back
// NEXT Up: write the code to generate a pixel difference (left-right and top-bottom)
// for each pixel into the energy map
export function generateEnergyMap(pixels: Uint8Array): Uint8Array {
  let result = new Uint8Array(pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    result[i] = pixels[i];
  }
  return result;
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
