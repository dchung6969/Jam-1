title = "Rock Climb";

description = `
`;

characters = [
`
l
l l l
 lll
  l
 l l
 l  l
`,`
    l
l l l
 lll
  l
 l l
l  l
`,`
 rrr
rrRRr
rrrRr
rrrrr
 rrr
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 150,
	STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
	ROCK_MIN_BASE_SPEED: 1,
	ROCK_MAX_BASE_SPEED: 2,
	ROCK_ROTATION_SPEED: 0.1
};

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	isReplayEnabled: true
};

/**
 * @typedef {{
 * pos: Vector,
 * mode: "left" | "right",
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * speed: number,
 * rotation: number
 * }} Rock
 */

/**
 * @type { Rock [] }
 */
let rocks;

/**
 * @type { number }
 */
let currentRockSpeed;

function update() {
	if (!ticks) {
		player = {
			pos: vec(50, 130), 
			mode: "left"
		};

		rocks = [];
		currentRockSpeed = 0;
	}
	//limit player movement
	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
	color("black");
	//player sprite/animation
	char(addWithCharCode("a", player.pos.y % 2), player.pos);
	//player movement
	player.pos = vec(input.pos.x, player.pos.y);
	
	//checking if there are rocks on the screen
	if (rocks.length === 0) {
		player.pos.y -= 0.3;
		for (let i = 0; i < rnd(2,7); i ++) {
			currentRockSpeed = rnd(G.ROCK_MIN_BASE_SPEED, G.ROCK_MAX_BASE_SPEED) * difficulty;
			const posX = rnd(G.WIDTH);
			const posY = rnd(0, 10);
			rocks.push({
				pos: vec(posX, posY),
				speed: currentRockSpeed,
				rotation: rnd(),
			})
		}
	}

	//update rocks and check if out of bounds or collided with player
	remove(rocks, (r) => {
		r.pos.y += r.speed;
		r.rotation += G.ROCK_ROTATION_SPEED;

		color("red");
		const c = char("c", r.pos, {rotation: r.rotation}).isColliding.char;
		particle(
			r.pos.x,
			r.pos.y,
			0.5,
			0.5,
			PI/2,
			PI/1.5
		);

		if (c.a || c.b) {
			play("hit");
			end();
		}

		if (r.pos.y > G.HEIGHT) {
			addScore(r.speed);
			return (r.pos.y > G.HEIGHT); 
		}
	});
}
