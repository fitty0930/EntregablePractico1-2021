document.addEventListener("DOMContentLoaded", function () {

    // CANVAS
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    var seleccionado = document.getElementById("herramienta");
    var alerta = document.getElementById("alerta");
    var colourchange=document.getElementById("colourchange")
    var ruta = false;
    var rubber = false;
    var brush = false;
    var drawcolour='black';
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
        seleccionado.innerHTML = "Goma";
        canvas.classList.add('rubber-cursor')
        canvas.classList.remove('pencil-cursor');
        canvas.classList.remove('brush-cursor');
        alerta.classList.remove('ocultar');
        colourchange.classList.add('ocultar')
        rubber = true;
        doRubber();

    })

    let btnline = document.getElementById("line")
    btnline.addEventListener('click', () => {
        seleccionado.innerHTML = "Lapiz";
        canvas.classList.add('pencil-cursor');
        canvas.classList.remove('rubber-cursor');
        canvas.classList.remove('brush-cursor');
        alerta.classList.remove('ocultar');
        colourchange.classList.remove('ocultar');
        brush = false;
        rubber = false;
        draw();
    })

    let btnbrush = document.getElementById("brush")
    btnbrush.addEventListener('click', () => {
        seleccionado.innerHTML = "Pincel";
        canvas.classList.add('brush-cursor')
        canvas.classList.remove('pencil-cursor');
        canvas.classList.remove('rubber-cursor');
        alerta.classList.remove('ocultar');
        colourchange.classList.remove('ocultar');
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

    let pencilcolour=document.getElementById("pencilcolour")
    pencilcolour.addEventListener('change',()=>{ 
        setColour(pencilcolour.value)})

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

    let btnsaturation = document.getElementById("saturation");
    btnsaturation.addEventListener('click', () => {
        saturation();
    })


    // FUNCIONES DEL PAINT

    function setColour(value){
        drawcolour=value;
    }

    function drawing(event){
        var rect = canvas.getBoundingClientRect();
        x=Math.round(event.clientX-rect.left)
        y=Math.round(event.clientY-rect.top)
        // e.pageX - c.offsetLeft, e.pageY - c.offsetTop

        if (ruta == true && !rubber) {
            context.lineTo(x, y);
            brush ? context.lineWidth = 20 : context.lineWidth = 1;
            context.strokeStyle = drawcolour;
            context.stroke();
        }
    }

    function draw() {
        canvas.addEventListener('mousedown', function(){
            ruta = true;
            context.beginPath();
            context.moveTo(x,y);
            canvas.addEventListener('mousemove', drawing)
        })
        canvas.addEventListener('mousemove', drawing)
        canvas.addEventListener('mouseup', function(){ ruta = false })
        canvas.addEventListener('mouseleave', function(){
            ruta = false;
        });
    }

    function erasing(event){
        var rect = canvas.getBoundingClientRect();
        x=Math.round(event.clientX-rect.left)
        y=Math.round(event.clientY-rect.top)

        if (ruta == true && rubber) {
            context.strokeStyle = 'white';
            context.lineWidth = 50;
            context.lineTo(x, y);
            context.stroke();
        }
    }


    function doRubber() {
        canvas.addEventListener('mousemove',  erasing)
        canvas.addEventListener('mousedown', function(){
            ruta = true;
            context.beginPath();
            context.moveTo(x,y)
            canvas.addEventListener('mousemove',  erasing)
        })
        canvas.addEventListener('mouseup', () => { ruta = false; })
        canvas.addEventListener('mouseleave', () => {
            ruta = false;
        });
    }



    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (loadedimg == true) { loadPicture() }
        inputimg.value="";
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
        const threeshold = 127;

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let red = imageData.data[getImgPos(x, y)];
                let green = imageData.data[getImgPos(x, y) + 1];
                let blue = imageData.data[getImgPos(x, y) + 2];

                let promedio = (red + green + blue) / 3

                promedio > threeshold ? promedio = 255 : promedio = 0

                imageData.data[getImgPos(x, y)] = promedio;
                imageData.data[getImgPos(x, y) + 1] = promedio;
                imageData.data[getImgPos(x, y) + 2] = promedio;
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    function getImgPos(x, y) {
        let index = (x + y * canvas.width) * 4;
        return index;
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
                // let red= imageData.data[getImgPos(x,y)]; 
                // let green = imageData.data[getImgPos(x,y)+1];
                // let blue= imageData.data[getImgPos(x,y)+2];

                let red = Math.floor(imageData.data[getImgPos(x - 1, y - 1)] * matriz[0][0]
                    + imageData.data[getImgPos(x, y - 1)] * matriz[0][1]
                    + imageData.data[getImgPos(x + 1, y - 1)] * matriz[0][2]
                    + imageData.data[getImgPos(x - 1, y)] * matriz[1][0]
                    + imageData.data[getImgPos(x, y)] * matriz[1][1]
                    + imageData.data[getImgPos(x + 1, y)] * matriz[1][2]
                    + imageData.data[getImgPos(x - 1, y + 1)] * matriz[2][0]
                    + imageData.data[getImgPos(x, y + 1)] * matriz[2][1]
                    + imageData.data[getImgPos(x + 1, y + 1)] * matriz[2][2])

                let green = Math.floor(Math.floor(imageData.data[getImgPos(x - 1, y - 1) + 1] * matriz[0][0]
                    + imageData.data[getImgPos(x, y - 1) + 1] * matriz[0][1]
                    + imageData.data[getImgPos(x + 1, y - 1) + 1] * matriz[0][2]
                    + imageData.data[getImgPos(x - 1, y) + 1] * matriz[1][0]
                    + imageData.data[getImgPos(x, y) + 1] * matriz[1][1]
                    + imageData.data[getImgPos(x + 1, y) + 1] * matriz[1][2]
                    + imageData.data[getImgPos(x - 1, y + 1) + 1] * matriz[2][0]
                    + imageData.data[getImgPos(x, y + 1) + 1] * matriz[2][1]
                    + imageData.data[getImgPos(x + 1, y + 1) + 1] * matriz[2][2]))

                let blue = Math.floor(imageData.data[getImgPos(x - 1, y - 1) + 2] * matriz[0][0]
                    + imageData.data[getImgPos(x, y - 1) + 2] * matriz[0][1]
                    + imageData.data[getImgPos(x + 1, y - 1) + 2] * matriz[0][2]
                    + imageData.data[getImgPos(x - 1, y) + 2] * matriz[1][0]
                    + imageData.data[getImgPos(x, y) + 2] * matriz[1][1]
                    + imageData.data[getImgPos(x + 1, y) + 2] * matriz[1][2]
                    + imageData.data[getImgPos(x - 1, y + 1) + 2] * matriz[2][0]
                    + imageData.data[getImgPos(x, y + 1) + 2] * matriz[2][1]
                    + imageData.data[getImgPos(x + 1, y + 1) + 2] * matriz[2][2])

                //set 
                imageData.data[getImgPos(x, y)] = red;
                imageData.data[getImgPos(x, y) + 1] = green;
                imageData.data[getImgPos(x, y) + 2] = blue;
            }
        }


        context.putImageData(imageData, 0, 0);


    }


    function saturation() {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // let red= imageData.data[getImgPos(x,y)]; 
        // let green = imageData.data[getImgPos(x,y)+1];
        // let blue= imageData.data[getImgPos(x,y)+2];

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let red = imageData.data[getImgPos(x, y)];
                let green = imageData.data[getImgPos(x, y) + 1];
                let blue = imageData.data[getImgPos(x, y) + 2];
                let hsl = transformToHSL(red, green, blue);
                hsl[1] += 0.5; // subo saturation
                let rgb = transformToRGB(hsl[0], hsl[1], hsl[2])


                // set 
                imageData.data[getImgPos(x, y)] = rgb[0];
                imageData.data[getImgPos(x, y) + 1] = rgb[1];
                imageData.data[getImgPos(x, y) + 2] = rgb[2];
            }
        }


        context.putImageData(imageData, 0, 0);


    }

    function transformToHSL(red, green, blue) {
        red = red / 255
        green = green / 255
        blue = blue / 255;

        let maximo = Math.max(red, green, blue)
        let minimo = Math.min(red, green, blue);
        let lightness = (maximo + minimo) / 2;
        let saturation;

        if (maximo != minimo) {
            let diff = maximo - minimo;
            if (lightness <= 0.5) { saturation = diff / (maximo + minimo) } else if (lightness > 0.5) {
                saturation = diff / (2 - maximo - minimo)
            }

            if (maximo == red) { hue = ((green - blue) / diff); }
            else if (maximo == green) { hue = ((blue - red) / diff + 2); }
            else if (maximo == blue) { hue = ((red - green) / diff + 4); }
            hue = hue * 60;

        } else { hue = saturation = 0; }

        return [hue, saturation, lightness];
    }

    function transformToRGB(hue, saturation, lightness) {
        let red, green, blue;
        let temporary1, temporary2;
        let temp_red, temp_green, temp_blue;

        if (saturation != 0) {

            if (lightness < 0.5) { temporary1 = lightness * (1 + saturation) } else if (lightness >= 0.5) {
                temporary1 = lightness + saturation - lightness * saturation;
            }

            temporary2 = 2 * lightness - temporary1;
            hue = hue / 360;

            temp_red = hue + 0.333;
            temp_green = hue;
            temp_blue = hue - 0.333;
            if (temp_red < 0) { temp_red += 1 } else if (temp_red > 1) {
                temp_red -= 1;
            }
            if (temp_green < 0) { temp_green += 1 } else if (temp_green > 1) {
                temp_green -= 1;
            }
            if (temp_blue < 0) { temp_blue += 1 } else if (temp_blue > 1) {
                temp_blue -= 1;
            }

            red = findCorrectFormula(temp_red, temporary1, temporary2);
            green = findCorrectFormula(temp_green, temporary1, temporary2);
            blue = findCorrectFormula(temp_blue, temporary1, temporary2);

        } else {
            red = green = blue = lightness;
        }


        red = red * 255;
        green = green * 255;
        blue = blue * 255;


        return [red, green, blue];
    }


    function findCorrectFormula(tempcolour, temporary1, temporary2) {
        let value;
        if (6 * tempcolour < 1) { value = temporary2 + (temporary1 - temporary2) * 6 * tempcolour; return value }
        else if (2 * tempcolour < 1) { value = temporary1; return value }
        else if (3 * tempcolour < 2) { value = temporary2 + (temporary1 - temporary2) * (0.666 - tempcolour) * 6; return value }
        else {
            value = temporary2
            return value
        }

    }

})