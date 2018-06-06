
var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

// images references
var playerImg, powerUpImg, backgroundImg, playerBulletImg, enemyBulletImg, enemy1Img;

// game camera
var camera;
var hhh = 0;
var iii = 0;

// game objects
var enemy1;
var enemy2;
var enemy3;
var enemy4;
var powerUps = [];
var enemies = [];

function Init ()
{
    // preparamos la variable para el refresco de la pantalla
    window.requestAnimationFrame = (function (evt)
    {
        return window.requestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.msRequestAnimationFrame ||

            function (callback)
            {
                window.setTimeout(callback, fixedDeltaTime * 1000);
            };
    }) ();

    canvas = document.getElementById("my_canvas");

    if (canvas.getContext)
    {
        ctx = canvas.getContext('2d');

        backgroundImg = new Image();
        backgroundImg.src = "./media/background.png";

        powerUpImg = new Image();
        powerUpImg.src = "./media/powerUp.png";

        playerBulletImg = new Image();
        playerBulletImg.src = "./media/playerBullet.png";

        enemyBulletImg = new Image();
        enemyBulletImg.src = "./media/enemyBullet.png";

        enemy1Img = new Image();
        enemy1Img.src = "./media/enemy1.PNG";

        playerImg = new Image();
        playerImg.src = "./media/player.png";
        playerImg.onload = Start();
    }
}

function Start ()
{
    // setup keyboard events
    SetupKeyboardEvents();

    // setup mouse events
    SetupMouseEvents();

    // initialize Box2D
    PreparePhysics(ctx);

    // init Player
    player.Start();

    // init Background
    background.Start();

    // first call to the game loop
    Loop();
}

function Loop ()
{
    requestAnimationFrame(Loop);

    var now = Date.now();
    deltaTime = now - time;
    if (deltaTime > 1000) // si el tiempo es mayor a 1 seg: se descarta
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }

    // transform the deltaTime from miliseconds to seconds
    deltaTime /= 1000;

    // update the input data
    input.update();

    // Game logic -------------------
    Update();

    // Draw the game ----------------
    Draw();

    // reset input data
    input.postUpdate();
}

function Update ()
{

    // update physics
    // Step(timestep , velocity iterations, position iterations)
    // world.Step(deltaTime, 8, 3);
    // world.ClearForces();

    // Player logic
    if (input.isKeyPressed(KEY_D))
        player.moveRight = true;

    if (input.isKeyPressed(KEY_A))
        player.moveLeft = true;

    if (input.isKeyPressed(KEY_W))
        player.moveUp = true;

    if (input.isKeyPressed(KEY_S))
        player.moveDown = true;

    if (input.isKeyPressed(KEY_SPACE))
        player.fire = true;

    // Player update
    player.Update(deltaTime);

    // Background update
    background.Update(deltaTime);

    // create an Enemy
    if (true && (Date.now() - hhh) > 5000)
    {
      for (var i = 0; i < 3; i++)
      {
        enemy1 = NewEnemy({x: Math.floor((Math.random() * 380) + 120), y: - 100, score: 100});
        enemy1.Start();
        enemies.push(enemy1);
        //console.log(enemies.length);
        hhh = Date.now();
      }
    }

    //create a Power-Up
    if (true && (Date.now() - iii) > 22500)
    {
      powerUp = NewPowerUp({x: Math.floor((Math.random() * 400) + 50), y: - 100, score: 50});
      powerUp.Start();
      powerUps.push(powerUp);
      iii = Date.now();
    }

    // Enemies update
    if (enemies.length > 0)
    {
      for (var i = 0; i < enemies.length; i++)
          enemies[i].Update(deltaTime);
    }

    // Power-Ups update
    if (powerUps.length > 0)
    {
      for (var i = 0; i < powerUps.length; i++)
          powerUps[i].Update(deltaTime);
    }

    // Player Bullets update
    if (player.bullets.length > 0)
    {
      for (var i = 0; i < player.bullets.length; i++)
      {
        player.bullets[i].Update(deltaTime);
      }
    }

    // Enemy Bullets update
    if (enemy1.bullets.length > 0)
    {
      for (var i = 0; i < enemy1.bullets.length; i++)
      {
        enemy1.bullets[i].Update(deltaTime);
      }
    }

    // Camera update
    //camera.Update(deltaTime);
}

function Draw ()
{
    // clean the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background
    background.Draw(ctx);

    // camera transform: translate
    //ctx.save();
    //ctx.translate(-camera.position.x, -camera.position.y);

    // draw the box2d world
    DrawWorld(world);

    // draw Enemies
    if (enemies.length > 0)
    {
      for (var i = 0; i < enemies.length; i++)
          enemies[i].Draw(ctx);
    }

    // draw the Player
    player.Draw(ctx);

    // draw Power-Ups
    if (powerUps.length > 0)
    {
      for (var i = 0; i < powerUps.length; i++)
          powerUps[i].Draw(ctx);
    }

    //draw Player Bullets
    if (player.bullets.length > 0)
    {
      for (var i = 0; i < player.bullets.length; i++)
      {
        player.bullets[i].Draw(ctx);
      }
    }

    // Enemy Bullets update
    if (enemy1.bullets.length > 0)
    {
      for (var i = 0; i < enemy1.bullets.length; i++)
      {
        enemy1.bullets[i].Draw(ctx);
      }
    }

    // camera transform: restore
    //ctx.restore();

    // draw the player score
    ctx.fillStyle = "white";
    ctx.font = "26px Comic Sans MS";
    ctx.fillText('Score: ' + player.score, 660, 24);

    // draw the FPS
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.fillText('FPS: ' + FPS, 10, 10);
    ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 10, 20);

    //ctx.drawImage(playerImg, 100, 100);
}

function DrawWorld (world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}











// var canvas;
// var ctx;
//
// var pi_2 = Math.PI * 2;
//
// var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
// var deltaTime = fixedDeltaTime;
//
// var time = 0,
//     FPS  = 0,
//     frames    = 0,
//     acumDelta = 0;
//
// // images references
// var playerImg, floorImg, mountainImg;
//
// // game camera
// var camera;
//
// // game objects
// var floors = [];
//
// function Init ()
// {
//     // preparamos la variable para el refresco de la pantalla
//     window.requestAnimationFrame = (function (evt) {
//         return window.requestAnimationFrame ||
//             window.mozRequestAnimationFrame ||
//             window.webkitRequestAnimationFrame ||
//             window.msRequestAnimationFrame ||
//             function (callback) {
//                 window.setTimeout(callback, fixedDeltaTime * 1000);
//             };
//     }) ();
//
//     canvas = document.getElementById("my_canvas");
//
//     if (canvas.getContext)
//     {
//         ctx = canvas.getContext('2d');
//
//         floorImg = new Image();
//         floorImg.src = "./media/wall.png";
//
//         // img ref: https://orig00.deviantart.net/fa75/f/2017/267/3/3/mountain_sprite_001_by_jonata_d-dbogk4i.png
//         mountainImg = new Image();
//         mountainImg.src = "./media/mountain.png";
//
//         playerImg = new Image();
//         playerImg.src = "./media/player.png";
//         playerImg.onload = Start();
//     }
// }
//
// function Start ()
// {
//     // setup keyboard events
//     SetupKeyboardEvents();
//
//     // setup mouse events
//     SetupMouseEvents();
//
//     // initialize Box2D
//     PreparePhysics(ctx);
//
//     // setup floors
//     var floor1 = NewFloor({x: 120, y: 100, width: 1.0, height: 0.2});
//     floor1.Start();
//     floors.push(floor1);
//
//     var floor2 = NewFloor({x: 600, y: 80, width: 1.0, height: 0.2});
//     floor2.Start();
//     floors.push(floor2);
//
//     var floor3 = NewFloor({x: 900, y: 120, width: 1.0, height: 0.2});
//     floor3.Start();
//     floors.push(floor3);
//
//     var floor4 = NewFloor({x: 1200, y: 160, width: 1.0, height: 0.2});
//     floor4.Start();
//     floors.push(floor4);
//
//     // init background
//     background.Start();
//
//     // init player
//     player.Start();
//
//     // init camera
//     camera = new Camera(player);
//     camera.Start();
//
//     // first call to the game loop
//     Loop();
// }
//
// function Loop ()
// {
//     requestAnimationFrame(Loop);
//
//     var now = Date.now();
//     deltaTime = now - time;
//     if (deltaTime > 1000) // si el tiempo es mayor a 1 seg: se descarta
//         deltaTime = 0;
//     time = now;
//
//     frames++;
//     acumDelta += deltaTime;
//
//     if (acumDelta > 1000)
//     {
//         FPS = frames;
//         frames = 0;
//         acumDelta -= 1000;
//     }
//
//     // transform the deltaTime from miliseconds to seconds
//     deltaTime /= 1000;
//
//     // update the input data
//     input.update();
//
//     // Game logic -------------------
//     Update();
//
//     // Draw the game ----------------
//     Draw();
//
//     // reset input data
//     input.postUpdate();
// }
//
// function Update ()
// {
//
//     // update physics
//     // Step(timestep , velocity iterations, position iterations)
//     world.Step(deltaTime, 8, 3);
//     world.ClearForces();
//
//     // player logic
//     if (input.isKeyPressed(KEY_LEFT))
//         player.moveLeft = true;
//
//     if (input.isKeyPressed(KEY_RIGHT))
//         player.moveRight = true;
//
//     if (input.isKeyPressed(KEY_UP))
//         player.Jump();
//
//     // player update
//     player.Update(deltaTime);
//
//     // camera update
//     camera.Update(deltaTime);
// }
//
// function Draw ()
// {
//     // clean the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//     // draw the background (with the parallax)
//     background.Draw(ctx);
//
//     // camera transform: translate
//     ctx.save();
//     ctx.translate(-camera.position.x, -camera.position.y);
//
//     // draw the box2d world
//     DrawWorld(world);
//
//     // draw the platforms
//     for (var i = 0; i < floors.length; i++)
//         floors[i].Draw(ctx);
//
//     // draw the player
//     player.Draw(ctx);
//
//     // camera transform: restore
//     ctx.restore();
//
//     // draw the player score
//     ctx.fillStyle = "white";
//     ctx.font = "26px Comic Sans MS";
//     ctx.fillText('Score: ' + player.score, 660, 24);
//
//     // draw the FPS
//     ctx.fillStyle = "white";
//     ctx.font = "10px Arial";
//     ctx.fillText('FPS: ' + FPS, 10, 10);
//     ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 10, 20);
// }
//
// function DrawWorld (world)
// {
//     // Transform the canvas coordinates to cartesias coordinates
//     ctx.save();
//     ctx.translate(0, canvas.height);
//     ctx.scale(1, -1);
//     world.DrawDebugData();
//     ctx.restore();
// }
