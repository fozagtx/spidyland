import { Scene } from "phaser";

export class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor(0x040007);

        this.add.rectangle(0, 0, width, height, 0x040007)
            .setOrigin(0, 0)
            .setDepth(-2);

        this.add.circle(width - 140, 90, 60, 0xffe17a)
            .setAlpha(0.8)
            .setDepth(-1);

        this.add.rectangle(
            0,
            height / 2,
            width,
            150,
            0x280a35
        ).setAlpha(0.88).setOrigin(0, 0.5);
        this.add.rectangle(
            0,
            height / 2 + 95,
            width,
            78,
            0x571b26
        ).setAlpha(0.92).setOrigin(0, 0.5);

        const leftPumpkin = this.add.image(width * 0.2, height / 2 + 110, "pumpkin")
            .setOrigin(0.5, 1)
            .setScale(1.2)
            .setDepth(1);
        const rightPumpkin = this.add.image(width * 0.8, height / 2 + 110, "pumpkin")
            .setOrigin(0.5, 1)
            .setScale(1.2)
            .setFlipX(true)
            .setDepth(1);

        this.tweens.add({
            targets: leftPumpkin,
            alpha: { from: 0.75, to: 1 },
            duration: 1600,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: rightPumpkin,
            alpha: { from: 0.75, to: 1 },
            duration: 1400,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1,
            delay: 260
        });

        const logo_game = this.add.bitmapText(
            width / 2,
            height / 2 - 10,
            "knighthawks",
            "HAUNTED\nREVENGE",
            52,
            1
        );
        logo_game.setOrigin(0.5, 0.5);
        logo_game.setTint(0xffd35a);
        logo_game.postFX.addShine();

        const tagline = this.add.bitmapText(
            width / 2,
            height / 2 + 60,
            "pixelfont",
            "SURVIVE THE SPOOKY SKY",
            18
        ).setOrigin(0.5, 0.5);
        tagline.setTint(0xfff1c7);

        const start_msg = this.add.bitmapText(
            width / 2,
            height / 2 + 110,
            "pixelfont",
            "CLICK TO START",
            24
        ).setOrigin(0.5, 0.5);
        start_msg.setTint(0xff8f3f);

        this.tweens.add({
            targets: start_msg,
            alpha: 0,
            duration: 800,
            ease: (value) => Math.abs(Math.round(value)),
            yoyo: true,
            repeat: -1
        });

        this.input.on("pointerdown", () => {
            this.game.events.emit("start-game");
        });
    }
}
