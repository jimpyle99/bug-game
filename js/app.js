const SCALE = {
    x: 101,
    y: 83
};

const GRID = {
    xMin: 0,
    xMax: 4,
    yMin: 0,
    yMax: 5
};

const PLAYER_OFFSET = 40;
const BUG_OFFSET = 20;

// Speeds are in blocks per second
const BUG_MIN_SPEED = 1;
const BUG_MAX_SPEED = 4;

const Entity = function (x, y, offsetY) {
    this.x = x;
    this.y = y;
    this.offsetY = offsetY;
};

// Draw the entity on the screen, required method for game
Entity.prototype.render = function () {
    // Scale x and y from grid coordinates to pixels
    const pixelX = this.x * SCALE.x;
    const pixelY = this.y * SCALE.y - this.offsetY;
    ctx.drawImage(Resources.get(this.sprite), pixelX, pixelY);
};

// Enemies our player must avoid
const Enemy = function () {

    // Start Enemy off-screen, horizontally
    const startX = -1;

    // Start Enemy in random stone block row
    const startY = Math.floor(Math.random() * 3) + 1;

    // Set starting position and inherit Entity members
    Entity.call(this, startX, startY, BUG_OFFSET);

    this.sprite = 'images/enemy-bug.png';
    this.speed = BUG_MIN_SPEED + Math.random() * BUG_MAX_SPEED;
};

// Clone Entity prototype to share methods
Enemy.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Destroy this bug since he's off-screen and create a new one
    if (this.x > GRID.xMax + 1) {
        let index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
        allEnemies.push(new Enemy());
    }
};

const Player = function (x, y) {

    // Set starting position and inherit Entity members
    Entity.call(this, x, y, PLAYER_OFFSET);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

// Clone Entity prototype to share methods
Player.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Player.prototype.constructor = Player;

// Player warps from cell to cell so the 'dt' value is not needed
// Instead, check for player collisions with other Entities
Player.prototype.update = function () {

    // Only check Enemies that are on the same row
    if (player.y < 0) {
        console.log(player.y)
;    }
};

Player.prototype.handleInput = function (dir) {
    switch (dir) {
        case 'left':
            // set the new player location
            this.x -= 1;
            // ensure the player can't go outside the map
            this.x = Math.max(this.x, GRID.xMin);
            break;
        case 'up':
            this.y -= 1;
            this.y = Math.max(this.y, GRID.yMin);
            break;
        case 'right':
            this.x += 1;
            this.x = Math.min(this.x, GRID.xMax);
            break;
        case 'down':
            this.y += 1;
            this.y = Math.min(this.y, GRID.yMax);
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
window.allEnemies = [new Enemy(), new Enemy(), new Enemy()];
window.player = new Player(2, 5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
