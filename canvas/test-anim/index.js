let canvas = null;
let context = null;

let rotation = 0;
let obj = {};
let tween;
const imageTcsLogo = new Image();
let animRequestId;

const wheel = {
    outerRing: {
        color: '#5a349a',
        size: 17,
    },
    slices: [
        {
            color: "95,104,195",
            text: "Slice 0"
        },
        {
            color: "90,100,170",
            text: "Slice 1"
        },
        {
            color: "#4f59b9",
            text: "Slice 2"
        },
        {
            color: "#73719d",
            text: "Slice 3"
        },
        {
            color: "195,104,195",
            text: "Slice 4"
        },
        {
            color: "#7557cc",
            text: "Slice 5"
        }
    ]
};

function setCanvasSize() {
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;

    canvas.style.left = (window.innerWidth / 2 - canvas.width / 2) + 'px';
}

function loadImages() {

    imageTcsLogo.onload = () => {
        // draw image...
        console.log('image loaded...');
        draw(false);
    }

    imageTcsLogo.src = './assets/tcs-logo.png';
}


window
    .addEventListener('resize', () => {
        if (canvas) {
            setCanvasSize();
            draw(false);
        }
    }, false);

document
    .querySelector('#spinTheWheel')
    .addEventListener('click', () => {
        console.log('spin');

        obj = {
            speed: 0.2
        }

        tween = new TWEEN.Tween(obj)
            .to({ speed: 0.0 }, 20000)
            // .easing(TWEEN.Easing.Cubic.Out);
            .easing(TWEEN.Easing.Quintic.Out);
        // .interpolation(TWEEN.Interpolation.Bezier);

        tween.start();
        animRequestId = window.requestAnimationFrame(animate);
    });

document
    .querySelector('#stopTheWheel')
    .addEventListener('click', () => {
        rotation = 0;
        window.cancelAnimationFrame(animRequestId);
    });

document
    .querySelector('#justATest')
    .addEventListener('click', () => {

        const x = 0;
        const y = 0;
        const width = canvas.width;
        const height = canvas.height;

        var imgd = context.getImageData(x, y, width, height);
        var pix = imgd.data;

        // Loop over each pixel and invert the color.
        for (var i = 0, n = pix.length; i < n; i += 4) {
            pix[i] = 255 - pix[i]; // red
            pix[i + 1] = 255 - pix[i + 1]; // green
            pix[i + 2] = 255 - pix[i + 2]; // blue
            // i+3 is alpha (the fourth element)
        }

        // Draw the ImageData at the given (x,y) coordinates.
        context.putImageData(imgd, x, y);
    });




function init() {
    console.log('init')
    canvas = document.querySelector('#myCanvas');
    context = canvas.getContext("2d");

    setCanvasSize();
    loadImages();
}

function animate(time) {

    tween.update(time);

    console.log('speed: ', obj.speed);

    rotation += obj.speed;

    if (obj.speed > 0) {
        animRequestId = window.requestAnimationFrame(animate);
    }

    draw();
}

function draw() {
    // console.log('draw');

    context.setTransform(1, 0, 0, 1, 0, 0);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgb(59, 134, 199)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    let radius = (canvas.height / 2) * 0.95;

    let sliceAngle = (2 * Math.PI) / wheel.slices.length;

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    context.translate(cx, cy);
    context.rotate(rotation);

    context.lineWidth = 6;

    context.save();

    context.shadowColor = 'black';
    context.shadowBlur = 16;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;


    for (let i = 0; i < wheel.slices.length; ++i) {
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius, sliceAngle * i, sliceAngle + sliceAngle * i);
        context.lineTo(0, 0);
        // context.fillStyle = 'black';
        // context.font = '48px Arial';
        // context.fillText('Hello World', 10, 10);

        // const newx = 0;
        // const newy = 0;

        // context.save();
        // context.translate(newx, newy);
        // // context.rotate(-Math.PI / 2);
        // context.rotate(sliceAngle * i);
        // // context.textAlign = "center";
        // context.textBaseline = "middle";
        // context.fillText("Some Text", radius * 0.2, 0);
        // context.restore();

        if (wheel.slices[i].color.startsWith('#')) {
            context.fillStyle = wheel.slices[i].color;
        } else {
            context.fillStyle = 'rgb(' + wheel.slices[i].color + ')';
        }



        context.fill();
    }

    context.restore();

    context.fillStyle = 'white';
    context.font = '48px Arial';

    for (let i = 0; i < wheel.slices.length; ++i) {

        const newx = 0;
        const newy = 0;

        context.save();

        context.shadowColor = 'black';
        context.shadowBlur = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.translate(newx, newy);
        // context.rotate(-Math.PI / 2);
        // context.rotate(sliceAngle * i);
        context.rotate((sliceAngle - sliceAngle / 2.0) + sliceAngle * i);
        // context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(wheel.slices[i].text, radius * 0.2, 0);
        context.restore();


    }

    // context.strokeStyle = 'rgb(50, 50, 150)';

    // for (let i = 0; i < slices.length; ++i) {
    //     context.beginPath();
    //     context.moveTo(0, 0);
    //     context.arc(0, 0, radius, sliceAngle * i, sliceAngle + sliceAngle * i);
    //     context.lineTo(0, 0);
    //     context.stroke();
    // }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(cx, cy);

    const wh = radius * 0.25;

    context.save();

    context.shadowColor = 'black';
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;


    context.fillStyle = 'rgb(50, 50, 150)';
    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
    context.fill();







    context.restore();


    context.save();

    context.fillStyle = 'rgb(150, 50, 150)';
    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
    context.fill();

    context.drawImage(imageTcsLogo, -wh / 2, -wh / 2, wh, wh);

    context.restore();



    context.save();

    context.shadowColor = 'black';
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;


    context.strokeStyle = wheel.outerRing.color;
    context.lineWidth = wheel.outerRing.size;
    context.beginPath();
    // context.moveTo(0, 0);
    // context.lineTo(200, 100);
    context.arc(0, 0, radius, 0, -Math.PI * 2);
    context.stroke();

    context.restore();

}

init();
