var SCALE = {
    x: 101,
    y: 83
};

var GRID = {
    xMin: 0,
    xMax: 4,
    yMin: 0,
    yMax: 5
};

var BOUNDS = {
    xMin: GRID.xMin,
    xMax: GRID.xMax * SCALE.x,
    yMin: (GRID.yMin - 0.5) * SCALE.y,
    yMax: (GRID.yMax - 0.5) * SCALE.y
};

// The bugs aren't the same height as the other objects
var BUG_OFFSET = 20;

// Speeds are in blocks per second
var BUG_MIN_SPEED = 1 * SCALE.x;
var BUG_MAX_SPEED = 3 * SCALE.x;

var Entity = function (x, y) {
    this.x = x;
    this.y = y;
};

// Draw the entity on the screen, required method for game
Entity.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function () {

    // Start Enemy off-screen, horizontally
    var startX = -SCALE.x;

    // Start Enemy in random stone block row
    var startY = 1;
    startY += Math.floor(Math.random() * 3);
    startY = startY * SCALE.y - BUG_OFFSET;

    // Set starting position and inherit Entity members
    Entity.call(this, startX, startY);

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
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
    if (this.x > BOUNDS.xMax + SCALE.x) {
        let index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
        allEnemies.push(new Enemy());
    }
};

// Don't need this. Inherited from Entity
// Draw the enemy on the screen, required method for game
// Enemy.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (gridX, gridY) {

    // Set starting position and inherit Entity members
    Entity.call(this, gridX * SCALE.x, (gridY - 0.5) * SCALE.y);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

// Clone Entity prototype to share methods
Player.prototype = Object.create(Entity.prototype);

// Change constructor for proper identification
Player.prototype.constructor = Player;

Player.prototype.update = function () {
};

Player.prototype.handleInput = function (dir) {
    var newX;
    var newY;

    switch (dir) {
        case 'left':
            // get the new player location
            newX = this.x - SCALE.x;

            // ensure the player can't go outside the map
            this.x = Math.max(newX, BOUNDS.xMin);
            break;
        case 'up':
            newY = this.y - SCALE.y;
            this.y = Math.max(newY, BOUNDS.yMin);
            break;
        case 'right':
            newX = this.x + SCALE.x;
            this.x = Math.min(newX, BOUNDS.xMax);
            break;
        case 'down':
            newY = this.y + SCALE.y;
            this.y = Math.min(newY, BOUNDS.yMax);
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
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
