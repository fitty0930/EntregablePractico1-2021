document.addEventListener("DOMContentLoaded", function () {

    // CANVAS
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var ruta = false;
    var rubber = false;
    var brush = false;
    var loadedimg=false;
    var miimgguardada="";

    // BOTONES
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

    let btnsave = document.getElementById("saveimg");
    btnsave.addEventListener('click', function () {
        saveImg();
    })

    let btnclear = document.getElementById("clear");
    btnclear.addEventListener('click', function () {
        clear();
    })

    let btnclearall=document.getElementById("clearall");
    btnclearall.addEventListener('click',()=>{
        loadedimg=false;
        clear();
    })

    let btnrubber = document.getElementById("rubber")
    btnrubber.addEventListener('click', () => {
        rubber = true;
        canvas.addEventListener('mousemove', doRubber)
        canvas.addEventListener('mousedown', () => {
            ruta = true;
            context.beginPath();
            context.moveTo(x, y)
            canvas.addEventListener('mousemove', doRubber)
        })
        canvas.addEventListener('mouseup', () => { ruta = false; rubber=false; })

    })

    let btnline = document.getElementById("line")
    btnline.addEventListener('click', () => {
        brush=false;
        draw();
    })

    let btnbrush = document.getElementById("brush")
    btnbrush.addEventListener('click', () => {
        brush=true;
        
    })
    
    let openimg=document.getElementById("openimg")
    openimg.addEventListener('click',()=>{
        document.getElementById("inputimg").click();
    })

    let inputimg= document.getElementById("inputimg");
    inputimg.addEventListener('change',()=>{mostrarImagenCargada()})

    function draw(){
        canvas.addEventListener('mousemove', drawPaint)
        canvas.addEventListener('mousedown', () => {
            ruta = true;
            context.beginPath();
            context.moveTo(x, y)
            canvas.addEventListener('mousemove', drawPaint)
        })
        canvas.addEventListener('mouseup', () => { ruta = false })
    }

    
    function drawPaint(event) {
        x = event.clientX - canvas.offsetLeft;
        y = event.clientY - canvas.offsetTop;
        
        if (ruta == true && !rubber) {
            context.lineTo(x, y);
            brush ? context.lineWidth = 20 : context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();
        }
    }

    function doRubber(event) {
        x = event.clientX - canvas.offsetLeft;
        y = event.clientY - canvas.offsetTop;
        if (ruta == true && rubber) {
            context.lineTo(x, y);
            context.strokeStyle = 'white';
            context.lineWidth = 50;
            context.stroke();
        }
    }



    function clear() {  
        context.clearRect(0, 0, canvas.width, canvas.height);
        if(loadedimg){loadPicture()}
    }

    // MANEJO DE IMAGENES

    function mostrarImagenCargada(){
        var archivo = document.getElementById("inputimg").files[0];
        var reader = new FileReader();
        if (archivo) {
          reader.readAsDataURL(archivo );
          reader.onloadend = function () {
            miimgguardada=reader.result;
            loadPicture(reader.result);
          }
        }
    }

    function loadPicture(source) {
        var imageObj = new Image();
        source? imageObj.src = source : imageObj.src=miimgguardada;
        loadedimg=true;
        if (imageObj) {
            imageObj.onload = function () { // usamos onload porque la carga de la img  puede tardar 
                // es async 
                context.drawImage(imageObj, 0, 0);

            }
        }

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


    // FILTROS
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




    // loadPicture();


})