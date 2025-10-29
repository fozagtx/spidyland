import { Scene } from "phaser";

export class SplashScene extends Scene {

    constructor() {
        super("SplashScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);   
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor(0x05000b);

        this.add.rectangle(0, 0, width, height, 0x05000b)
            .setOrigin(0, 0);

        this.add.circle(width - 160, 110, 60, 0xffe78d)
            .setAlpha(0.8);

        const logo = this.add.image(width / 2, height / 2, "logo");
        logo.setTint(0xffc06b);
        const fx = logo.postFX.addShine(1, .2, 5);

        const pumpkin = this.add.image(width / 2, height / 2 + 130, "pumpkin")
            .setOrigin(0.5, 1)
            .setScale(1.3);

        this.tweens.add({
            targets: pumpkin,
            scale: { from: 1.28, to: 1.34 },
            duration: 1400,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1
        });

        const sparks = this.add.particles("flares");
        sparks.createEmitter({
            x: { min: width / 2 - 80, max: width / 2 + 80 },
            y: height / 2 + 40,
            lifespan: 1800,
            speedY: { min: -40, max: -10 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.5, end: 0 },
            frequency: 200,
            blendMode: "ADD"
        });

        const label = this.add.bitmapText(width / 2, height / 2 + 200, "pixelfont", "HALLOWEEN SPECIAL", 18)
            .setOrigin(0.5, 0.5)
            .setTint(0xfff1c7);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const main_camera = this.cameras.main.fadeOut(1000, 0, 0, 0);
                // Fadeout complete
                main_camera.once("camerafadeoutcomplete", () => {
                    this.scene.start("MainScene");
                });
            }
        });
    }

}
