export const ensureHalloweenAssets = (scene) => {
    createSpiderTextures(scene)
    createPumpkinTexture(scene)
}

const createSpiderTextures = (scene) => {
    if (scene.textures.exists("spider-walk-0")) {
        return
    }

    const swingValues = [-3, 3, -2, 2]
    const frameKeys = swingValues.map((swing, index) => {
        const key = `spider-walk-${index}`
        drawSpiderFrame(scene, key, swing)
        return key
    })

    if (!scene.anims.exists("spider-walk")) {
        scene.anims.create({
            key: "spider-walk",
            frames: frameKeys.map(key => ({ key })),
            frameRate: 8,
            repeat: -1
        })
    }
}

const drawSpiderFrame = (scene, key, swing) => {
    const width = 48
    const height = 36
    const centerX = 24
    const bodyY = 20
    const footY = height - 4

    const graphics = scene.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0x000000, 0)
    graphics.fillRect(0, 0, width, height)

    // Abdomen and thorax
    graphics.fillStyle(0x220a1f, 1)
    graphics.fillCircle(centerX + 6, bodyY + 1, 11)
    graphics.fillStyle(0x33122d, 1)
    graphics.fillCircle(centerX - 2, bodyY, 9)
    graphics.fillStyle(0x401739, 1)
    graphics.fillCircle(centerX - 8, bodyY + 1, 7)

    // Stripe highlight
    graphics.fillStyle(0x68244f, 0.7)
    graphics.fillEllipse(centerX + 4, bodyY + 1, 14, 6)

    // Eyes
    graphics.fillStyle(0xff6a4a, 1)
    graphics.fillCircle(centerX - 10, bodyY - 3, 2)
    graphics.fillCircle(centerX - 6, bodyY - 2, 2.2)

    // Legs
    graphics.lineStyle(3, 0x3a1031, 1)
    const legs = [
        { sx: centerX - 10, sy: bodyY + 3, ex: centerX - 22, ey: footY, dir: -1 },
        { sx: centerX - 6, sy: bodyY + 2, ex: centerX - 18, ey: footY - 2, dir: -1 },
        { sx: centerX - 2, sy: bodyY + 4, ex: centerX - 14, ey: footY, dir: -1 },
        { sx: centerX + 4, sy: bodyY + 4, ex: centerX + 18, ey: footY, dir: 1 },
        { sx: centerX + 8, sy: bodyY + 2, ex: centerX + 22, ey: footY - 2, dir: 1 },
        { sx: centerX + 12, sy: bodyY + 3, ex: centerX + 26, ey: footY, dir: 1 }
    ]

    legs.forEach((leg, legIndex) => {
        const sway = swing * (leg.dir === 1 ? (legIndex % 2 === 0 ? 1 : 0.6) : (legIndex % 2 === 0 ? 1 : 0.6))
        graphics.beginPath()
        graphics.moveTo(leg.sx, leg.sy)
        graphics.lineTo(leg.ex + sway * leg.dir, leg.ey)
        graphics.strokePath()
    })

    graphics.generateTexture(key, width, height)
    graphics.destroy()
}

const createPumpkinTexture = (scene) => {
    if (scene.textures.exists("pumpkin")) {
        return
    }

    const width = 36
    const height = 36
    const centerX = width / 2
    const groundY = height - 6
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false })

    graphics.fillStyle(0x000000, 0)
    graphics.fillRect(0, 0, width, height)

    graphics.fillStyle(0xff7c22, 1)
    graphics.fillEllipse(centerX, groundY - 5, 28, 20)
    graphics.fillStyle(0xffa23a, 0.9)
    graphics.fillEllipse(centerX, groundY - 5, 20, 18)

    graphics.lineStyle(2, 0xe36d1d, 1)
    const ridgeOffsets = [-6, -3, 0, 3, 6]
    ridgeOffsets.forEach(offset => {
        graphics.beginPath()
        graphics.moveTo(centerX + offset, groundY - 14)
        graphics.lineTo(centerX + offset, groundY + 2)
        graphics.strokePath()
    })

    graphics.fillStyle(0x2f5a22, 1)
    graphics.fillRect(centerX - 2, groundY - 18, 5, 7)
    graphics.fillTriangle(centerX + 3, groundY - 15, centerX + 8, groundY - 20, centerX + 6, groundY - 12)

    graphics.fillStyle(0x160a0a, 0.9)
    graphics.fillTriangle(centerX - 10, groundY - 12, centerX - 4, groundY - 6, centerX - 12, groundY - 6)
    graphics.fillTriangle(centerX + 10, groundY - 12, centerX + 4, groundY - 6, centerX + 12, groundY - 6)
    graphics.fillRect(centerX - 10, groundY - 4, 20, 4)
    graphics.fillRect(centerX - 6, groundY - 8, 4, 4)
    graphics.fillRect(centerX + 2, groundY - 8, 4, 4)

    graphics.generateTexture("pumpkin", width, height)
    graphics.destroy()
}
