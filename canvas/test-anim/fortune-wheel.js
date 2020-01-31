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
let tongueBody = null;
let wheelBody = null;
let spinning = false;
let drawPhysics = false;

const drawFlags = {
    slices: true,
    dividers: true,
    texts: true,
    innerRing: true,
    center: true,
    outerRing: true,
    tongue: true,
    collisionCircles: false,
};

const flasher = {
    index: -1,
    counter: 0,
    fill: true,

    setup(index = -1) {
        this.index = index;
        this.counter = 0
        this.next = this.cooldown - this.nextStep;
    },

    update(fillStyle) {
        this.counter++;

        if (this.counter > wheelData.flashing.time) {
            this.setup();
            return fillStyle
        } else {
            if (this.counter % 9 === 0) {
                this.fill = !this.fill;
            }
            if (this.fill) {
                return wheelData.flashing.color
            } else {
                return fillStyle;
            }
        }
    }
};

const imageTcsLogo = new Image();

const wheelData = {
    flashing: {
        color: '#ffff00',
        time: 1234,
    },
    dividers: {
        color: '#8166ce',
        size: "20"
    },
    text: {
        color: "#afabe7",
        size: "47",
        offsetFromCenter: "458",
    },
    center: {
        color: '#0000ff',
        size: "10"
    },
    innerRing: {
        color: '#7054b8',
        size: "13",
    },
    outerRing: {
        color: '#5a349a',
        size: 17,
    },
    slices: [
        { "color": "#918bc5", "text": "Sekiro" },
        { "color": "#a06bd1", "text": "Nioh" },
        { "color": "#4f59b9", "text": "RDR2" },
        { "color": "#73719d", "text": "FarCry" },
        { "color": "#6872b0", "text": "Doom" },
        { "color": "#7557cc", "text": "Yakuza" }
    ]
};

function setCanvasSize() {
    canvas.width = window.innerHeight * 1.2;
    canvas.height = window.innerHeight;

    canvas.style.left = (window.innerWidth / 2 - canvas.width / 2) + 'px';
}

function loadImages() {

    imageTcsLogo.onload = () => {
        console.log('images loaded...');
        initPhysics();
        animRequestId = window.requestAnimationFrame(animate);
    }

    imageTcsLogo.src = './assets/tcs-logo.png';
}

window.addEventListener('resize', () => {
    setCanvasSize();
    draw();
}, false);

document.querySelector('#spinTheWheel').addEventListener('click', () => {
    console.log('spin');
    spinning = true;
    flasher.setup();

    const velocity = Math.PI / getRandom(9, 16);

    Body.setAngularVelocity(wheelBody, velocity);
});

document.querySelector('#stopTheWheel').addEventListener('click', () => {
    console.log('stop');
    spinning = false;
    flasher.setup();
    Body.setAngularVelocity(wheelBody, 0);

});

document.querySelector('#renderMatter').addEventListener('click', () => {
    drawPhysics = !drawPhysics;
});

(function init() {

    setTimeout(() => {
        console.log('init')
        canvas = document.querySelector('#myCanvas');
        context = canvas.getContext("2d");

        setCanvasSize();
        loadImages();
    });

})();

function animate() {
    Engine.update(engine);
    checkSelectedSliceAfterSpinning();
    draw();
    window.requestAnimationFrame(animate);
}

function drawTask(taskFn) {
    context.save();
    taskFn();
    context.restore();
}

function drawSlices() {
    let radius = (canvas.height / 2) * 0.95;
    let sliceDegree = 360.0 / wheelData.slices.length;

    context.translate(wheelBody.position.x, wheelBody.position.y);
    context.rotate(wheelBody.angle);

    for (let i = 0; i < wheelData.slices.length; ++i) {
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius, deg2rad(sliceDegree * i), deg2rad(sliceDegree + sliceDegree * i));
        context.lineTo(0, 0);
        context.fillStyle = wheelData.slices[i].color;

        if (flasher.index === i) {
            context.fillStyle = flasher.update(context.fillStyle);
        }

        context.fill();
    }
}

function drawDividers() {
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;
    let sliceDegree = 360.0 / wheelData.slices.length;
    let sliceAngle = deg2rad(sliceDegree);
    let radius = (canvas.height / 2) * 0.95;

    context.shadowColor = 'black';
    context.shadowBlur = 16;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.lineWidth = wheelData.dividers.size;
    context.strokeStyle = wheelData.dividers.color;

    for (let i = 0; i < wheelData.slices.length; ++i) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(cx, cy);
        context.rotate(wheelBody.angle);
        context.rotate((sliceAngle * i) - sliceAngle * 0.5);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, radius);
        context.stroke();
    }
}

function drawOuterRing() {
    const radius = (canvas.height / 2) * 0.95;

    context.shadowColor = 'black';
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.strokeStyle = wheelData.outerRing.color;
    context.lineWidth = wheelData.outerRing.size;
    context.beginPath();
    context.arc(wheelBody.position.x, wheelBody.position.y, radius, 0, -Math.PI * 2);
    context.stroke();
}

function drawInnerRing() {
    const radius = (canvas.height / 2) * 0.95;

    context.shadowColor = 'black';
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.fillStyle = wheelData.innerRing.color;
    context.beginPath();

    context.moveTo(wheelBody.position.x, wheelBody.position.y);
    context.arc(wheelBody.position.x, wheelBody.position.y, radius * parseInt(wheelData.innerRing.size) * 0.01, 0, Math.PI * 2);
    context.fill();
}

function drawCenter() {
    const radius = (canvas.height / 2) * 0.95;
    const wh = radius * 0.25;

    context.fillStyle = wheelData.center.color;
    context.beginPath();
    context.moveTo(wheelBody.position.x, wheelBody.position.y);
    context.arc(wheelBody.position.x, wheelBody.position.y, radius * parseInt(wheelData.center.size) * 0.01, 0, Math.PI * 2);
    context.fill();

    context.drawImage(imageTcsLogo, wheelBody.position.x - (wh / 2), wheelBody.position.y - (wh / 2), wh, wh);
}

function drawText() {
    const radius = (canvas.height / 2) * 0.95;
    let sliceDegree = 360.0 / wheelData.slices.length;
    let sliceAngle = deg2rad(sliceDegree);

    context.fillStyle = wheelData.text.color;
    context.font = wheelData.text.size + 'px Arial';

    for (let i = 0; i < wheelData.slices.length; ++i) {
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
        context.fillText(wheelData.slices[i].text, radius * wheelData.text.offsetFromCenter * 0.001, 0);

        context.restore();
    }
}

function drawTongue() {
    context.setTransform(1, 0, 0, 1, 0, 0);

    if (tongueBody) {
        context.translate(tongueBody.position.x * 1.07, tongueBody.position.y);
        context.rotate(tongueBody.angle);
    }
    context.beginPath();
    context.moveTo(-10, 0);
    context.lineTo(0, -40);
    context.lineTo(-90, 0);
    context.lineTo(0, 40);
    // context.lineTo(0, -30);
    context.closePath();

    context.shadowColor = 'black';
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // the outline
    context.lineWidth = 10;
    // context.strokeStyle = 'rgba(0, 0, 200, 0.4)'; // 'lightblue';
    context.strokeStyle = 'lightblue';
    context.stroke();

    context.shadowColor = "transparent";

    // the fill color
    context.fillStyle = 'rgba(222,222,222, 0.4)';
    context.fill();
}

function drawDebugCollisionCircles() {
    let radius = (canvas.height / 2) * 0.95;
    const arr = [];

    for (let i = 0; i < wheelData.slices.length; ++i) {

        const newPos = rotatePointCenter(radius, 0, rad2deg(wheelBody.angle) + 30 + i * 60);

        arr.push(newPos);

        newPos.x += wheelBody.position.x;
        newPos.y += wheelBody.position.y;

        context.beginPath();
        context.arc(newPos.x, newPos.y, 170, 0, 2 * Math.PI);
        context.stroke();
    }

    context.beginPath();
    context.arc(wheelBody.position.x + radius * 0.9, wheelBody.position.y, 10, 0, 2 * Math.PI);
    context.stroke();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (drawPhysics) {
        context.globalAlpha = 0.6;
        Render.world(render);
    } else {
        context.globalAlpha = 1;
    }

    drawFlags.slices && drawTask(drawSlices);
    drawFlags.dividers && drawTask(drawDividers);
    drawFlags.texts && drawTask(drawText);
    drawFlags.innerRing && drawTask(drawInnerRing);
    drawFlags.center && drawTask(drawCenter);
    drawFlags.outerRing && drawTask(drawOuterRing);
    drawFlags.tongue && drawTask(drawTongue);
    drawFlags.collisionCircles && drawTask(drawDebugCollisionCircles);
}

function calcCollisionCircles() {
    let radius = (canvas.height / 2) * 0.95;
    const arr = [];

    for (let i = 0; i < wheelData.slices.length; ++i) {
        const newPos = rotatePointCenter(radius, 0, rad2deg(wheelBody.angle) + 30 + i * 60);

        arr.push(newPos);

        newPos.x += wheelBody.position.x;
        newPos.y += wheelBody.position.y;
    }

    return arr;
}

function checkSelectedSliceAfterSpinning() {
    if (spinning && wheelBody.angularSpeed < 0.001 && tongueBody.angularSpeed < 0.001) {
        const radius = (canvas.height / 2) * 0.95;
        const arr = calcCollisionCircles();

        for (let i = 0; i < arr.length; ++i) {
            const tip = {
                x: wheelBody.position.x + radius,
                y: wheelBody.position.y
            }

            const inside = pointInCircle(tip.x, tip.y, arr[i].x, arr[i].y, 170);

            if (inside) {
                console.log('inside [' + wheelData.slices[i].text + ']');
                spinning = false;
                flasher.setup(i);
            }
        }
    }
}

function initPhysics() {
    const cw = canvas.width;
    const ch = canvas.height;

    if (engine) {
        Engine.clear(engine);
        engine = null;
    }

    engine = Engine.create();
    render = Render.create({
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

    tongueBody = Bodies.rectangle(cw * 0.9, ch / 2, ch * 0.17, ch * 0.02);

    let x = cw / 2;
    let y = ch / 2;
    let size = ch * 0.8;
    let heig = size * 0.06;

    const divider1 = Bodies.rectangle(x, y, size, heig);
    const divider2 = Bodies.rectangle(x, y, size, heig);
    const divider3 = Bodies.rectangle(x, y, size, heig);

    let degrees = 0;
    Body.setAngle(divider1, deg2rad(degrees));

    degrees += 60;
    Body.setAngle(divider2, deg2rad(degrees));

    degrees += 60;
    Body.setAngle(divider3, deg2rad(degrees));

    wheelBody = Body.create({
        parts: [divider1, divider2, divider3],
        friction: 1
    });

    const constraintWheel = Constraint.create({
        pointA: { x: cw / 2, y: ch / 2 },
        bodyB: wheelBody,
        length: 0
    })

    const constraintTongue = Constraint.create({
        pointA: { x: cw * 0.9, y: ch * 0.5 },
        bodyB: tongueBody,
        pointB: { x: 30, y: 0 },
        length: 0,
    });

    const constraintSpring = Constraint.create({
        pointA: { x: cw, y: ch * 0.5 },
        bodyB: tongueBody,
        pointB: { x: 50, y: 0 },
        stiffness: 0.1,
        length: 20
    })

    World.add(engine.world, [
        tongueBody,
        wheelBody,
        constraintTongue,
        constraintSpring,
        constraintWheel,
    ]);
}
