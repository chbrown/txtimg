var textarea = document.querySelector('textarea');
textarea.addEventListener('keyup', function (ev) {
    var txtString = localStorage['input'] = ev.target['value'];
    drawString(txtString);
});
document.addEventListener('readystatechange', function (ev) {
    if (ev.target['readyState'] === 'interactive') {
        var txtString = textarea.value = localStorage['input'] || '';
        if (txtString === '' && typeof fetch !== 'undefined') {
            fetch('https://chbrown.github.io/txtimg/index.html')
                .then(function (res) { return res.text(); })
                .then(function (text) {
                localStorage['input'] = textarea.value = text;
                drawString(text);
            })["catch"](function (reason) {
                console.error(reason);
            });
        }
        else {
            drawString(txtString);
        }
    }
});
var width = 500;
var height = 300;
var canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');
ctx['imageSmoothingEnabled'] = false;
var tabWidth = 4;
function drawString(txtString) {
    var x = 0;
    var y = 0;
    var chr;
    // Uint8ClampedArray is initialized to all 0's
    // when interpreted by ImageData, in RGBA order, that means transparent black
    var array = new Uint8ClampedArray(width * height * 4);
    for (var i = 0, l = txtString.length; i < l; i++) {
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
                var offset = ((y * width) + x) * 4;
                array[offset + 3] = chr * 2;
                x++;
            }
        }
    }
    var imageData = new ImageData(array, width, height);
    ctx.putImageData(imageData, 0, 0);
}
