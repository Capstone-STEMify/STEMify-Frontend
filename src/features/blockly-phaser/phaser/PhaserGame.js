import React, { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'

const PhaserGame = ({ code }) => {
  const gameInstanceRef = useRef(null);
  const gameSceneRef = useRef(null);

  useEffect(() => {
    const STEP_UNIT_SIZE = 50;
    const config = {
      type: Phaser.AUTO,
      width: 1000,
      height: 600,
      backgroundColor: '#242424',
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 600 }, debug: false }
      },
      scene: { preload, create }
    };
    function preload() {
      this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
      this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png');
      this.load.image('obstacle', 'https://labs.phaser.io/assets/sprites/block.png');
    }
    function create() {
      gameSceneRef.current = this;
      this.isExecuting = false;
      this.hasFailed = false;
      this.player = this.physics.add.sprite(100, 500, 'player');
      this.player.setCollideWorldBounds(true);
      this.bullets = this.physics.add.group();
      const obstacles = this.physics.add.staticGroup();
      this.physics.add.collider(this.player, obstacles, (player, obstacle) => {
        if (this.isExecuting && (player.body.blocked.left || player.body.blocked.right)) {
          this.hasFailed = true;
          player.setTint(0xff0000);
        }
      }, null, this);

      let lastObstacleX = 150;
      const numberOfObstacles = 4;
      for (let i = 0; i < numberOfObstacles; i++) {
        const distanceInSteps = Phaser.Math.Between(4, 7);
        const obstacleHeight = Phaser.Math.Between(2, 5);
        const distanceInPixels = distanceInSteps * STEP_UNIT_SIZE;
        const newObstacleX = lastObstacleX + distanceInPixels;
        const blockTexture = this.textures.get('obstacle');
        const blockHeight = blockTexture.getSourceImage().height;
        for (let j = 0; j < obstacleHeight; j++) {
          const y = config.height - (j * blockHeight) - (blockHeight / 2);
          obstacles.create(newObstacleX, y, 'obstacle');
        }
        const jumpSuggestion = obstacleHeight + 1;
        const textYJump = config.height - (obstacleHeight * blockHeight) - 30;
        this.add.text(newObstacleX, textYJump, `${jumpSuggestion}`, { fontSize: '24px', fill: '#FFFF00', fontStyle: 'bold' }).setOrigin(0.5);
        const textYMove = config.height - 25;
        const textXMove = lastObstacleX + (distanceInPixels / 2);
        this.add.text(textXMove, textYMove, `${distanceInSteps} bước`, { fontSize: '18px', fill: '#00FF00', fontStyle: 'bold' }).setOrigin(0.5);
        lastObstacleX = newObstacleX;
      }

      this.movePlayer = (pixelDistance) => {
        return new Promise(resolve => {
          if (this.hasFailed) return resolve();
          
          const SAFETY_MARGIN = 3; // 3 pixels
          const effectiveDistance = Math.abs(pixelDistance) > SAFETY_MARGIN
            ? Math.abs(pixelDistance) - SAFETY_MARGIN
            : 0;

          const speed = 250;
          if (effectiveDistance === 0) return resolve();

          const velocityX = pixelDistance > 0 ? speed : -speed;
          const duration = (effectiveDistance / speed) * 1000;

          this.player.setVelocityX(velocityX);

          this.time.delayedCall(duration, () => {
            if (this.player.body) {
              this.player.setVelocityX(0);
            }
            resolve();
          });
        });
      };
      
      this.shootBullet = () => {
        const bullet = this.bullets.create(this.player.x + 20, this.player.y, 'bullet');
        bullet.setVelocityX(300);
      };
    }
    gameInstanceRef.current = new Phaser.Game(config);
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!code || !gameSceneRef.current) return;
    const scene = gameSceneRef.current;
    const { player, shootBullet } = scene;
    const runCode = async () => {
      scene.isExecuting = true;
      scene.hasFailed = false;
      player.clearTint();
      const playerHeight = player.body.height;
      const groundY = scene.game.config.height - (playerHeight / 2);
      player.setPosition(100, groundY);
      player.setVelocity(0, 0);
      const lines = code.split('\n').filter(Boolean);
      for (const line of lines) {
        if (scene.hasFailed) {
          console.log("Thực thi dừng lại do va chạm!");
          break;
        }
        const scope = { scene, player, shootBullet };
        const func = new Function(...Object.keys(scope), `return (async () => { ${line} })();`);
        await func(...Object.values(scope));
        if (!line.includes('scene.movePlayer')) {
          await new Promise(res => setTimeout(res, 500));
        }
      }
      scene.isExecuting = false;
      console.log("Thực thi hoàn tất!");
    };
    runCode();
  }, [code]);

  return <div id='phaser-container' />;
};

export default PhaserGame;