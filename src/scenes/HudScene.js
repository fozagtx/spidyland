import { Scene } from "phaser";

// The HUD scene is the scene that shows the points and the remaining time.
export class HudScene extends Scene {
    
    remaining_time = 0;

    remaining_time_text;
    points_text;

    constructor() {
        super("HudScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.remaining_time = data.remaining_time;
    }

    create() {
        const { width } = this.scale;

        this.cameras.main.setBackgroundColor(0x05000b);

        this.add.rectangle(0, 0, width, 48, 0x1f0626)
            .setOrigin(0, 0)
            .setAlpha(0.65);

        this.points_text = this.add.bitmapText(46, 12, "pixelfont", "POINTS:0000", 24)
            .setTint(0xffd35a);
        this.remaining_time_text = this.add.bitmapText(width - 46, 12, "pixelfont", `REMAINING:${this.remaining_time}s`, 24)
            .setOrigin(1, 0)
            .setTint(0xff8f3f);

        const leftPumpkin = this.add.image(20, 24, "pumpkin")
            .setOrigin(0.5, 0.5)
            .setScale(0.6)
            .setAlpha(0.9);
        const rightPumpkin = this.add.image(width - 20, 24, "pumpkin")
            .setOrigin(0.5, 0.5)
            .setScale(0.6)
            .setAlpha(0.9);

        this.tweens.add({
            targets: [leftPumpkin, rightPumpkin],
            scale: { from: 0.58, to: 0.66 },
            duration: 1200,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1,
            delay: 200
        });
    }

    update_points(points) {
        this.points_text.setText(`POINTS:${points.toString().padStart(4, "0")}`);
    }

    update_timeout(timeout) {
        this.remaining_time_text.setText(`REMAINING:${timeout.toString().padStart(2, "0")}s`);
    }
}
