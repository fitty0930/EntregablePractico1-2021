document.addEventListener("DOMContentLoaded", function () {

    // CANVAS
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    var seleccionado=document.getElementById("herramienta");
    var alerta= document.getElementById("alerta");
    var ruta = false;
    var rubber = false;
    var brush = false;
    var loadedimg = false;
    var miimgguardada = "";

    // BOTONES DE LA BARRA DE HERRAMIENTAS
    let btnsave = document.getElementById("saveimg");
    btnsave.addEventListener('click', function () {
        saveImg();
    })

    let btnclear = document.getElementById("clear");
    btnclear.addEventListener('click', function () {
        clear();
    })

    let btnclearall = document.getElementById("clearall");
    btnclearall.addEventListener('click', () => {
        loadedimg = false;
        clear();
    })

    let btnrubber = document.getElementById("rubber")
    btnrubber.addEventListener('click', () => {
        seleccionado.innerHTML="Goma";
        alerta.classList.remove('ocultar');
        rubber = true;
        canvas.addEventListener('mousemove', doRubber)
        canvas.addEventListener('mousedown', (event) => {
            ruta = true;
            context.beginPath();
            context.moveTo(event.offsetX, event.offsetY)
            canvas.addEventListener('mousemove', doRubber)
        })
        canvas.addEventListener('mouseup', () => { ruta = false; })
        canvas.addEventListener('mouseleave', () => {
            ruta=false;
        });

    })

    let btnline = document.getElementById("line")
    btnline.addEventListener('click', () => {
        seleccionado.innerHTML="Lapiz";
        alerta.classList.remove('ocultar');
        brush = false;
        rubber = false;
        draw();
    })

    let btnbrush = document.getElementById("brush")
    btnbrush.addEventListener('click', () => {
        seleccionado.innerHTML="Pincel";
        alerta.classList.remove('ocultar');
        brush = true;
        rubber = false;
        draw()
    })

    let openimg = document.getElementById("openimg")
    openimg.addEventListener('click', () => {
        document.getElementById("inputimg").click();
    })

    let inputimg = document.getElementById("inputimg");
    inputimg.addEventListener('change', () => { mostrarImagenCargada() })

    let btnfilters = document.getElementById("filters");
    btnfilters.addEventListener('click', () => {
        if (loadedimg) { document.getElementById("filtersbar").classList.toggle('ocultar') }
    })

    // BOTONES DE FILTROS
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

    let btnbinarization = document.getElementById("binarization");
    btnbinarization.addEventListener('click', function () {
        binarization();
    })

    let btnblur = document.getElementById("blur")
    btnblur.addEventListener('click', () => {
        blur();
    })


    // FUNCIONES DEL PAINT

    function draw() {
        canvas.addEventListener('mousemove', (event)=>{ drawPaint(event)})
        canvas.addEventListener('mousedown', (event) => {
            ruta = true;
            context.beginPath();
            context.moveTo(event.offsetX, event.offsetY);
        })
        canvas.addEventListener('mouseup', () => { ruta = false })
        canvas.addEventListener('mouseleave', () => {
            ruta=false;
        });
    }


    function drawPaint(event){
        x = event.offsetX;
        y = event.offsetY;

        if (ruta == true && !rubber) {
            context.lineTo(x, y);
            brush ? context.lineWidth = 20 : context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();

        }
    }

    function doRubber(event) {
        x = event.offsetX;
        y = event.offsetY;
        
        if (ruta == true && rubber) {
            context.lineTo(x, y);
            context.strokeStyle = 'white';
            context.lineWidth = 50;
            context.stroke();
        }
    }



    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (loadedimg) { loadPicture() }
    }

    // MANEJO DE IMAGENES

    function mostrarImagenCargada() {
        var archivo = document.getElementById("inputimg").files[0];
        var reader = new FileReader();
        if (archivo) {
            reader.readAsDataURL(archivo);
            reader.onloadend = function () {
                miimgguardada = reader.result;
                loadPicture(reader.result);
            }
        }
    }

    function loadPicture(source) {
        loadedimg = false;
        clear();
        var imageObj = new Image();
        source ? imageObj.src = source : imageObj.src = miimgguardada;
        loadedimg = true;
        if (imageObj) {
            imageObj.onload = function () { // usamos onload porque la carga de la img  puede tardar 
                // es async 
                let scale = Math.min(canvas.width / imageObj.width, canvas.height / imageObj.height);
                let x = (canvas.width / 2) - (imageObj.width / 2) * scale;
                let y = (canvas.height / 2) - (imageObj.height / 2) * scale;
                context.drawImage(imageObj, x, y, imageObj.width * scale, imageObj.height * scale);
                context.drawImage(imageObj, x, y, imageObj.width * scale, imageObj.height * scale);
                imageData = context.getImageData(0, 0, imageObj.width, imageObj.height);
                context.putImageData(imageData, 0, 0);

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

    function binarization() {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var numPixels = imageData.width * imageData.height;
        let threeshold = 180;

        for (var i = 0; i < numPixels; i++) {
            var r = pixels[i * 4];
            var g = pixels[i * 4 + 1];
            var b = pixels[i * 4 + 2];

            r = g = b = r > threeshold ? 255 : 0

            pixels[i * 4] = r;
            pixels[i * 4 + 1] = g;
            pixels[i * 4 + 2] = b;
        }

        context.putImageData(imageData, 0, 0);
    }

    function blur() {

        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);


        const matriz = [
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9]
        ];

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {

            }
        }
    }



})