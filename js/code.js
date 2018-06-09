var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

// images references
var playerImg, powerUpImg, backgroundImg, playerBulletImg, enemyBulletImg, enemyImg, gameOverImg;

// game camera
var camera;

// candencies
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

        enemyImg = new Image();
        enemyImg.src = "./media/enemy.PNG";

        playerImg = new Image();
        playerImg.src = "./media/player.png";
        playerImg.onload = Start();
    }
}

function Start ()
{
    // setup keyboard events
    SetupKeyboardEvents();

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
  if (!gameOver && !player.isDead)
  {
    UpdatePlayerInput();
    CreateEnemies();
    CreatePowerUps();
    UpdateBackground();
    UpdatePlayer();
    UpdatePlayerBullets();
    UpdateEnemies();
    UpdatePoweUps();
  }

  else if (gameOver && player.isDead)
  {
    UpdateGameOver();
  }
}

function Draw ()
{
  DrawBackground();
  DrawPlayer();
  DrawPlayerBullets();
  DrawEnemies();
  DrawPoweUps();
  DrawFPS();
  DrawScore();

  if (gameOver)
  {
    DrawGameOver();
  }
}

function CreateEnemies ()
{
  if ((Date.now() - enemyCandency) > 5000)
  {
    for (var i = 0; i < Math.floor((Math.random() * 5) + 3); i++)
    {
      var enemytemp = NewEnemy({x: Math.floor((Math.random() * 380) + 120), y: -100, score: 100});
      enemytemp.Start();
      enemies.push(enemytemp);
      enemyCandency = Date.now();
    }
  }
}

function CreatePowerUps ()
{
  if ((Date.now() - powerUpCandency) > 22500)
  {
    powerUp = NewPowerUp({x: Math.floor((Math.random() * 400) + 50), y: - 100, score: 50});
    powerUp.Start();
    powerUps.push(powerUp);
    powerUpCandency = Date.now();
  }
}

function UpdatePlayerInput ()
{
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
}

function UpdateBackground ()
{
  background.Update(deltaTime);
}

function UpdatePlayer ()
{
  player.Update(deltaTime);
}

function UpdatePlayerBullets ()
{
  for (var i = 0; i < player.bullets.length; i++)
  {
    player.bullets[i].Update(deltaTime);
    CheckPlayerBulletsOutOfTheCanvas(player.bullets[i]);
    DestroyPlayerBullets(player.bullets[i]);
  }
}

function UpdateEnemies ()
{
  for (var i = 0; i < enemies.length; i++)
  {
    enemies[i].Update(deltaTime);
    CheckCollisionEnemiesPlayerBullets(enemies[i]);
    CheckEnemyOutOfTheCanvas(enemies[i]);
    UpdateEnemiesBullets(enemies[i]);

    if (enemies[i].isDead)
    {
      DestroyEnemies();
      break;
    }
  }
}

function UpdateEnemiesBullets (enemies)
{
  for (var j = 0; j < enemies.bullets.length; j++)
  {
    enemies.bullets[j].Update(deltaTime);
    CheckEnemyBulletsOutOfTheCanvas(enemies.bullets[j]);
    CheckCollisionPlayerEnemiesBullets(enemies.bullets[j]);
    DestroyEnemiesBullets(enemies, enemies.bullets[j]);
  }
}

function UpdatePoweUps ()
{
  for (var i = 0; i < powerUps.length; i++)
      powerUps[i].Update(deltaTime);
}

function UpdateGameOver ()
{
  player.sound.play();
  player.position.y = -500
  player.isDead = false;
  background.sound.pause();
}

function CheckEnemyOutOfTheCanvas (enemy)
{
  if (enemy.position.y >= canvas.height + 200)
  {
    enemy.isDead = true;
  }
}

function CheckPlayerBulletsOutOfTheCanvas (bullet)
{
  if (bullet.position.y <= 0)
  {
    bullet.isDead = true;
  }
}

function CheckEnemyBulletsOutOfTheCanvas (bullet)
{
  if (bullet.position.y >= canvas.height)
  {
    bullet.isDead = true;
  }
}

function CheckCollisionEnemiesPlayerBullets (enemy)
{
  for (var i = 0; i < player.bullets.length; i++)
  {
    if(enemy.CheckCollision(player.bullets[i].box))
    {
      enemy.isDead = true;
      player.bullets[i].isDead = true;
      enemy.sound.play();
      player.score += enemy.score;
    }
  }
}

function CheckCollisionPlayerEnemiesBullets (enemyBullet)
{
  if(player.CheckCollision(enemyBullet.box))
  {
    player.isDead = true;
    gameOver = true;
    enemyBullet.isDead = true;
  }
}

function DestroyEnemies ()
{
  enemies.splice(0, 1);
}

function DestroyPlayerBullets (bullet)
{
  if (bullet.isDead)
  {
    player.bullets.splice(0, 1);
  }
}

function DestroyEnemiesBullets (enemy, bullet)
{
  if (bullet.isDead)
  {
    enemy.bullets.splice(0, 1);
  }
}

function DrawBackground ()
{
  background.Draw(ctx);
}

function DrawPlayer ()
{
  player.Draw(ctx);
}

function DrawPlayerBullets ()
{
  for (var i = 0; i < player.bullets.length; i++)
    player.bullets[i].Draw(ctx);
}

function DrawEnemies ()
{
  for (var i = 0; i < enemies.length; i++)
  {
    enemies[i].Draw(ctx);
    DrawEnemiesBullets(enemies[i]);
  }
}

function DrawEnemiesBullets (enemy)
{
  for (var i = 0; i < enemy.bullets.length; i++)
  {
    enemy.bullets[i].Draw(ctx);
  }
}

function DrawPoweUps ()
{
  for (var i = 0; i < powerUps.length; i++)
      powerUps[i].Draw(ctx);
}

function DrawFPS ()
{
  var FPSPosition = {x: 2, y: 10};
  var deltaTimePosition = {x: 2, y: 20};
  ctx.fillStyle = "white";
  ctx.font = "10px Arial";
  ctx.fillText('FPS: ' + FPS, FPSPosition.x, FPSPosition.y);
  ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), deltaTimePosition.x, deltaTimePosition.y);
}

function DrawScore ()
{
  var scorePosition = {x: canvas.width / 2.6, y: 30};
  ctx.fillStyle = "white";
  ctx.font = "26px Comic Sans MS";
  ctx.fillText('Score: ' + player.score, scorePosition.x, scorePosition.y);
}

function DrawGameOver ()
{
  var gameOverPosition = {x: -10, y: 50};
  ctx.save();
  ctx.drawImage(gameOverImg, gameOverPosition.x, gameOverPosition.y);
  ctx.restore();
}
