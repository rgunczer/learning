console.log('here');

let ch = 800;
let cw = ch * 1.2;

// const canvas = document.querySelector('#myCanvas');
// let context = null;

const wheel = {
    slices: [{}, {}, {}, {}, {}, {}]
}

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Constraint = Matter.Constraint;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine = null;
let render = null;

function setCanvasSize() {
    cw = window.innerHeight * 1.2;
    ch = window.innerHeight;

    // canvas.style.left = (window.innerWidth / 2 - canvas.width / 2) + 'px';
}

window.addEventListener('resize', () => {

    setCanvasSize();
    initMatter();

}, false);

/*
function init() {
    console.log('init')
    canvas = document.querySelector('#myCanvas');
    context = canvas.getContext("2d");

    setCanvasSize();
    draw();
}

function draw() {
    console.log('draw');

    context.setTransform(1, 0, 0, 1, 0, 0);

    context.clearRect(0, 0, canvas.width, canvas.height);

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    context.fillStyle = 'orange';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, 300);
    context.lineTo(300, 300);
    context.closePath();

    context.lineWidth = 1;
    context.strokeStyle = '#666666';
    context.stroke();
}

init();
*/

function initMatter() {

    if (render) {
        Render.stop(render);
        // World.clear(Engine.world);


        if (engine) {
            Engine.clear(engine);
            engine = null;
        }

        render.canvas.remove();
        render.canvas = null;
        render.context = null;
        render.textures = {};

        render = null;
    }

    engine = Engine.create();

    render = Render.create({
        element: document.querySelector('.container-matter'),
        // canvas: canvas,
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

    var tongue = Bodies.rectangle(cw * 0.9, ch / 2, ch * 0.17, ch * 0.02);

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

    var wheelBody = Body.create({
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

    Engine.run(engine);
    Render.run(render);

    document.querySelector('#test').addEventListener('click', () => {
        Body.setAngularVelocity(wheelBody, Math.PI / 12);
    })
}

setCanvasSize();
initMatter();
