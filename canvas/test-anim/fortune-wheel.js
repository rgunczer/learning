let canvas = null;
let context = null;

let rotation = 0;
let obj = {};
let tween;
const imageTcsLogo = new Image();
let animRequestId;

let elapsedTime = 0;
let dividerAnimPhase = -1;
const dividerBuldCount = 9;

const wheel = {
    text: {
        color: "#afabe7",
        size: "47",
        offsetFromCenter: "458",
    },
    outerRing: {
        color: '#5a349a',
        size: 17,
    },
    slices: [
        {
            color: "95,104,195", text: "Fabulon"
        },
        {
            color: "90,100,170", text: "Baba"
        },
        {
            color: "#4f59b9", text: "Zewa"
        },
        {
            color: "#73719d", text: "Corona"
        },
        {
            color: "195,104,195", text: "Joker"
        },
        {
            color: "#7557cc", text: "Snafu"
        }
    ]
};

function setCanvasSize() {
    canvas.width = window.innerHeight * 1.2;
    canvas.height = window.innerHeight;

    canvas.style.left = (window.innerWidth / 2 - canvas.width / 2) + 'px';
}

function loadImages() {

    imageTcsLogo.onload = () => {
        // draw image...
        console.log('image loaded...');
        animRequestId = window.requestAnimationFrame(animate);
        // draw(false);
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
            .easing(TWEEN.Easing.Quintic.Out);

        tween.start();
    });

document
    .querySelector('#stopTheWheel')
    .addEventListener('click', () => {
        rotation = 0;
        // window.cancelAnimationFrame(animRequestId);
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

    if (tween) {
        tween.update(time);
        rotation += obj.speed;
    }

    // console.log('speed: ', obj.speed);


    // if (obj.speed > 0) {
    animRequestId = window.requestAnimationFrame(animate);
    // }

    elapsedTime += 1;

    if (elapsedTime > 6) {

        dividerAnimPhase++;

        if (dividerAnimPhase > dividerBuldCount) {
            dividerAnimPhase = -1;
        }

        elapsedTime = 0;
    }

    draw();
}

function draw() {
    // console.log('draw');

    context.setTransform(1, 0, 0, 1, 0, 0);

    context.clearRect(0, 0, canvas.width, canvas.height);

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;




        context.fillStyle = 'red'; // 'rgb(59, 134, 199)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        let radius = (canvas.height / 2) * 0.95;

        let sliceAngle = (2 * Math.PI) / wheel.slices.length;


        context.translate(cx, cy);
        context.rotate(rotation);

        context.lineWidth = 6;

        context.save();

        // context.shadowColor = 'black';
        // context.shadowBlur = 16;
        // context.shadowOffsetX = 0;
        // context.shadowOffsetY = 0;


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

        // draw dividers
        context.save();

        context.shadowColor = 'black';
        context.shadowBlur = 16;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.lineWidth = 16;
        context.strokeStyle = 'yellow';

        for (let i = 0; i < wheel.slices.length; ++i) {

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.translate(cx, cy);
            context.rotate(rotation);

            context.rotate((sliceAngle * i) - sliceAngle * 0.5);

            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, radius);
            context.stroke();
        }

        context.restore();

        context.save();

        context.shadowColor = 'black';
        context.shadowBlur = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        for (let i = 0; i < wheel.slices.length; ++i) {

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.translate(cx, cy);
            context.rotate(rotation);

            context.rotate((sliceAngle * i) - sliceAngle * 0.5);

            // draw divider lights
            for (let j = 0; j < dividerBuldCount; ++j) {
                context.beginPath();
                if (j === dividerAnimPhase) {
                    context.fillStyle = 'orange';
                } else {
                    context.fillStyle = 'red';
                }
                context.arc(0, 80 + j * 36, 16, 0, Math.PI * 2);
                context.fill();
            }
        }

        context.restore();


        context.fillStyle = wheel.text.color;
        context.font = wheel.text.size + 'px Arial';

        for (let i = 0; i < wheel.slices.length; ++i) {

            const newx = 0;
            const newy = 0;

            context.save();

            context.shadowColor = 'black';
            context.shadowBlur = 10;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            context.translate(newx, newy);
            context.rotate((sliceAngle - sliceAngle / 2.0) + sliceAngle * i);
            context.textBaseline = "middle";
            context.fillText(wheel.slices[i].text, radius * wheel.text.offsetFromCenter * 0.001, 0);

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
        context.arc(0, 0, radius, 0, -Math.PI * 2);
        context.stroke();

        context.restore();



    context.save();

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(cx + radius * 1.15, cy);

    context.rotate(rotation); // * Math.PI / 180 );
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, -30);
    context.lineTo(-90, 0);
    context.lineTo(0, 30);
    // context.lineTo(0, -30);
    context.closePath();

    context.shadowColor = 'black';
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // the outline
    context.lineWidth = 10;
    context.strokeStyle = 'lightblue';
    context.stroke();

    context.shadowColor = "transparent";

    // the fill color
    context.fillStyle = 'yellow';
    context.fill();

    context.restore();

}

init();
