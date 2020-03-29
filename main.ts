declare function fetch(url: string): any;
const textarea = <HTMLTextAreaElement>document.querySelector('textarea');
textarea.addEventListener('keyup', ev => {
  let txtString = localStorage['input'] = ev.target['value'];
  drawString(txtString);
});

document.addEventListener('readystatechange', ev => {
  if (ev.target['readyState'] === 'interactive') {
    let txtString = textarea.value = localStorage['input'] || '';
    if (txtString === '' && typeof fetch !== 'undefined') {
      fetch('https://chbrown.github.io/txtimg/index.html')
      .then(res => res.text())
      .then(text => {
        localStorage['input'] = textarea.value = text;
        drawString(text);
      })
      .catch(reason => {
        console.error(reason);
      });
    }
    else {
      drawString(txtString);
    }
  }
});

let width = 500;
let height = 300;

const canvas = <HTMLCanvasElement>document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx['imageSmoothingEnabled'] = false;

const tabWidth = 4;

function drawString(txtString: string) {
  let x = 0;
  let y = 0;
  let chr: number;
  // Uint8ClampedArray is initialized to all 0's
  // when interpreted by ImageData, in RGBA order, that means transparent black
  let array = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, l = txtString.length; i < l; i++) {
    chr = txtString.charCodeAt(i);
    if (chr === 10) { // \n
      y++;
      x = 0;
    }
    else if (chr === 13 && txtString.charCodeAt(i + 1) === 10) { // \r\n
      y++;
      x = 0;
      i++;
    }
    else if (chr === 9) { // \t
      x += tabWidth;
    }
    else if (chr === 32) { // space
      x++;
    }
    else { // anything else gets a dark pixel
      if (x < width && y < height) {
        let offset = ((y * width) + x) * 4;
        array[offset+3] = chr * 2;
        x++;
      }
    }
  }
  let imageData = new ImageData(array, width, height);
  ctx.putImageData(imageData, 0, 0);
}
