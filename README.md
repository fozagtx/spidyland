# Spidyland - Phaser Edition

Spidyland has been rebuilt with [Phaser 3](https://phaser.io/) to deliver a fast-paced side-scrolling space shooter. Pilot your ship, avoid incoming fire, and shoot down the enemy to rack up as many points as possible before the timer runs out.

![screenshot](screenshot.png)

## Getting started

### Install dependencies

Use whichever package manager you prefer:

```sh
pnpm install
# or
npm install
```

### Run the development server

```sh
pnpm dev
# or
npm run dev
```

### Build for production

```sh
pnpm build
# or
npm run build
```

### Preview the production build

```sh
pnpm preview
# or
npm run preview
```

## Project structure

- `src/main.js` bootstraps the Phaser game and wires up all scenes.
- `src/preloader.js` loads textures, fonts, and animations before the game starts.
- `src/scenes/*` contains the different game scenes (splash, menu, gameplay, HUD, and game over).
- `src/gameobjects/*` holds the player, enemy, and projectile classes.
- `public/assets` stores art assets and bitmap font data used by the game.

## Halloween event

- Added a walking spider foe that prowls the haunted runway and lunges at the player.
- Refreshed every scene with pumpkins, moonlit skies, ember particles, and Halloween colors.
- Player HUD, menus, and splash screen now lean into the seasonal theme.

Enjoy battling through Spidyland in its new Phaser-powered form!
