import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { BlueEnemy } from "../gameobjects/BlueEnemy";
import { SpiderEnemy } from "../gameobjects/SpiderEnemy";

export class MainScene extends Scene {
    player = null;
    enemy_blue = null;
    spider_enemy = null;
    cursors = null;

    points = 0;
    game_over_timeout = 20;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points
        this.points = 0;
        this.game_over_timeout = 20;
    }

    create() {
        this.createHalloweenAmbience();

        // Player
        this.player = new Player({ scene: this });
        this.player.setDepth(4);
        this.player.setTint(0xfff3d9);
        this.player.propulsion_fire.setDepth(3);
        this.player.propulsion_fire.setTint(0xffa64d);

        // Enemies
        this.enemy_blue = new BlueEnemy(this);
        this.enemy_blue.setDepth(4);
        this.enemy_blue.setTint(0xb9c4ff);
        this.spider_enemy = new SpiderEnemy(this);

        // Cursor keys 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.on("down", () => {
            this.player.fire();
        });
        this.input.on("pointerdown", (pointer) => {
            this.player.fire(pointer.x, pointer.y);
        });

        // Overlap enemy with bullets
        this.physics.add.overlap(this.player.bullets, this.enemy_blue, (_enemy, bullet) => {
            bullet.destroyBullet();
            this.enemy_blue.damage(this.player.x, this.player.y);
            this.adjustPoints(10);
        });

        this.physics.add.overlap(this.player.bullets, this.spider_enemy, (spider, bullet) => {
            bullet.destroyBullet();
            const defeated = spider.damage();
            this.adjustPoints(defeated ? 18 : 6);
        });

        this.physics.add.overlap(this.spider_enemy, this.player, (spider) => {
            if (spider.bite()) {
                this.cameras.main.flash(220, 255, 118, 40, false);
                this.cameras.main.shake(160, 0.006);
                this.adjustPoints(-8);
            }
        });

        // Overlap player with enemy bullets
        this.physics.add.overlap(this.enemy_blue.bullets, this.player, (_player, bullet) => {
            bullet.destroyBullet();
            this.cameras.main.shake(100, 0.01);
            this.cameras.main.flash(300, 255, 60, 60, false);
            this.adjustPoints(-10);
        });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.player.start();
            this.enemy_blue.start();
            this.spider_enemy.start();

            // Game Over timeout
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    if (this.game_over_timeout === 0) {
                        // You need remove the event listener to avoid duplicate events.
                        this.game.events.removeListener("start-game");
                        // It is necessary to stop the scenes launched in parallel.
                        this.scene.stop("HudScene");
                        this.scene.start("GameOverScene", { points: this.points });
                    } else {
                        this.game_over_timeout--;
                        this.scene.get("HudScene").update_timeout(this.game_over_timeout);
                    }
                }
            });
        });
    }

    createHalloweenAmbience() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor(0x05000b);

        this.add.rectangle(0, 0, width, height, 0x05000b)
            .setOrigin(0, 0)
            .setDepth(-10);

        this.add.rectangle(0, height - 220, width, 220, 0x14031d)
            .setOrigin(0, 1)
            .setAlpha(0.82)
            .setDepth(-9);

        this.add.rectangle(0, height - 140, width, 160, 0x2d0a1f)
            .setOrigin(0, 1)
            .setAlpha(0.7)
            .setDepth(-8);

        this.add.circle(width - 120, 110, 78, 0xffc970)
            .setAlpha(0.2)
            .setDepth(-9);
        const moon = this.add.circle(width - 120, 110, 56, 0xfff3bc)
            .setDepth(-8);
        this.tweens.add({
            targets: moon,
            scale: { from: 1, to: 1.04 },
            duration: 2000,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1
        });

        this.add.image(0, height, "floor")
            .setOrigin(0, 1)
            .setDepth(-5)
            .setTint(0x4a2114)
            .setAlpha(0.95);

        this.add.rectangle(0, height - 72, width, 120, 0x5c1d26)
            .setOrigin(0, 1)
            .setAlpha(0.35)
            .setDepth(-4);

        const embers = this.add.particles("flares");
        embers.setDepth(-6);
        embers.createEmitter({
            x: { min: 0, max: width },
            y: height - 110,
            lifespan: 2400,
            speedY: { min: -30, max: -8 },
            speedX: { min: -12, max: 12 },
            quantity: 1,
            frequency: 220,
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.4, end: 0 },
            blendMode: "ADD"
        });

        for (let i = 1; i <= 4; i++) {
            const pumpkin = this.add.image((width / 5) * i, height - 36, "pumpkin")
                .setOrigin(0.5, 1)
                .setDepth(-3);
            this.tweens.add({
                targets: pumpkin,
                alpha: { from: 0.72, to: 1 },
                duration: 1500,
                ease: "Sine.InOut",
                yoyo: true,
                repeat: -1,
                delay: i * 120
            });
        }
    }

    adjustPoints(amount) {
        this.points += amount;
        if (this.scene.isActive("HudScene")) {
            this.scene.get("HudScene").update_points(this.points);
        }
    }

    update() {
        this.player.update();
        this.enemy_blue.update();
        this.spider_enemy.update();

        // Player movement entries
        if (this.cursors.up.isDown) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown) {
            this.player.move("down");
        }

    }
}
