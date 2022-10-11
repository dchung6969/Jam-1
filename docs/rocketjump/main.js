//npm run watch_games
//http://localhost:4000/?rocketjump

title = "Rocket Jump";

description = `
   Dodge 
the arrows.
`;

characters = [
`
  l
 lll
l l l
  l  
 l l
 l l  
`,`
 gg
 GG
 gg
 gg
 gg 
`,  `
    l
   l
lllll
   l
    l
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 150,
	STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
	GRAVITY: 1.35,
	ENEMY_MIN_BASE_SPEED: 1.0,
	ENEMY_MAX_BASE_SPEED: 1.5
};

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	//seed: 1,
	isPlayingBgm: true
};

/**
 * @typedef {{
 * pos: Vector,
 * jumpsLeft: number,
 * inAir: boolean
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

function update() {
	if (!ticks) {
		player = {
			pos: vec(15, G.HEIGHT - 20),
			jumpsLeft: 2,
			inAir: false
		};
		enemies = [];
		waveCount = 0;
		currentEnemySpeed = 0;
	}
	color("blue");
	box(0, G.HEIGHT, G.WIDTH * 2, 31);

	if (enemies.length === 0) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < rnd(2,6); i++) {
            const posX = rnd(80, G.WIDTH);
            const posY = 130;//rnd(20, G.HEIGHT - 20);
            enemies.push({ pos: vec(posX, posY) })
        }
    }

	remove(enemies, (e) => {
        e.pos.x -= currentEnemySpeed;
        color("black");

		const isCollidingWithPlayer = char("c", e.pos).isColliding.char.b;
		if (isCollidingWithPlayer) {
			end();
			play("powerUp");
		}

        return (e.pos.x < 0);
    });

	//jump
	if (input.isJustPressed) {
		//checks if player is on ground
		if (!player.inAir) {
			player.inAir = true;
			player.pos.y -= 65;
			color("red");
			particle(
				player.pos.x + 3,
				125,
				25,
				0.5,
				PI/2,
				PI/1.5
			);
			play("explosion");
			player.jumpsLeft -= 1;
		//player is off ground
		} else {
			if (player.jumpsLeft == 1) {
				player.pos.y -= 40;
				color("red");
				particle(
					player.pos.x + 3,
					player.pos.y + 30,
					20,
					0.5,
					PI/2,
					PI/1.5
				);
				play("explosion");
				player.jumpsLeft = 0;
			}
		}
	}

	//player y position check
	if (player.pos.y <= 130) {
		player.pos.y += G.GRAVITY;
	} else {
		player.inAir = false;
		player.jumpsLeft = 2;
	}
	color("black");
    char("a", player.pos);
	char("b", (vec(player.pos.x + 3, player.pos.y)));
}
