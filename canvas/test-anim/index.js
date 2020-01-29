console.log('I begin');

let canvas = null;
let context = null;

function init() {
    console.log('init')
    canvas = document.querySelector('#myCanvas');
    context = canvas.getContext("2d");

    tween.start();

    window.requestAnimationFrame(draw);
}

let rotation = 0;
let speed = 0.09;
let obj = {
    speed: 10
}
var tween = new TWEEN.Tween(obj);

tween.to({ speed: 0 }, 4000);

tween.onUpdate( obj => {
    if (!isNaN(obj.speed)) {
        speed = obj.speed;
    }
    console.log('speedZ: ', obj);
})

function draw() {
    tween.update();
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let slices = 6;
    let colors = ['orange', 'yellow', 'lightblue', 'purple', 'gray', 'magenta'];
    let radius = (canvas.height / 2) * 0.9;

    let sliceAngle = (2 * Math.PI) / slices;

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    context.translate(cx, cy);
    context.rotate(rotation);

    for (let i = 0; i < colors.length; ++i) {
        context.fillStyle = colors[i];
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius, sliceAngle * i, sliceAngle + sliceAngle * i);
        context.lineTo(0, 0);
        context.fill();
    }

    rotation += (speed * .01);

    window.requestAnimationFrame(draw);
    TWEEN.update();
}

init();
