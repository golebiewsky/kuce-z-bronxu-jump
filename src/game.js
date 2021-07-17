// INIT
// Initialize kaboom.js
kaboom({
    global: true, // import all kaboom functions to global namespace
    scale: 2, // pixel size
    width: 250, // game canvas size
    height: 150,
    clearColor: [0, 0, 0, 0], // background color
    crisp: true, // if pixel crisp (for sharp pixelated games)
    plugins: [ asepritePlugin, ], // load aseprite plugin to load graphics
});
// Load assets
loadAseprite("kuc", "assets/kuc.png", "./assets/kuc.json");
loadSprite("pony_dead", "./assets/pony_dead.png");
loadSprite("ground", "./assets/gline.png");
loadSprite("inv", "./assets/inv.png");
loadSprite("odung", "./assets/odung.png");
loadSprite("oglue", "./assets/oglue.png");
loadSprite("obox", "./assets/obox.png");
loadSprite("ochick", "./assets/ochick.png");
loadSprite("oflag", "./assets/oflag.png");
loadSprite("oflagg", "./assets/oflagg.png");
loadSprite("ograve", "./assets/ograve.png");
loadSprite("oapple", "./assets/oapple.png");
loadSprite("opiano", "./assets/opiano.png");
loadSound("jump_sound", "./assets/jump.wav");
loadSound("over", "./assets/over.wav");
// Set global variables
let highScore = 0;
let score = 0;
// Jumping
function jumpAction(obj) {
    if (obj.grounded()) { // If obj is on the ground
        obj.jump(obj.jumpForce); // Use physics jump action based on jumpForce
        obj.play("jump"); // Play jump animation of 'obj'
        play("jump_sound", { // Play jump sound efect
            volume: 0.05, // Effect volume
            detune: rand(2,300), // Change the sound a bit on every jump
        });
    }
};
// GAME SCENES
// Start scene
scene("start", () => {
    add([
		text("Kuce z Bronxu Jump", 12),
        origin("center"),
        pos(vec2(125, 50)),
        color(0.3, 0.3, 0.3),
	]);
    add([
		text("Wsisnij SPACJE/TAPNIJ\nzeby zaczac", 8),
        origin("center"),
        pos(vec2(125, 85)),
        color(0.3, 0.3, 0.3),
	]);
    keyPress("space", () => {
        go("main");
    });
    mouseClick(() => {
        go("main");
    });
});
// Game over scene
scene("over", () => {
    add([
        text("Wyjnik: " + score + "\nNajwynszy wynik: " + highScore, 6),
        origin("center"),
        pos(vec2(125, 40)),
        color(0.3, 0.3, 0.3),
	]);
    add([
        text("Wcimsnij SPACJE/TAPNIJ", 8),
        origin("center"),
        pos(vec2(125, 70)),
        color(0.3, 0.3, 0.3),
	]);
    add([
        sprite("pony_dead"),
        origin("center"),
        pos(vec2(125, 100)),
    ]);
    add([
        text("Autor: golebiewsky", 4),
        origin("center"),
        pos(vec2(125, 130)),
        color(0.3, 0.3, 0.3),
	]);
    add([
        text("Na podstanwie 'Kucy z Bronxu' Dema", 4),
        origin("center"),
        pos(vec2(125, 135)),
        color(0.3, 0.3, 0.3),
	]);
    keyPress("space", () => {
        go("main")
    });
    mouseClick(() => {
        go("main");
    });
});
// Main game scene
scene("main", () => {
    // game speed
    const SPEED = 150;
    // speed modificator
    let speedMod = 1;
    // score
    score = 0;
    // game gravity
	gravity(400);
    // scene layers
    layers([
        "game",
    ], "game");
    // Show score (time) in the upper right corner
    scoreText = add([
		text("0", 6),
        color(0.3, 0.3, 0.3),
        origin("right"),
        pos(vec2(width(), 10)),
	]);
    // Show highscore in the upper left corner (if bigger than 0)
    if (highScore > 0) {
        highScoreText = add([
            text("HI " + highScore, 6),
            color(0.3, 0.3, 0.3),
            origin("left"),
            pos(vec2(10, 10)),
        ]);
    }
    // Add empty texture for physics (holds pony in place)
    add([
        sprite("inv"),
        pos(0, height() - 20),
        layer("game"),
        solid(),
    ])
    // Add ground texture
    add([
		sprite("ground"),
		pos(0, height() - 20),
		"ground",
	]);
    // Copy ground to make it infinite
	add([
		sprite("ground"),
		pos(width() * 4, height() - 20),
		"ground",
        solid(),
	]);
    // Move ground to the left to give feeling of player movement
    action("ground", (r) => {
        r.move(-SPEED * speedMod, 0);
        if (r.pos.x <= -width() * 4) {
            r.pos.x += width() * 8;
        }
    });
    // Spawn obstacle every 2 seconds
    loop(2, () => {
        // Choose an obstacle by random
        const obstacle = choose([
            "odung",
            "ochick",
            "obox",
            "oglue",
            "oflag",
            "oflagg",
            "ograve",
            "opiano",
        ]);
        add([
            sprite(obstacle),
            origin("bot"),
            scale(vec2(choose([-1, 1]), 1)),
            "obstacle",
            obstacle,
            pos(width() + rand(40, 100), rand(140, 145)),
        ]);
    });
    // Move obstacle to the left to give feeling of player movement
    action("obstacle", (o) => {
        o.move(-SPEED * speedMod, 0);
        if (o.pos.x <= -width()) {
            destroy(o);
        };
    });
    // Make the game faster every second and add point to the score
    loop(1, () => {
        speedMod = speedMod + 0.01;
        score = score + 1;
        scoreText.text = score;
    })
    // Add player character
    const player = add([
        sprite("kuc", {
            animSpeed: 0.11 / speedMod,
        }),
        pos(40, 50),
        scale(1),
        body({ jumpForce: 200, }),
        origin("center"),
        // Physics area is smaller than the sprite
        area(vec2(-12, -6), vec2(12, 6)),
    ]);
    // Jump on SPACE
    keyPress("space", () => {
        jumpAction(player);
    });
    // Jump on CLICK
    mouseClick(() => {
        jumpAction(player);
    });
    // If player touches ground then play the running animation
    player.on("grounded", () => {
        player.play("run");
    });
    // If player touches the obstacle set the highscore (if better) and go to the end screen
    player.collides("obstacle", (o) => {
        if (score > highScore) {
            highScore = score;
        }
        play("over", {
            volume: 0.05,
        });
        go("over");
    });
});
// Start the game by playing 'start' scene
start("start");