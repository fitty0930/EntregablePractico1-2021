document.addEventListener("DOMContentLoaded", function () {

    let btnbw = document.getElementById("blackwhite");
    btnbw.addEventListener('click', function () {
        blackwhite();
    })
    let btninvert = document.getElementById("invert");
    btninvert.addEventListener('click', function () {
        invert();
    })
    let btnsepia = document.getElementById("sepia");
    btnsepia.addEventListener('click', function () {
        sepia();
    })
    let btnreset = document.getElementById("reset");
    btnreset.addEventListener('click', function () {
        loadPicture();
    })

    let btnsave = document.getElementById("saveimg");
    btnsave.addEventListener('click', function () {
        saveImg();
    })

    let btncontrast = document.getElementById("contrast");
    btncontrast.addEventListener('click', function () {
        let contrastvalue=document.getElementById("contrastvalue").value;
        // console.log(contrastvalue);
        contrast(contrastvalue);
    })

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');



    function loadPicture() {
        var imageObj = new Image();
        imageObj.src = 'images/dontknow.jpg';

        imageObj.onload = function () { // usamos onload porque la carga de la img  puede tardar 
            // es async 
            context.drawImage(imageObj, 0, 0);

        }
    };



    function blackwhite() {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var numPixels = imageData.width * imageData.height;

        for (var i = 0; i < numPixels; i++) {
            var r = pixels[i * 4];
            var g = pixels[i * 4 + 1];
            var b = pixels[i * 4 + 2];

            var grey = (r + g + b) / 3;

            pixels[i * 4] = grey;
            pixels[i * 4 + 1] = grey;
            pixels[i * 4 + 2] = grey;
        }

        context.putImageData(imageData, 0, 0);
    };

    function invert() {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var numPixels = imageData.width * imageData.height;

        for (var i = 0; i < numPixels; i++) {
            var r = pixels[i * 4];
            var g = pixels[i * 4 + 1];
            var b = pixels[i * 4 + 2];

            pixels[i * 4] = 255 - r;
            pixels[i * 4 + 1] = 255 - g;
            pixels[i * 4 + 2] = 255 - b;
        }

        context.putImageData(imageData, 0, 0);
    };

    function sepia() {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var numPixels = imageData.width * imageData.height;

        for (var i = 0; i < numPixels; i++) {
            var r = pixels[i * 4];
            var g = pixels[i * 4 + 1];
            var b = pixels[i * 4 + 2];

            pixels[i * 4] = 255 - r;
            pixels[i * 4 + 1] = 255 - g;
            pixels[i * 4 + 2] = 255 - b;

            pixels[i * 4] = (r * .393) + (g * .769) + (b * .189);
            pixels[i * 4 + 1] = (r * .349) + (g * .686) + (b * .168);
            pixels[i * 4 + 2] = (r * .272) + (g * .534) + (b * .131);
        }

        context.putImageData(imageData, 0, 0);
    };

    function contrast(contrast) {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height,
            factor;

        if (!contrast) { contrast = 100; }

        factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (var i = 0; i < numPixels; i++) {
            var r = pixels[i * 4];
            var g = pixels[i * 4 + 1];
            var b = pixels[i * 4 + 2];

            pixels[i * 4] = factor * (r - 128) + 128;
            pixels[i * 4 + 1] = factor * (g - 128) + 128;
            pixels[i * 4 + 2] = factor * (b - 128) + 128;
        }

        context.putImageData(imageData, 0, 0);
    };

    function saveImg() {
        var link = window.document.createElement('a'),
            url = canvas.toDataURL(),
            filename = 'mysimplepaintimage.jpg';

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    loadPicture();


})