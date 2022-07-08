//our code is here
kaboom({
  fullscreen: true,
  clearColor: [0.2, 0.7, 1, 1], // rgba
  global: true,
  scale: 2,
});

loadRoot("./sprites/");

loadSprite("background", "background.png");
loadSprite("mario", "mario.png");
loadSprite("dino", "dino.png");
loadSprite("peach", "princes.png");
loadSprite("block", "block.png");

loadSprite("mushroom", "mushroom.png");
loadSprite("coin", "star.png");
loadSprite("evil", "evil_mushroom.png");
loadSprite("surpriseC", "surprise.png");
loadSprite("surpriseM ", "surprise.png");

loadSprite("unboxed", "unboxed.png");
loadSprite("suprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("gold", "coin.png");

loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
let score = 0;
scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    " =           ==  h  ==        p              $                  ===           ====                                ",
    " =             =====          ====        =====                                                                   ",
    " =                                          =r=r=r        q            $             ==  ==                          ",
    " =           e           ===                                                                     ===     =           ",
    " =          ===                   q           ==rr=       q                                                            ",
    " =               q           ==     =r=               r=r=r=r=           q                   q           ===           ",
    " =      e        ===      e                                         ===      q          ===            ====         ",
    " =      ==              ==y=                   ==y=              q                 ==                               ",
    " =            e                                                ==y=          ==                       ====            ",
    " =        e    = =                = =       ==y=          $   $                                                        ",
    " =       ====      e    = e=                            ======            ==        $                                ",
    " =            P            =                  q      e    e   $                                                   ",
    " =     ==       ==                 e             ==r== ==r== =r==        ==r==                                      ",
    " =                       q    ====               e                        =r==                                      ",
    " =                   y r     ===               ====                                                              ",
    " =                                                                            ==        e   e                      ",
    " =         e                q  e  q   q        e       =            q           e        ======                   ",
    " =============  ==== =   ===============   ========    ====================  ====  =====    ======= =             ",
    " ========================================================================================================         ",
  ];

  const mapStyle = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    $: [sprite("coin"), solid(), body(), "coin"],
    p: [sprite("peach")],
    q: [sprite("gold"), solid(), body(), "gold"],
    h: [sprite("pipe"), solid()],
    e: [sprite("evil"), solid(), body(), "evil"],
    r: [sprite("suprise"), solid(), "coin-surprise"],

    l: [sprite("unboxed"), solid(), "unboxed"],
    y: [sprite("suprise"), solid(), "mushroom-surprise"],
    w: [sprite("mushroom"), solid(), "mushroom", body()],
  };

  const gameLevel = addLevel(map, mapStyle);
  const backgournd = add([
    sprite("background"),
    layer("bg"),
    pos(height() / 2, width() / 2),
    origin("center"),
    scale(3),
  ]);
  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);
  const scoreLabel = add([text("score:" + score)]);

  keyDown("d", () => {
    player.move(120, 0);

    // player.sprite = sprite('coin')
  });
  keyDown("a", () => {
    player.move(-120, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(400);
    }
  });
  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });

  player.collides("gold", (obj) => {
    destroy(obj);
    score += 2;
    scoreLabel.text = "score: " + score;
  });

  player.collides("coin", (obj) => {
    destroy(obj);
    score+= 5;
  });

  player.collides("mushroom", (obj) => {
    destroy(obj);
    player.biggify(7);
  });

  action("evil", (obj) => {
    obj.move(-20, 0);
  });

  action("mushroom", (obj) => {
    obj.move(20, 0);
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      destroy(obj);
      gameLevel.spawn("l", obj.gridPos);
      gameLevel.spawn("q", obj.gridPos.sub(0, 1));
    }
    if (obj.is("mushroom-surprise")) {
      destroy(obj);
      gameLevel.spawn("l", obj.gridPos);
      gameLevel.spawn("w", obj.gridPos.sub(0, 1));
    }
  });

  const fall_down = 700;

  player.action((obj) => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    backgournd.use(pos(player.pos));
    if (player.pos.y >= fall_down) {
      go("lose");
    }
  });

  let isJumping = false;
  player.collides("evil", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      destroy(player);
      go("lose");
    }
  });
  player.action(() => {
    isJumping = !player.grounded();
  });
});

scene("lose", () => {
 
    add([
        
    text("GAME OVER\nTry again", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
    score=0
  ]);
  add([
    text("press space to restart", 20),
    origin("center"),
    pos(width() / 2, height() / 2 + 200),
  ]);

  keyDown("space", () => {
    go("game");
  });
});
scene("win", () => {
  add([
    text("you won\n Great Job"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

start("game");
