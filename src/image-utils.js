/**
 *
 * @param {string} url
 * @return {ImageData}
 */
export async function loadImageDataFromURL(url, debug = false) {
  let canvas = document.createElement('canvas');
  let img = document.createElement('img');
  img.setAttribute('src', url);
  document.body.appendChild(img);
  document.body.appendChild(canvas);

  return new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onabort = reject;
    img.onerror = reject;
  })
    .then(() => {
      let { width, height } = img;
      canvas.width = width;
      canvas.height = height;

      document.body.appendChild(canvas);
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, width, height);
    })
    .finally(() => {
      if (!debug) {
        canvas.remove();
        img.remove();
      }
    });
}

/**
 *
 * @param {Uint8Array} pixels
 * @param {Number} width
 * @param {Number} height
 */
export function putPixelsIntoCanvas(pixels, width, height) {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  let ctx = canvas.getContext('2d');

  let imageData = new ImageData(pixels, width, height);
  ctx.putImageData(imageData, 0, 0);
}
