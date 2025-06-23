import React, { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'

const PhaserGame = ({ code }) => {
  const gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true)
    }

    let player, bullets

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      backgroundColor: '#242424',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload,
        create,
        update
      }
    }

    function preload() {
      this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png')
      this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png')
    }

    function create() {
      player = this.physics.add.sprite(100, 300, 'player')
      player.setCollideWorldBounds(true)

      bullets = this.physics.add.group()

      const shootBullet = () => {
        const bullet = bullets.create(player.x + 20, player.y, 'bullet')
        bullet.setVelocityX(300)
      }

      // ✨ Tách code thành dòng và chạy tuần tự
      try {
        const lines = code.split('\n').filter(Boolean)

        lines.forEach((line, index) => {
          setTimeout(() => {
            const scope = { player, shootBullet }
            const func = new Function(...Object.keys(scope), line)
            func(...Object.values(scope))
          }, index * 500) // Delay 500ms mỗi bước
        })
      } catch (e) {
        console.error('Error executing code:', e)
      }
    }

    function update() {}

    gameRef.current = new Phaser.Game(config)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [code])

  return <div id='phaser-container' />
}

export default PhaserGame
