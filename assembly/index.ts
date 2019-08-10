// The entry file of your WebAssembly module.

export const ID_UINT8_ARRAY = idof<Uint8Array>();
// export const ID_ARRAY_i32 = idof<Array<i32>>();
// export const ID_UINT8_ARRAY = idof<Uint8Array>();

export function invertImage(pixels: Uint8Array): void {
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i];
    pixels[i + 1] = 255 - pixels[i + 1];
    pixels[i + 2] = 255 - pixels[i + 2];
  }
}
