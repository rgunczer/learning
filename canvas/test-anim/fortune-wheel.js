let canvas = null;
let context = null;

// matter vars
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Constraint = Matter.Constraint;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine = null;
// let render = null;
let tongue = null;
let wheelBody = null;

let elapsed = 0;


let renderMatter = false;

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
        initMatter();
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

        Body.setAngularVelocity(wheelBody, Math.PI / 12);

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


    document
    .querySelector('#renderMatter')
    .addEventListener('click', () => {
        renderMatter = !renderMatter;
    });

function init() {
    console.log('init')
    canvas = document.querySelector('#myCanvas');
    context = canvas.getContext("2d");

    setCanvasSize();
    loadImages();
}

function animate(time) {

    if (engine) {
        // console.log('matter update with: ', time);
        Engine.update(engine); //, elapsed)
    }

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

    if (renderMatter) {
        Render.world(render);
    }

    // return;

/*

        context.fillStyle = 'red'; // 'rgb(59, 134, 199)';
        context.fillRect(0, 0, canvas.width, canvas.height);
*/
        let radius = (canvas.height / 2) * 0.95;

        let sliceAngle = (2 * Math.PI) / wheel.slices.length;
/*

        context.translate(cx, cy);
        context.rotate(rotation);

        context.lineWidth = 6;
*/
        context.save();

        context.translate(wheelBody.position.x, wheelBody.position.y);
        context.rotate(wheelBody.angle);

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
            context.rotate(wheelBody.angle);

            context.rotate((sliceAngle * i) - sliceAngle * 0.5);

            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, radius);
            context.stroke();
        }

        context.restore();
/*
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
*/

        context.fillStyle = wheel.text.color;
        context.font = wheel.text.size + 'px Arial';

        for (let i = 0; i < wheel.slices.length; ++i) {

            const newx = wheelBody.position.x;
            const newy = wheelBody.position.y;

            context.save();

            context.shadowColor = 'black';
            context.shadowBlur = 10;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            context.translate(newx, newy);
            context.rotate(wheelBody.angle);
            context.rotate((sliceAngle - sliceAngle / 2.0) + sliceAngle * i);
            context.textBaseline = "middle";
            context.fillText(wheel.slices[i].text, radius * wheel.text.offsetFromCenter * 0.001, 0);

            context.restore();
        }
/*
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
*/
        const wh = radius * 0.25;

        context.save();

        context.shadowColor = 'black';
        context.shadowBlur = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;


        context.fillStyle = 'rgb(50, 50, 150)';
        context.beginPath();

        context.moveTo(wheelBody.position.x, wheelBody.position.y);
        context.arc(wheelBody.position.x, wheelBody.position.y, radius * 0.12, 0, Math.PI * 2);
        context.fill();


        context.restore();


        context.save();

        context.fillStyle = 'rgb(150, 50, 150)';
        context.beginPath();
        context.moveTo(wheelBody.position.x, wheelBody.position.y);
        context.arc(wheelBody.position.x, wheelBody.position.y, radius * 0.1, 0, Math.PI * 2);
        context.fill();

        context.drawImage(imageTcsLogo, wheelBody.position.x - (wh / 2), wheelBody.position.y - (wh / 2), wh, wh);

        context.restore();


        // outer ring

        context.save();

        context.shadowColor = 'black';
        context.shadowBlur = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.strokeStyle = wheel.outerRing.color;
        context.lineWidth = wheel.outerRing.size;
        context.beginPath();
        context.arc(wheelBody.position.x, wheelBody.position.y, radius, 0, -Math.PI * 2);
        context.stroke();

        context.restore();



    context.save();

    context.setTransform(1, 0, 0, 1, 0, 0);
    // context.translate(cx + radius * 1.15, cy);

    // context.rotate(rotation); // * Math.PI / 180 );
    if (tongue) {
        console.log('tongue rotation: ', tongue.angle);
        context.translate(tongue.position.x* 1.07, tongue.position.y);
        context.rotate(tongue.angle); // * Math.PI / 180);
    }
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
    context.strokeStyle = 'rgba(0, 0, 200, 0.4)'; // 'lightblue';
    context.stroke();

    context.shadowColor = "transparent";

    // the fill color
    context.fillStyle = 'rgba(222,222,222, 0.4)';
    context.fill();

    context.restore();


}

init();


function initMatter() {

    const cw = canvas.width;
    const ch = canvas.height;

    // if (render) {
    //     Render.stop(render);
        // World.clear(Engine.world);


        if (engine) {
            Engine.clear(engine);
            engine = null;
        }

    //     render.canvas.remove();
    //     render.canvas = null;
    //     render.context = null;
    //     render.textures = {};

    //     render = null;
    // }

    engine = Engine.create();

    render = Render.create({
        // element: document.querySelector('.container-matter'),
        canvas: canvas,
        engine: engine,
        options: {
            width: cw,
            height: ch,
            wireframes: true,
            showDebug: true,
            showAxes: true,
            showPositions: true,
            showIds: true,
        }
    });

    tongue = Bodies.rectangle(cw * 0.9, ch / 2, ch * 0.17, ch * 0.02);

    let x = cw / 2;
    let y = ch / 2;
    let size = ch * 0.8;
    let heig = size * 0.06;

    var partA = Bodies.rectangle(x, y, size, heig);
    var partB = Bodies.rectangle(x, y, size, heig);
    var partC = Bodies.rectangle(x, y, size, heig);

    let degrees = 0;

    Body.setAngle(partA, degrees / 180 * Math.PI);

    degrees += 60
    Body.setAngle(partB, degrees / 180 * Math.PI);

    degrees += 60
    Body.setAngle(partC, degrees / 180 * Math.PI);

    wheelBody = Body.create({
        parts: [partA, partB, partC]
    });

    var constrainWheel = Constraint.create({
        pointA: { x: cw / 2, y: ch / 2 },
        bodyB: wheelBody,
        length: 0
    })

    var constraintTongue = Constraint.create({
        pointA: { x: cw * 0.9, y: ch * 0.5 },
        bodyB: tongue,
        pointB: { x: 30, y: 0 },
        length: 0,
    });

    var constraintSpring = Constraint.create({
        pointA: { x: cw, y: ch * 0.5 },
        bodyB: tongue,
        pointB: { x: 50, y: 0 },
        stiffness: 0.2,
        length: 20
    })

    World.add(engine.world, [
        tongue,
        wheelBody,
        constraintTongue,
        constraintSpring,
        constrainWheel
    ]);

    // Engine.run(engine);
    // Render.run(render);

    // document.querySelector('#test').addEventListener('click', () => {
    //     Body.setAngularVelocity(wheelBody, Math.PI / 12);
    // })
}
