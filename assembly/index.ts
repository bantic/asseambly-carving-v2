// The entry file of your WebAssembly module.

export const ID_Uint8Array = idof<Uint8Array>();
export const ID_Uint32Array = idof<Int32Array>();

const FULL_ALPHA = 0xff000000;

export function invertImage(pixels: Uint8Array): void {
  trace('getting stuff', 1, pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i];
    pixels[i + 1] = 255 - pixels[i + 1];
    pixels[i + 2] = 255 - pixels[i + 2];
  }
}

export function invertImage32(pixels: Uint32Array): void {
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = FULL_ALPHA | (0xffffffff - pixels[i]);
  }
}
