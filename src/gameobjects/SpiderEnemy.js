import { Physics, Math as PhaserMath } from "phaser"

const BASE_SPEED = 80
const SPEED_STEP = 12
const MAX_SPEED = 220
const MAX_HP = 3
const BITE_COOLDOWN = 750

export class SpiderEnemy extends Physics.Arcade.Sprite {
    scene
    baseY
    speed = BASE_SPEED
    hp = MAX_HP
    lastBiteTime = 0

    constructor(scene) {
        super(scene, scene.scale.width + 60, scene.scale.height - 80, "spider-walk-0")
        this.scene = scene
        this.baseY = scene.scale.height - 88

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setOrigin(0.5, 1)
        this.setScale(2)
        this.setDepth(3)
        this.body.setAllowGravity(false)
        this.body.setSize(28, 16, true)
        this.body.setOffset(10, 16)

        this.setActive(false)
        this.setVisible(false)
    }

    start() {
        this.speed = BASE_SPEED
        this.hp = MAX_HP
        this.spawn(this.scene.scale.width + PhaserMath.Between(40, 160))
    }

    spawn(x) {
        this.enableBody(true, x, this.baseY, true, true)
        this.setVelocityX(-this.speed)
        this.setActive(true)
        this.setVisible(true)
        this.alpha = 0
        this.play("spider-walk", true)
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 240
        })
    }

    damage() {
        if (!this.active) {
            return false
        }

        this.hp -= 1
        this.setTint(0xff9158)
        this.scene.time.delayedCall(140, () => {
            this.clearTint()
        })

        if (this.hp <= 0) {
            this.handleDefeat()
            return true
        }

        const boost = 1 + (MAX_HP - this.hp) * 0.15
        this.setVelocityX(-this.speed * boost)
        return false
    }

    handleDefeat() {
        const nextSpeed = PhaserMath.Clamp(this.speed + SPEED_STEP, BASE_SPEED, MAX_SPEED)
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 2.3,
            scaleY: 1.6,
            angle: PhaserMath.Between(-10, 10),
            duration: 220,
            ease: "Sine.In",
            onComplete: () => {
                this.disableBody(true, true)
                this.alpha = 1
                this.setScale(2)
                this.angle = 0
                this.speed = nextSpeed
                this.hp = MAX_HP
                this.scene.time.delayedCall(180, () => {
                    this.spawn(this.scene.scale.width + PhaserMath.Between(80, 200))
                })
            }
        })
    }

    bite() {
        if (!this.active) {
            return false
        }

        const now = this.scene.time.now
        if (now - this.lastBiteTime < BITE_COOLDOWN) {
            return false
        }
        this.lastBiteTime = now

        this.scene.tweens.add({
            targets: this,
            scaleX: 2.1,
            duration: 80,
            yoyo: true
        })
        return true
    }

    update() {
        if (!this.active) {
            return
        }

        if (this.x < -80) {
            this.speed = PhaserMath.Clamp(this.speed + SPEED_STEP * 0.5, BASE_SPEED, MAX_SPEED)
            this.hp = MAX_HP
            this.spawn(this.scene.scale.width + PhaserMath.Between(60, 180))
            return
        }

        const targetY = this.baseY + Math.sin(this.scene.time.now / 280) * 2
        this.y = PhaserMath.Linear(this.y, targetY, 0.12)
    }
}
