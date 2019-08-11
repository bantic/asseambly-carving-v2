export class ImageLoader {
  /**
   *
   * @param {string} imageSrc - the url
   */
  constructor(imageSrc, debug = false) {
    this.imageSrc = imageSrc;
    this.imageData = null;
    this.debug = debug;
  }

  /**
   * @return {ImageData}
   */
  async load() {
    if (!this.imageData) {
      if (typeof this.imageSrc === 'string') {
        this.imageData = await this.loadImageDataFromURL(this.imageSrc);
      }
    }
    return this.imageData;
  }

  async loadImageDataFromURL(url) {
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
        if (!this.debug) {
          canvas.remove();
          img.remove();
        }
      });
  }
}

export class ImageDisplayer {
  /**
   *
   * @param {Uint8Array} pixels
   * @param {Number} width
   * @param {Number} height
   */
  constructor(pixels, width, height) {
    this.pixels = pixels;
    this.width = width;
    this.height = height;
  }
  drawIntoCanvas() {
    let { pixels, width, height } = this;
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    let ctx = canvas.getContext('2d');

    let imageData = new ImageData(pixels, width, height);
    ctx.putImageData(imageData, 0, 0);
  }
}
