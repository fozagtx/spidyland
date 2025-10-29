import { Scene } from "phaser";

export class GameOverScene extends Scene {
    end_points = 0;
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.end_points = data.points || 0;
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor(0x05000b);

        this.add.rectangle(0, 0, width, height, 0x05000b)
            .setOrigin(0, 0);

        this.add.circle(width - 140, 110, 60, 0xffdf82)
            .setAlpha(0.85)
            .setDepth(-1);

        this.add.rectangle(0, height - 220, width, 220, 0x190725)
            .setOrigin(0, 1)
            .setAlpha(0.88)
            .setDepth(-2);
        this.add.rectangle(0, height - 130, width, 150, 0x3b1423)
            .setOrigin(0, 1)
            .setAlpha(0.7)
            .setDepth(-1);

        this.add.image(0, height, "floor")
            .setOrigin(0, 1)
            .setTint(0x4a2114)
            .setAlpha(0.95);

        const embers = this.add.particles("flares");
        embers.setDepth(-1);
        embers.createEmitter({
            x: { min: 0, max: width },
            y: height - 120,
            lifespan: 2200,
            speedY: { min: -28, max: -8 },
            speedX: { min: -12, max: 12 },
            quantity: 1,
            frequency: 240,
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.42, end: 0 },
            blendMode: "ADD"
        });

        const leftPumpkin = this.add.image(width * 0.22, height - 18, "pumpkin")
            .setOrigin(0.5, 1)
            .setScale(1.25);
        const rightPumpkin = this.add.image(width * 0.78, height - 18, "pumpkin")
            .setOrigin(0.5, 1)
            .setScale(1.25)
            .setFlipX(true);

        this.tweens.add({
            targets: [leftPumpkin, rightPumpkin],
            alpha: { from: 0.7, to: 1 },
            duration: 1600,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1
        });

        // Rectangles to show the text
        this.add.rectangle(
            0,
            height / 2,
            width,
            140,
            0x2a0b35
        ).setAlpha(0.92).setOrigin(0, 0.5);
        this.add.rectangle(
            0,
            height / 2 + 110,
            width,
            90,
            0x611f26
        ).setAlpha(0.88).setOrigin(0, 0.5);

        const gameover_text = this.add.bitmapText(
            width / 2,
            height / 2 - 15,
            "knighthawks",
            "GAME\nOVER",
            62,
            1
        );
        gameover_text.setOrigin(0.5, 0.5);
        gameover_text.setTint(0xffd35a);
        gameover_text.postFX.addShine();

        this.add.bitmapText(
            width / 2,
            height / 2 + 70,
            "pixelfont",
            `YOUR POINTS: ${this.end_points}`,
            24
        ).setOrigin(0.5, 0.5).setTint(0xfff5d1);

        const restartText = this.add.bitmapText(
            width / 2,
            height / 2 + 120,
            "pixelfont",
            "CLICK TO RESTART",
            24
        ).setOrigin(0.5, 0.5).setTint(0xff8f3f);

        this.tweens.add({
            targets: restartText,
            alpha: { from: 1, to: 0.4 },
            duration: 900,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1
        });

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.input.on("pointerdown", () => {
                    this.scene.start("MainScene");
                });
            }
        });
    }
}
