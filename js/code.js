
//var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

// images references
var playerImg, powerUpImg, backgroundImg, playerBulletImg, enemyBulletImg, enemy1Img, gameOverImg;

// game camera
var camera;
var enemyCandency = 0;
var powerUpCandency = 0;

// game objects
var powerUps = [];
var enemies = [];

// game over bool
var gameOver = false;

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

    //canvas = document.getElementById("my_canvas");

    if (canvas.getContext)
    {
        ctx = canvas.getContext('2d');

        backgroundImg = new Image();
        backgroundImg.src = "./media/background.png";

        powerUpImg = new Image();
        powerUpImg.src = "./media/powerUp.png";

        gameOverImg = new Image();
        gameOverImg.src = "./media/gameOver.png";

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
    //PreparePhysics(ctx);

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
  if (!gameOver)
  {
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
    if (true && (Date.now() - enemyCandency) > 5000)
    {
      for (var i = 0; i < 3; i++)
      {
        var enemytemp = NewEnemy({x: Math.floor((Math.random() * 380) + 120), y: -100, score: 100});
        enemytemp.Start();
        enemies.push(enemytemp);
        enemyCandency = Date.now();
      }
    }

    //create a Power-Up
    if (true && (Date.now() - powerUpCandency) > 22500)
    {
      powerUp = NewPowerUp({x: Math.floor((Math.random() * 400) + 50), y: - 100, score: 50});
      powerUp.Start();
      powerUps.push(powerUp);
      powerUpCandency = Date.now();
    }

    // Enemies update
    for (var i = 0; i < enemies.length; i++)
    {
      enemies[i].Update(deltaTime);

      // CheckCollision Enemies - PlayerBullets
      for (var j = 0; j < player.bullets.length; j++)
      {
        if(enemies[i].CheckCollision(player.bullets[j].box))
        {
          enemies[i].isDead = true;
          player.bullets[j].isDead = true;
        }

        // Check Player Bullets out of the canvas
        if (player.bullets[j].position.y <= 0)
        {
          player.bullets[j].isDead = true;
        }
      }

      // Check Enemy out of the canvas
      if (enemies[i].position.y >= canvas.height + 150)
      {
        enemies[i].isDead = true;
      }

      // Enemy Bullets update
      for (var j = 0; j < enemies[i].bullets.length; j++)
      {
        enemies[i].bullets[j].Update(deltaTime);

        // CheckCollision Player - EnemyBullets
        if(player.CheckCollision(enemies[i].bullets[j].box))
        {
          gameOver = true;
          enemies[i].bullets[j].isDead = true;
        }

        // Check Enemy Bullets out of the canvas
        if (enemies[i].bullets[j].position.y >= canvas.height)
        {
          enemies[i].bullets[j].isDead = true;
        }
      }

      // Destroy Enemy Bullets
      for (var j = 0; j < enemies[i].bullets.length; j++)
      {
        if (enemies[i].bullets[j].isDead)
        {
          enemies[i].bullets.splice(j, 1);
        }
      }
        // Destroy Enemy
        if (enemies[i].isDead)
        {
          enemies.splice(i, 1);
          break;
        }
    }

    // Power-Ups update
    for (var i = 0; i < powerUps.length; i++)
        powerUps[i].Update(deltaTime);

    // Player Bullets update
    for (var i = 0; i < player.bullets.length; i++)
    {
      player.bullets[i].Update(deltaTime);

      // Destroy Player Bullets
      if (player.bullets[i].isDead)
      {
        player.bullets.splice(i, 1);
      }
    }

    // Camera update
    //camera.Update(deltaTime);
  }
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
    //DrawWorld(world);

    // draw the Player
    player.Draw(ctx);

    // draw Power-Ups
    for (var i = 0; i < powerUps.length; i++)
        powerUps[i].Draw(ctx);


    //draw Player Bullets
    for (var i = 0; i < player.bullets.length; i++)
      player.bullets[i].Draw(ctx);

    // draw Enemies
    for (var i = 0; i < enemies.length; i++)
    {
      enemies[i].Draw(ctx);

      // draw Bullets Enemies
      for (var j = 0; j < enemies[i].bullets.length; j++)
      {
        enemies[i].bullets[j].Draw(ctx);
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

    if (gameOver)
    {
      ctx.save();
      ctx.drawImage(gameOverImg, -10, 50);
      ctx.restore();
    }
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
