// main.js

class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: "GameScene" });
    }
  
    preload() {
      // Create circular texture for controlled player
      let gfx = this.make.graphics({ x: 0, y: 0, add: false });
      gfx.fillStyle(0x00ff00, 1);
      gfx.fillCircle(16, 16, 16);
      gfx.lineStyle(2, 0xffffff, 1);
      gfx.strokeCircle(16, 16, 16);
      gfx.generateTexture("player", 32, 32);
  
      // Create circular texture for AI opponent
      gfx.clear();
      gfx.fillStyle(0xff0000, 1);
      gfx.fillCircle(16, 16, 16);
      gfx.lineStyle(2, 0xffffff, 1);
      gfx.strokeCircle(16, 16, 16);
      gfx.generateTexture("ai", 32, 32);
  
      // Create arrow texture (10x3 rectangle)
      gfx.clear();
      gfx.fillStyle(0xff0000, 1);
      gfx.fillRect(0, 0, 10, 3);
      gfx.generateTexture("arrow", 10, 3);
    }
  
    create() {
      // Create a ground platform spanning the width of the device
      const groundHeight = 40;
      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(this.scale.width / 2, this.scale.height - groundHeight / 2, null)
        .setDisplaySize(this.scale.width, groundHeight)
        .setOrigin(0.5)
        .refreshBody();
  
      // Create groups for players and arrows
      this.playersGroup = this.add.group();
      this.arrows = this.physics.add.group();
  
      // Create controlled player
      this.player = new Player(this, 100, this.scale.height - groundHeight - 100, "player");
      this.playersGroup.add(this.player.sprite);
      this.player.sprite.label = this.add.text(0, 0, "Player", { fontSize: "14px", fill: "#fff" });
  
      // Create AI opponent for demo
      this.aiPlayer = new Player(this, this.scale.width - 100, this.scale.height - groundHeight - 100, "ai");
      this.playersGroup.add(this.aiPlayer.sprite);
      this.aiPlayer.sprite.label = this.add.text(0, 0, "AI", { fontSize: "14px", fill: "#fff" });
  
      // Set up collisions and overlaps
      this.physics.add.collider(this.player.sprite, this.platforms);
      this.physics.add.collider(this.aiPlayer.sprite, this.platforms);
      this.physics.add.collider(this.arrows, this.platforms, this.arrowHitPlatform, null, this);
      this.physics.add.overlap(this.arrows, this.playersGroup, this.arrowHitPlayer, null, this);
  
      // Input keys for movement and jumping
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      
      // Use Z key for arrow drawing (aiming mode)
      this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
      // Use arrow keys for adjusting aim angle
      this.cursors = this.input.keyboard.createCursorKeys();
  
      // Create a persistent graphics object for the aiming line
      this.aimLine = this.add.graphics();
  
      // Initialize aiming mode for player
      this
